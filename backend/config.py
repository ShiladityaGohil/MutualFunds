import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database configuration
SQLALCHEMY_DATABASE_URI = os.getenv(
    'DATABASE_URL',
    f"postgresql://{os.getenv('DB_USER', 'postgres')}:{os.getenv('DB_PASSWORD', 'postgres')}@{os.getenv('DB_HOST', 'localhost')}/{os.getenv('DB_NAME', 'postgres')}"
)

# Handle Render's DATABASE_URL format (if present)
if SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)

SQLALCHEMY_TRACK_MODIFICATIONS = False

# API configuration
API_1_URL = os.getenv('API_1_URL', 'https://groww.in/v1/api/search/v3/query/global/st_p_query?entity_type=Scheme&page=0&size=10000')
API_2_TEMPLATE = os.getenv('API_2_TEMPLATE', 'https://groww.in/v1/api/data/mf/web/v4/scheme/search/{search_id}')

# Flask configuration
DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')
PORT = int(os.getenv('PORT', 9000))