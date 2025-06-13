# app/services/event_service.py
import math
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlmodel import select

from app.models.event import Event
from app.models.user import User
from app.schemas.event_schemas import EventCreate, EventUpdate, EventListResponse
from app.utils.enums import EventStatus

class EventCreationError(Exception):
    pass

class EventUpdateError(Exception):
    pass

def create_event(db: Session, event_data: EventCreate, creator: User) -> Event:
    """Crea un nuevo evento."""
    new_event = Event.model_validate(event_data, update={"creator_id": creator.id})
    
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    
    return new_event

from typing import Optional
from sqlmodel import Session, select
from sqlalchemy import func
import math

# Assuming these are your models/schemas
# from app.models import Event, EventStatus
# from app.schemas import EventListResponse

def get_events_paginated(
    db: Session, 
    page: int = 1, 
    limit: int = 10, 
    search: Optional[str] = None
) -> EventListResponse:
    """
    Obtiene eventos con paginación y búsqueda opcional de forma eficiente.
    """
    
    # 1. Build the base query with all filters ONCE.
    query = select(Event).where(
        Event.status == EventStatus.PUBLISHED,
        Event.deleted_at == None
    )
    if search:
        query = query.where(Event.name.ilike(f"%{search}%"))

    # 2. Get the total count from the filtered query.
    count_query = select(func.count()).select_from(query.subquery())
    
    # --- THIS IS THE FIX ---
    # Use .first() to prevent errors when the result is empty.
    total_count = db.execute(count_query).first() or 0

    # 3. Get the paginated results (the actual event objects).
    offset = (page - 1) * limit
    events = db.execute(query.offset(offset).limit(limit)).scalars().all()

    # 4. Return the final response.
    return EventListResponse(
        events=events,
        current_page=page,
        total_pages=math.ceil(total_count[0] / limit),
        total=total_count[0],
        limit=limit
    )

def update_event_details(db: Session, event: Event, event_update_data: EventUpdate) -> Event:
    """Actualiza los detalles de un evento."""
    update_data = event_update_data.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(event, key, value)
        
    db.add(event)
    db.commit()
    db.refresh(event)
    
    return event

def delete_event(db: Session, event: Event) -> None:
    """Elimina (soft delete) un evento."""
    from datetime import datetime
    event.deleted_at = datetime.utcnow()
    db.add(event)
    db.commit()

def publish_event(db: Session, event: Event) -> Event:
    """Publica un evento."""
    try:
        event.publish()
    except ValueError as e:
        raise EventUpdateError(str(e))

    db.add(event)
    db.commit()
    db.refresh(event)
    
    return event

def search_events_by_name(db: Session, query: str) -> List[Event]:
    """Busca eventos publicados por nombre."""
    return db.executeute(
        select(Event)
        .where(Event.name.ilike(f"%{query}%"))
        .where(Event.status == EventStatus.PUBLISHED)
        .where(Event.deleted_at == None)
    ).all()