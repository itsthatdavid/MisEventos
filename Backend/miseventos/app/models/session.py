from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, Relationship
from app.models.base import BaseModel
from app.utils.enums import SessionStatus
from app.utils.enums import SessionStatus, AttendanceStatus

if TYPE_CHECKING:
    from app.models.event import Event
    from app.models.attendance import Attendance


class EventSession(BaseModel, table=True):
    """Modelo de tabla Sesión de Evento"""
    __tablename__ = "event_sessions"
    
    event_id: int = Field(foreign_key="events.id", nullable=False)
    presenter: str = Field(min_length=1, max_length=255)
    status: SessionStatus = Field(default=SessionStatus.DRAFT)
    session_datetime: datetime
    specific_location: str = Field(min_length=1, max_length=500)
    max_capacity: int = Field(ge=1)
    session_resources: Optional[str] = Field(default=None)
    current_attendees: int = Field(default=0, ge=0)  # Contador de asistentes actuales
    
    # Relaciones
    event: "Event" = Relationship(back_populates="sessions")
    attendances: List["Attendance"] = Relationship(back_populates="session")

    @property
    def attendee_count(self) -> int:
        """Cuenta el número actual de asistentes confirmados."""
        # Esto asume que la relación `attendances` está cargada.
        # Filtra por un estado si es necesario, ej. CONFIRMED.
        return sum(1 for att in self.attendances if att.status == AttendanceStatus.CONFIRMED)

    @property
    def is_full(self) -> bool:
        """Verifica si la sesión ha alcanzado su capacidad máxima."""
        return self.attendee_count >= self.max_capacity

    def can_register(self, user: "User") -> bool:
        """Verifica si un usuario específico puede registrarse."""
        if self.is_full:
            return False
        # Verifica si el usuario ya está registrado en esta sesión
        for attendance in self.attendances:
            if attendance.user_id == user.id:
                return False
        return True