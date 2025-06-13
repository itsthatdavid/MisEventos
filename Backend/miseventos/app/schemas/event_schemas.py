# app/schemas/event_schemas.py
from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field
from app.utils.enums import EventCategory, EventStatus
from .session_schemas import EventSessionRead # Asumiendo schemas en archivos separados

class EventBase(SQLModel):
    """Schema base del evento."""
    name: str = Field(min_length=1, max_length=255)
    general_location: str = Field(min_length=1, max_length=500)
    category: EventCategory
    description: str = Field(min_length=1)
    start_date: datetime
    end_date: datetime
    image_url: Optional[str] = Field(default=None, max_length=500)
    
    # La validación de fechas es una excelente idea, pero la haremos
    # en la capa de servicio para tener más control y mensajes de error más claros.

class EventCreate(EventBase):
    """Schema para crear un evento. Hereda todos los campos de EventBase."""
    pass

class EventUpdate(SQLModel):
    """Schema para actualizar un evento. Todos los campos son opcionales."""
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    general_location: Optional[str] = Field(default=None, min_length=1, max_length=500)
    category: Optional[EventCategory] = None
    description: Optional[str] = Field(default=None, min_length=1)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    image_url: Optional[str] = Field(default=None, max_length=500)
    status: Optional[EventStatus] = None # Permitir cambiar el estado manualmente si es necesario

class EventRead(EventBase):
    """Schema para leer un evento, incluyendo campos generados por la DB."""
    id: int
    creator_id: int
    status: EventStatus
    # El modelo de DB calculará esto con una @property, y from_attributes lo recogerá
    total_capacity: int 

class EventReadWithSessions(EventRead):
    """Schema para leer un evento con sus sesiones anidadas."""
    sessions: List[EventSessionRead] = []
