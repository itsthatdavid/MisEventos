from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, Relationship
from app.models.base import BaseModel
from app.utils.enums import AttendanceStatus

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.session import EventSession


class Attendance(BaseModel, table=True):
    """Modelo de tabla Asistencia"""
    __tablename__ = "attendances"
    
    user_id: int = Field(foreign_key="users.id", nullable=False)
    session_id: int = Field(foreign_key="event_sessions.id", nullable=False)
    registration_date: datetime = Field(default_factory=datetime.utcnow)
    status: AttendanceStatus = Field(default=AttendanceStatus.CONFIRMED)
    attendee_role: Optional[str] = Field(default=None, max_length=100)
    
    # Índice único para evitar duplicados
    __table_args__ = (
        {"mysql_engine": "InnoDB"},
    )
    
    # Relaciones
    user: "User" = Relationship(back_populates="attendances")
    session: "EventSession" = Relationship(back_populates="attendances")

    def confirm(self):
        """Confirma la asistencia."""
        self.status = AttendanceStatus.CONFIRMED

    def cancel(self):
        """Cancela la asistencia."""
        self.status = AttendanceStatus.CANCELLED