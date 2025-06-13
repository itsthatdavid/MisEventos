# app/schemas/session_schemas.py
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from app.utils.enums import SessionStatus

class EventSessionBase(SQLModel):
    """Schema base para una sesión."""
    presenter: str = Field(min_length=1, max_length=255)
    session_datetime: datetime
    specific_location: str = Field(min_length=1, max_length=500)
    max_capacity: int = Field(ge=1)
    session_resources: Optional[str] = None

class EventSessionCreate(EventSessionBase):
    """Schema usado para crear una nueva sesión."""
    pass

class EventSessionUpdate(SQLModel):
    """Schema para actualizar una sesión. Todos los campos son opcionales."""
    presenter: Optional[str] = Field(default=None, min_length=1, max_length=255)
    session_datetime: Optional[datetime] = None
    specific_location: Optional[str] = Field(default=None, min_length=1, max_length=500)
    max_capacity: Optional[int] = Field(default=None, ge=1)
    session_resources: Optional[str] = None
    status: Optional[SessionStatus] = None

class EventSessionRead(EventSessionBase):
    """Schema para leer los datos de una sesión."""
    id: int
    event_id: int
    status: SessionStatus
    # Estos campos se poblarán automáticamente desde las @property del modelo
    # de EventSession gracias a `from_attributes=True` en los endpoints.
    attendee_count: int
    is_full: bool
