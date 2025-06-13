# tests/test_routers/test_events_router.py

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.schemas import event_schemas
from app.utils.enums import EventCategory

def test_create_event(authenticated_client: TestClient, db_session: Session):
    """
    Prueba la creación de un evento a través del endpoint de la API.
    Utiliza un cliente ya autenticado.
    """
    event_data = {
        "name": "Mi Gran Evento de Prueba",
        "general_location": "Online",
        "category": EventCategory.CONFERENCE.value,
        "description": "Una descripción detallada del evento.",
        "start_date": "2025-10-20T10:00:00Z",
        "end_date": "2025-10-21T18:00:00Z"
    }
    
    response = authenticated_client.post("/events", json=event_data)
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == event_data["name"]
    assert data["creator_id"] is not None # Debe estar asociado al usuario autenticado
    assert "id" in data

def test_create_event_unauthenticated(client: TestClient):
    """
    Prueba que un usuario no autenticado no puede crear un evento.
    """
    event_data = {
        "name": "Evento No Autorizado",
        "general_location": "Anywhere",
        "category": EventCategory.WORKSHOP.value,
        "description": "...",
        "start_date": "2025-11-01T10:00:00Z",
        "end_date": "2025-11-01T12:00:00Z"
    }
    response = client.post("/events", json=event_data)
    
    # Esperamos un error 401 Unauthorized
    assert response.status_code == 401

def test_read_event(client: TestClient, authenticated_client: TestClient):
    """
    Prueba la lectura de un evento específico.
    """
    # Primero, creamos un evento para poder leerlo
    event_data = {
        "name": "Evento para Leer",
        "general_location": "Auditorio Principal",
        "category": EventCategory.SEMINAR.value,
        "description": "Info para leer",
        "start_date": "2025-12-01T09:00:00Z",
        "end_date": "2025-12-01T17:00:00Z"
    }
    response_create = authenticated_client.post("/events", json=event_data)
    created_event_id = response_create.json()["id"]
    
    # Ahora, intentamos leerlo con un cliente normal (no necesita estar autenticado)
    response_read = client.get(f"/events/{created_event_id}")
    
    assert response_read.status_code == 200
    data = response_read.json()
    assert data["id"] == created_event_id
    assert data["name"] == "Evento para Leer"
