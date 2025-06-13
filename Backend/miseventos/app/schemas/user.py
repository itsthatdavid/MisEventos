# app/schemas/user_schemas.py
from typing import Optional
from sqlmodel import SQLModel, Field
from app.utils.enums import UserRole

# Usamos SQLModel como base para mantener la coherencia.
# No tendrá `table=True`, por lo que actúa solo como un schema de Pydantic.

class UserBase(SQLModel):
    """Schema base del usuario con campos compartidos."""
    name: str = Field(min_length=1, max_length=255)
    email: str = Field(unique=True, index=True) # Usamos str y FastAPI se encarga de la validación de email
    role: UserRole = Field(default=UserRole.ATTENDEE)

class UserCreate(UserBase):
    """Schema para la data que se recibe al crear un usuario."""
    password: str = Field(min_length=8, max_length=100)

class UserUpdate(SQLModel):
    """
    Schema para actualizar un usuario. Todos los campos son opcionales.
    No hereda de UserBase para no forzar campos no deseados.
    """
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    email: Optional[str] = Field(default=None) # La validación de email la hace el endpoint
    is_active: Optional[bool] = None

class UserRead(UserBase):
    """Schema para la data que se envía al cliente (sin info sensible)."""
    id: int
    is_active: bool

class UserReadWithProfile(UserRead):
    """
    Schema para un perfil de usuario más detallado.
    Los campos adicionales se calculan en la capa de servicio.
    """
    total_events_created: int = 0
    total_events_attended: int = 0
