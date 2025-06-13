# app/routers/events.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.models import User, Event
from app.schemas import event_schemas, session_schemas
from app.services import event_service, session_service
from app.dependencies import get_db, get_current_active_user, get_event_by_id

router = APIRouter(
    prefix="/events",
    tags=["Events & Sessions"]
)

# --- Event Endpoints ---

@router.post("", response_model=event_schemas.EventRead, status_code=status.HTTP_201_CREATED)
def create_event(
    event_in: event_schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user) # Proteger ruta
):
    """
    Crea un nuevo evento. Solo para usuarios autenticados.
    (Aquí se podría añadir lógica de roles, ej. `Depends(get_current_organizer)`)
    """
    return event_service.create_event(db=db, event_data=event_in, creator=current_user)

@router.get("/search", response_model=List[event_schemas.EventRead])
def search_events(
    q: str = Query(..., min_length=3, description="Texto de búsqueda para el nombre del evento"),
    db: Session = Depends(get_db)
):
    """
    Busca eventos públicos por nombre.
    """
    return event_service.search_events_by_name(db=db, query=q)

@router.get("/{event_id}", response_model=event_schemas.EventReadWithSessions)
def read_event(
    event: Event = Depends(get_event_by_id) # Usa una dependencia para obtener el evento
):
    """
    Obtiene los detalles de un evento específico, incluyendo sus sesiones.
    """
    return event

@router.patch("/{event_id}", response_model=event_schemas.EventRead)
def update_event(
    event_update: event_schemas.EventUpdate,
    event: Event = Depends(get_event_by_id),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Actualiza un evento.
    (Aquí se debería verificar que `current_user` es el `creator` del evento).
    """
    if event.creator_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this event")
    return event_service.update_event_details(db=db, event=event, event_update_data=event_update)


@router.post("/{event_id}/publish", response_model=event_schemas.EventRead)
def publish_event(
    event: Event = Depends(get_event_by_id),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Publica un evento.
    """
    if event.creator_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to publish this event")
    
    try:
        return event_service.publish_event(db=db, event=event)
    except event_service.EventUpdateError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# --- Session Endpoints (Nested under events) ---

@router.post("/{event_id}/sessions", response_model=session_schemas.EventSessionRead, status_code=status.HTTP_201_CREATED)
def add_session_to_event(
    session_in: session_schemas.EventSessionCreate,
    event: Event = Depends(get_event_by_id),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Añade una sesión a un evento existente.
    """
    if event.creator_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to add sessions to this event")
    
    try:
        return session_service.add_session_to_event(db=db, session_data=session_in, event=event)
    except session_service.SessionConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
