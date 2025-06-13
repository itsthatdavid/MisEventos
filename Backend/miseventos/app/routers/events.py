# app/routers/events.py
from typing import List, Optional
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

@router.get("", response_model=event_schemas.EventListResponse)
def list_events(
    page: int = Query(1, ge=1, description="Número de página"),
    limit: int = Query(10, ge=1, le=100, description="Eventos por página"),
    search: Optional[str] = Query(None, description="Buscar por nombre"),
    db: Session = Depends(get_db)
):
    """
    Lista eventos con paginación y búsqueda opcional.
    """
    return event_service.get_events_paginated(
        db=db, 
        page=page, 
        limit=limit, 
        search=search
    )

@router.post("", response_model=event_schemas.EventRead, status_code=status.HTTP_201_CREATED)
def create_event(
    event_in: event_schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Crea un nuevo evento. Solo para usuarios autenticados.
    """
    return event_service.create_event(db=db, event_data=event_in, creator=current_user)

@router.get("/search", response_model=List[event_schemas.EventRead])
def search_events(
    q: str = Query(..., min_length=3, description="Texto de búsqueda"),
    db: Session = Depends(get_db)
):
    """
    Busca eventos públicos por nombre.
    """
    return event_service.search_events_by_name(db=db, query=q)

@router.get("/{event_id}", response_model=event_schemas.EventReadWithSessions)
def read_event(
    event: Event = Depends(get_event_by_id)
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
    """
    if event.creator_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this event")
    return event_service.update_event_details(db=db, event=event, event_update_data=event_update)

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event: Event = Depends(get_event_by_id),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Elimina (soft delete) un evento.
    """
    if event.creator_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this event")
    event_service.delete_event(db=db, event=event)

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

# --- Session Endpoints ---

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