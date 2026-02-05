import os

class Settings:
    PROJECT_NAME: str = "HireLens Agent"
    PROJECT_VERSION: str = "1.0.0"
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./hirelens.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")

settings = Settings()
