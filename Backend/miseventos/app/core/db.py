# app/core/db.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from app.core.config import settings

# Crea el motor de SQLAlchemy usando la URL de la configuración.
# `pool_pre_ping=True` ayuda a manejar conexiones que se han cerrado por parte de la BD.
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Crea una clase SessionLocal que será la fábrica de sesiones de base de datos.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_db_and_tables():
    """
    Función para crear todas las tablas en la base de datos.
    Generalmente se llama una vez al inicio de la aplicación o se maneja con Alembic.
    """
    SQLModel.metadata.create_all(engine)
