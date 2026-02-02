import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "HireLens Agent"
    PROJECT_VERSION: str = "2.0.0"
    
    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./hirelens.db")
    
    # Security (JWT Tokens)
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecret_hirelens_key_change_this")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # AI Configuration (Gemini)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    
    if not GEMINI_API_KEY:
        print("⚠️ WARNING: GEMINI_API_KEY not found in .env file! AI features will fail.")

settings = Settings()