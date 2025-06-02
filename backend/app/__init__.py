from flask import Flask
import os
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    # Configure CORS - allow specific origins in production
    if 'RENDER' in os.environ:
        # For production on Render, specify allowed origins
        CORS(app, resources={r"/api/*": {"origins": [
            "https://your-frontend-domain.com",  # Replace with your actual frontend domain
            "https://your-app-name.onrender.com"  # Replace with your Render frontend URL
        ]}})
    else:
        # For development, allow all origins
        CORS(app)
    
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