# app/core/config.py
import os
from pydantic_settings import BaseSettings
from decouple import config

class Settings(BaseSettings):
    """
    Configuraciones de la aplicación cargadas desde variables de entorno.
    Compatible con tu .env existente y funciona para desarrollo local y Docker.
    """
    # --- General Project Settings ---
    PROJECT_NAME: str = config("PROJECT_NAME", default="MisEventos")
    API_V1_STR: str = config("API_V1_STR", default="/api/v1")
    ENVIRONMENT: str = config("ENVIRONMENT", default="local")
    DEBUG: bool = config("DEBUG", default=True, cast=bool)
    
    # --- Database Settings ---
    # Usamos las variables individuales que ya tienes
    POSTGRES_USER: str = config("POSTGRES_USER", default="miseventos_user")
    POSTGRES_PASSWORD: str = config("POSTGRES_PASSWORD", default="miseventos123")
    POSTGRES_SERVER: str = config("POSTGRES_SERVER", default="postgres")  # postgres for Docker, localhost for local
    POSTGRES_PORT: int = config("POSTGRES_PORT", default=5432, cast=int)
    POSTGRES_DB: str = config("POSTGRES_DB", default="miseventos_db")
    
    # Construye la URL de la base de datos automáticamente
    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@"
            f"{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # --- JWT Settings ---
    SECRET_KEY: str = config("SECRET_KEY", default="your-secret-key-here-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = config("ACCESS_TOKEN_EXPIRE_MINUTES", default=30, cast=int)

    @property
    def is_development(self) -> bool:
        """Propiedad para verificar fácilmente si el entorno es de desarrollo."""
        return self.ENVIRONMENT in ["local", "development"]
    
    @property
    def is_docker_environment(self) -> bool:
        """
        Detecta si estamos corriendo en Docker basándose en POSTGRES_SERVER.
        """
        return self.POSTGRES_SERVER == "postgres"

    class Config:
        case_sensitive = True

# Instancia global de settings
settings = Settings()