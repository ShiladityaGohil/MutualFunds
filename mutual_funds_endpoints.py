from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

BASE_URL_ALL_MUTUAL_FUNDS = "https://groww.in/v1/api/search/v3/query/global/st_p_query"
BASE_URL_MUTUAL_FUND_HOLDINGS = f"https://groww.in/v1/api/data/mf/web/v4/scheme/search"


@app.route('/api/v1/mutualfunds/search', methods = ['GET'])

def search_mutual_fund():
    
    search_input = request.args.get('query')
    page_number = request.args.get('page', default=0, type=int)
    page_size = request.args.get('size', default=50, type=int)
    
    params = {
        "entity_type": "scheme",
        "web": "true",
        "page": page_number,
        "size": page_size, 
        "query": search_input
    }
    url = BASE_URL_ALL_MUTUAL_FUNDS
    
    response = requests.get(url=url, params=params)
    try:
        if response.status_code == 200:
            data = response.json()
            result_data = []
            
            for fund in data["data"]["content"]:
                funds = {
                    "entity_type": fund["entity_type"],
                    "expiry": fund["expiry"],
                    "id": fund["id"],
                    "search_id": fund["search_id"],
                    "title": fund["title"]
                }
                result_data.append(funds)
            
            return jsonify(
                    {
                        "total_records" : len(data["data"]["content"]),
                        "funds": result_data
                    }
                ),200
            
        else:
            return jsonify(
                {
                    "error": f"Invalid search input: {search_input}"
                }
            ), 400
    except Exception as e:
        return jsonify(
            {
                "error": str(e)
            }
        ), 400
               



@app.route('/api/v1/mutualfunds/holdings/<string:search_input>', methods = ['GET'])

def get_individual_mutual_fund_holding(search_input):
    url = f"{BASE_URL_MUTUAL_FUND_HOLDINGS}/{search_input}"
    
    response = requests.get(url)
    try:
        if response.status_code == 200:
            data = response.json()
        
            result_data = []        
            for holding in data.get('holdings', []):
                holdings = {
                    "scheme_code": holding["scheme_code"], 
                    "company_name"  : holding["company_name"],
                    "corpus_per": holding["corpus_per"],
                    "instrument_name" : holding["instrument_name"],
                    "sector_name": holding["sector_name"], 
                    "market_value": holding["market_value"],
                    "stock_search_id": holding["stock_search_id"]  
                }
                result_data.append(holdings)
                
            return jsonify(
                {
                    "total_holdings": len(data["holdings"]),
                    "holdings": result_data
                }
            ), 200
        else:
            return jsonify(
                {
                    "error" : f"Invalid Mutual Fund Input {search_input}"   
                }
            ), 400
    except Exception as e:
        return jsonify(
            {
                "error": str(e)
            }
        ), 400

def handle_company_name(company_name):
    if company_name is None:
        return "unknown"
    else:
        return company_name.lower()

@app.route('/api/v1/mutualfunds/compare', methods = ['POST'])
def compare_holdings_of_mutual_funds():
    
    try:
        data = request.get_json()
        
        common_holdings = []
        unique_holdings_first_scheme = []
        unique_holdings_second_scheme = []
        
        first_scheme_holdings = data.get('first_scheme_holdings', {}).get('holdings', [])
        second_scheme_holdings = data.get('second_scheme_holdings', {}).get('holdings', [])
        
        for i in first_scheme_holdings:
            i_name = handle_company_name(i['company_name'])
            for j in second_scheme_holdings:
                j_name = handle_company_name(j['company_name'])
                if i_name == j_name:
                    common_holdings.append(i)
                    
        for i in first_scheme_holdings:
            if i not in common_holdings:
                unique_holdings_first_scheme.append(i)

        # Find unique holdings in ph2
        for i in second_scheme_holdings:
            if i not in common_holdings:
                unique_holdings_second_scheme.append(i)
                
        response = {
            "common_holdings": common_holdings,
            "total_records": len(common_holdings),
            "unique_holdings_scheme_1": unique_holdings_first_scheme,
            "total_unique_records_scheme_1": len(unique_holdings_first_scheme),
            "unique_holdings_scheme_2" : unique_holdings_second_scheme,
            "total_unique_records_scheme_2": len(unique_holdings_second_scheme)
        }
        return jsonify(
            response        
        ), 200
    
    except Exception as e:
        return jsonify(
            {
                "error": str(e)
            }
        ), 400

if __name__ == '__main__':
    app.run(debug=True)