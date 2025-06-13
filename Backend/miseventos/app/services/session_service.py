# app/services/session_service.py

from sqlalchemy.orm import Session
from app.models.event import Event
from app.models.session import EventSession
from app.schemas.session_schemas import SessionCreateSchema, SessionUpdateSchema

class SessionConflictError(Exception):
    """Excepción para cuando hay un conflicto de horarios."""
    pass

def _check_schedule_conflict(db: Session, event: Event, new_session_time: datetime, new_session_duration_minutes: int, exclude_session_id: int = None):
    """
    Lógica de negocio para validar conflictos de horarios.
    Esto es una responsabilidad del servicio porque necesita conocer
    todas las demás sesiones del evento.
    """
    end_new_session = new_session_time + timedelta(minutes=new_session_duration_minutes)
    
    query = select(EventSession).where(EventSession.event_id == event.id)
    if exclude_session_id:
        query = query.where(EventSession.id != exclude_session_id)
        
    existing_sessions = db.exec(query).all()
    
    for session in existing_sessions:
        event_duration = event.duration_minutes or 60 # Default duration
        end_existing_session = session.session_datetime + timedelta(minutes=event_duration)
        # Lógica de solapamiento simple
        if max(session.session_datetime, new_session_time) < min(end_existing_session, end_new_session):
            raise SessionConflictError(f"La sesión se solapa con otra sesión existente: {session.id}")


def add_session_to_event(db: Session, session_data: SessionCreateSchema, event: Event) -> EventSession:
    """
    Añade una nueva sesión a un evento.
    """
    _check_schedule_conflict(db, event, session_data.session_datetime, event.duration_minutes)
    
    new_session = EventSession.model_validate(session_data, update={"event_id": event.id})
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

def update_session_details(db: Session, session: EventSession, session_update_data: SessionUpdateSchema) -> EventSession:
    """
    Actualiza una sesión, verificando conflictos.
    """
    update_data = session_update_data.model_dump(exclude_unset=True)
    
    # Si se actualiza la fecha, hay que verificar conflictos
    if 'session_datetime' in update_data:
        _check_schedule_conflict(
            db,
            session.event, 
            update_data['session_datetime'], 
            session.event.duration_minutes,
            exclude_session_id=session.id
        )

    for key, value in update_data.items():
        setattr(session, key, value)
    
    db.add(session)
    db.commit()
    db.refresh(session)
    return session
