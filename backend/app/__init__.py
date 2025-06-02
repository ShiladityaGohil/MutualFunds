from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)  # <-- Allow all origins
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

    db.init_app(app)

    with app.app_context():
        from .views import fund_routes
        app.register_blueprint(fund_routes)
        
    @app.route('/')
    def index():
        return 'Hello, Mutual Funds API is running!'

    return app
