from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, Relationship
from app.models.base import BaseModel
from app.utils.enums import EventCategory, EventStatus

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.session import EventSession


class Event(BaseModel, table=True):
    """Modelo de tabla Evento"""
    __tablename__ = "events"
    
    name: str = Field(index=True, min_length=1, max_length=255)
    general_location: str = Field(min_length=1, max_length=500)
    duration_minutes: Optional[int] = Field(default=None, ge=1)
    category: EventCategory
    description: str = Field(min_length=1)
    image_url: Optional[str] = Field(default=None, max_length=500)
    status: EventStatus = Field(default=EventStatus.DRAFT)
    start_date: datetime
    end_date: datetime
    event_resources: Optional[str] = Field(default=None)
    creator_id: int = Field(foreign_key="users.id", nullable=False)
    max_capacity: Optional[int] = Field(default=None, ge=1)  # Calculado desde sesiones
    
    # Relaciones
    creator: "User" = Relationship(back_populates="created_events")
    sessions: List["EventSession"] = Relationship(back_populates="event")

    def publish(self):
        """
        Publica el evento. Lanza un error si no cumple las condiciones.
        (Ej. de validación de negocio)
        """
        if self.status != EventStatus.DRAFT:
            raise ValueError("Solo los eventos en borrador pueden ser publicados.")
        if not self.sessions:
            raise ValueError("Un evento debe tener al menos una sesión para ser publicado.")
        self.status = EventStatus.PUBLISHED

    def cancel(self):
        """Cancela el evento."""
        if self.status not in [EventStatus.DRAFT, EventStatus.PUBLISHED]:
            raise ValueError("El evento no se puede cancelar en su estado actual.")
        self.status = EventStatus.CANCELLED

    @property
    def total_capacity(self) -> int:
        """Calcula la capacidad total del evento sumando la de sus sesiones."""
        if not self.sessions:
            return 0
        return sum(session.max_capacity for session in self.sessions)