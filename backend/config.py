import os

SQLALCHEMY_DATABASE_URI = os.getenv(
    'DATABASE_URL',
    'postgresql://postgres:postgres@localhost/postgres'
)
SQLALCHEMY_TRACK_MODIFICATIONS = False
