import os
from decouple import config

class Settings:
    PROJECT_NAME: str = config("PROJECT_NAME", default="Mis Eventos API")
    API_V1_STR: str = config("API_V1_STR", default="/api/v1")
    ENVIRONMENT: str = config("ENVIRONMENT", default="local")
    DEBUG: bool = config("DEBUG", default=True, cast=bool)
    
    # Database
    DATABASE_URL: str = config("DATABASE_URL")
    
    # Security
    SECRET_KEY: str = config("SECRET_KEY")
    
    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT in ["local", "development"]

settings = Settings()