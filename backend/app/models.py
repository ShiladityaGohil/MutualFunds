from . import db

class MutualFund(db.Model):
    __tablename__ = 'mutual_funds_details'
    __table_args__ = {'schema': 'basic_schema'}  # Specify the schema

    no = db.Column(db.Integer, primary_key=True)
    fund_id = db.Column(db.String, unique=True)
    search_id = db.Column(db.String)
    fund_title = db.Column(db.String)
    fund_expiry = db.Column(db.String)
    entity_type = db.Column(db.String)
    holdings_data = db.Column(db.JSON)