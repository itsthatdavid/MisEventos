# app/schemas/attendance_schemas.py
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from app.utils.enums import AttendanceStatus, EventCategory
from .user_schemas import UserRead
from .event_schemas import EventRead
from .session_schemas import EventSessionRead

class AttendanceBase(SQLModel):
    status: AttendanceStatus

class AttendanceCreate(SQLModel):
    """Schema para la solicitud de un usuario para registrarse en una sesión."""
    session_id: int

class AttendanceRead(AttendanceBase):
    """Schema para leer un registro de asistencia."""
    id: int
    user_id: int
    session_id: int
    registration_date: datetime

class AttendanceReadWithDetails(AttendanceRead):
    """Schema para ver una asistencia con detalles del usuario y la sesión."""
    user: UserRead
    session: EventSessionRead

# Schema específico para la ruta `users/me/events`
class UserEventRegistration(SQLModel):
    """Schema optimizado para mostrar los eventos registrados de un usuario."""
    event_name: str
    event_category: EventCategory
    session_datetime: datetime
    session_location: str
    registration_status: AttendanceStatus
    event_id: int
    session_id: int
