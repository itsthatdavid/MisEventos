# tests/conftest.py

import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from app.main import app # Importa tu aplicación FastAPI
from app.core.config import settings
from app.dependencies import get_db
from app.models import User # Importa tus modelos
from app.services import auth_service
from app.schemas import user_schemas

# --- Configuración de la Base de Datos de Prueba ---

# Usamos una base de datos en memoria (SQLite) para las pruebas
# para que sean rápidas y no interfieran con tu DB de desarrollo.
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    """
    Fixture para crear la base de datos de prueba una vez por sesión.
    """
    SQLModel.metadata.create_all(bind=engine)
    yield
    SQLModel.metadata.drop_all(bind=engine)

# --- Fixtures de Pytest ---

@pytest.fixture(scope="function")
def db_session() -> Generator:
    """
    Fixture para crear una sesión de base de datos para cada función de prueba.
    Usa un generador para abrir la sesión al inicio y cerrarla al final.
    """
    connection = engine.connect()
    transaction = connection.begin()
    db = TestingSessionLocal(bind=connection)
    
    yield db
    
    db.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="module")
def client(db_session) -> Generator:
    """
    Fixture para crear un TestClient de FastAPI.
    Sobrescribe la dependencia `get_db` para usar nuestra sesión de prueba.
    """
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    # Limpia la sobrescritura después de las pruebas del módulo
    app.dependency_overrides.clear()


@pytest.fixture(scope="module")
def test_user(db_session) -> User:
    """
    Crea un usuario de prueba en la base de datos.
    """
    user_in = user_schemas.UserCreate(
        name="Test User",
        email="test@example.com",
        password="a_secure_password"
    )
    return auth_service.register_new_user(db=db_session, user_data=user_in)

@pytest.fixture(scope="module")
def authenticated_client(client, test_user) -> TestClient:
    """
    Devuelve un TestClient que ya está autenticado como el usuario de prueba.
    """
    login_data = {
        "username": test_user.email,
        "password": "a_secure_password"
    }
    response = client.post("/auth/login", data=login_data)
    token = response.json()["access_token"]
    
    # Añade la cabecera de autorización para todas las peticiones futuras con este cliente
    client.headers["Authorization"] = f"Bearer {token}"
    return client
