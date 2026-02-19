import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Use environment variable for DB connection, default to localhost postgres
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost/tinywarehouse')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
