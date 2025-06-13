# app/schemas/__init__.py

"""
Este archivo convierte la carpeta 'schemas' en un paquete de Python
y expone las clases de esquemas más importantes para facilitar su importación.
"""

from .user_schemas import UserCreate, UserUpdate, UserRead, UserReadWithProfile
from .event_schemas import EventCreate, EventUpdate, EventRead, EventReadWithSessions
from .session_schemas import EventSessionCreate, EventSessionUpdate, EventSessionRead
from .token_schemas import Token, TokenPayload
from .attendance_schemas import AttendanceCreate, AttendanceRead, AttendanceReadWithDetails, UserEventRegistration
from .auth_schemas import LoginRequest, PasswordChange, PasswordResetRequest, PasswordResetConfirm