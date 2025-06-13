# app/services/event_service.py

from typing import List
from sqlalchemy.orm import Session

from app.models.event import Event
from app.models.user import User
from app.schemas.event_schemas import EventCreateSchema, EventUpdateSchema
from app.utils.enums import EventStatus

class EventCreationError(Exception):
    pass

class EventUpdateError(Exception):
    pass

def create_event(db: Session, event_data: EventCreateSchema, creator: User) -> Event:
    """
    Crea un nuevo evento.
    """
    # Crea la instancia asociando el id del creador
    new_event = Event.model_validate(event_data, update={"creator_id": creator.id})
    
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    
    return new_event

def update_event_details(db: Session, event: Event, event_update_data: EventUpdateSchema) -> Event:
    """
    Actualiza los detalles de un evento existente.
    """
    # model_dump(exclude_unset=True) es útil para obtener solo los campos que el cliente envió
    update_data = event_update_data.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(event, key, value)
        
    db.add(event)
    db.commit()
    db.refresh(event)
    
    return event

def publish_event(db: Session, event: Event) -> Event:
    """
    Publica un evento, orquestando la llamada al modelo.
    """
    try:
        # 1. El modelo contiene la lógica de negocio para la publicación
        event.publish()
    except ValueError as e:
        # Captura el error de negocio del modelo y lo convierte en un error de servicio
        raise EventUpdateError(str(e))

    # 2. El servicio se encarga de la persistencia
    db.add(event)
    db.commit()
    db.refresh(event)
    
    return event

def search_events_by_name(db: Session, query: str) -> List[Event]:
    """
    Busca eventos publicados por nombre (búsqueda insensible a mayúsculas).
    """
    return db.exec(
        select(Event)
        .where(Event.name.ilike(f"%{query}%"))
        .where(Event.status == EventStatus.PUBLISHED)
        .where(Event.deleted_at == None)
    ).all()
