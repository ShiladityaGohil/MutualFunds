from flask import Blueprint, request, jsonify
from .models import MutualFund
from . import db

fund_routes = Blueprint('fund_routes', __name__)

@fund_routes.route('/api/v1/mutual-funds/search', methods=['GET'])
def search_fund_by_title():
    query = request.args.get('title')

    if not query or len(query.strip()) < 1:
        return jsonify({"error": "Please provide at least 1 characters for the 'title' parameter"}), 400

    results = MutualFund.query.filter(
        MutualFund.fund_title.ilike(f'%{query}%'),
        MutualFund.fund_expiry.is_(None)
    ).all()

    if not results:
        return jsonify({
            "total_records": 0,
            "data": [],
            "message": "No matching funds found"
        }), 404

    return jsonify({
        "total_records": len(results),
        "data": [
            {
                "search_id": fund.search_id,
                "fund_title": fund.fund_title,
            } for fund in results
        ]
    })

@fund_routes.route('/api/v1/mutual-funds/<search_id>/holdings', methods=['GET'])
def get_fund_holdings(search_id):
    fund = MutualFund.query.filter_by(search_id=search_id).filter(MutualFund.fund_expiry.is_(None)).first()
    
    if not fund:
        return jsonify({"error": "Fund not found"}), 404
    
    holdings_data = fund.holdings_data.get('holdings', []) if fund.holdings_data else []
    
    return jsonify({
        "fund_title": fund.fund_title,
        "search_id": fund.search_id,
        "total_holdings": len(holdings_data),
        "holdings_data": holdings_data
    })

@fund_routes.route('/api/v1/mutual-funds/compare-holdings', methods=['GET'])
def compare_holdings():
    try:
        fund1_id = request.args.get('fund1')
        fund2_id = request.args.get('fund2')

        if not fund1_id or not fund2_id:
            return jsonify({"error": "Both 'fund1' and 'fund2' query parameters are required"}), 400

        if fund1_id == fund2_id:
            return jsonify({"error": "Cannot compare a fund with itself"}), 400

        fund1 = MutualFund.query.filter_by(search_id=fund1_id).filter(MutualFund.fund_expiry.is_(None)).first()
        fund2 = MutualFund.query.filter_by(search_id=fund2_id).filter(MutualFund.fund_expiry.is_(None)).first()

        if not fund1 or not fund2:
            return jsonify({"error": "One or both funds not found"}), 404

        holdings1 = (fund1.holdings_data or {}).get('holdings', [])
        holdings2 = (fund2.holdings_data or {}).get('holdings', [])

        # Build lookup for quick match by company_name (case insensitive)
        lookup1 = {h.get("company_name", "").strip().lower(): h for h in holdings1 if h.get("company_name")}
        lookup2 = {h.get("company_name", "").strip().lower(): h for h in holdings2 if h.get("company_name")}

        common = []
        unique1 = []
        unique2 = []

        for cname, h1 in lookup1.items():
            if cname in lookup2:
                h2 = lookup2[cname]
                common.append({
                    "company_name": h1.get("company_name"),
                    "instrument_name": h1.get("instrument_name"),
                    "market_value": h1.get("market_value"),
                    "scheme_code": h1.get("scheme_code"),
                    "sector_name": h1.get("sector_name"),
                    "stock_search_id": h1.get("stock_search_id"),
                    "fund1_weight": h1.get("corpus_per"),
                    "fund2_weight": h2.get("corpus_per"),
                })
            else:
                unique1.append(h1)

        for cname, h2 in lookup2.items():
            if cname not in lookup1:
                unique2.append(h2)

        return jsonify({
            "fund1": {
                "search_id": fund1.search_id,
                "fund_title": fund1.fund_title,
                "total_holdings": len(holdings1)
            },
            "fund2": {
                "search_id": fund2.search_id,
                "fund_title": fund2.fund_title,
                "total_holdings": len(holdings2)
            },
            "common_holdings": common,
            "total_common_holdings": len(common),
            "unique_holdings_fund1": unique1,
            "total_unique_holdings_fund1": len(unique1),
            "unique_holdings_fund2": unique2,
            "total_unique_holdings_fund2": len(unique2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500