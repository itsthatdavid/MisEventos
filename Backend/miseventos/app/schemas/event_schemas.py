# app/schemas/event_schemas.py
from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field
from app.utils.enums import EventCategory, EventStatus
from .session_schemas import EventSessionRead

class EventBase(SQLModel):
    """Schema base del evento."""
    name: str = Field(min_length=1, max_length=255)
    general_location: str = Field(min_length=1, max_length=500)
    category: EventCategory
    description: str = Field(min_length=1)
    start_date: datetime
    end_date: datetime
    image_url: Optional[str] = Field(default=None, max_length=500)

class EventCreate(EventBase):
    """Schema para crear un evento."""
    pass

class EventUpdate(SQLModel):
    """Schema para actualizar un evento."""
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    general_location: Optional[str] = Field(default=None, min_length=1, max_length=500)
    category: Optional[EventCategory] = None
    description: Optional[str] = Field(default=None, min_length=1)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    image_url: Optional[str] = Field(default=None, max_length=500)
    status: Optional[EventStatus] = None

class EventRead(EventBase):
    """Schema para leer un evento."""
    id: int
    creator_id: int
    status: EventStatus
    total_capacity: int

class EventReadWithSessions(EventRead):
    """Schema para leer un evento con sus sesiones."""
    sessions: List[EventSessionRead] = []

class EventListResponse(SQLModel):
    """Schema para respuesta paginada de eventos."""
    events: List[EventRead]
    current_page: int
    total_pages: int
    total: int
    limit: int