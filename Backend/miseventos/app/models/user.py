from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, Relationship
from pydantic import EmailStr
from app.models.base import BaseModel
from app.utils.enums import UserRole
from app.core.security import password_context

if TYPE_CHECKING:
    from app.models.event import Event
    from app.models.attendance import Attendance


class User(BaseModel, table=True):
    """Modelo de tabla Usuario"""
    __tablename__ = "users"
    
    name: str = Field(index=True, min_length=1, max_length=255)
    email: EmailStr = Field(unique=True, index=True)
    password_hash: str = Field(nullable=False)
    role: UserRole = Field(default=UserRole.ATTENDEE)
    is_active: bool = Field(default=True)
    last_login: Optional[datetime] = Field(default=None, nullable=True)
    
    # Relaciones
    created_events: List["Event"] = Relationship(back_populates="creator")
    attendances: List["Attendance"] = Relationship(back_populates="user")

    def set_password(self, plain_password: str):
        """Hashea y establece la contraseña del usuario."""
        self.password_hash = password_context.hash(plain_password)

    def check_password(self, plain_password: str) -> bool:
        """Verifica una contraseña en texto plano contra el hash almacenado."""
        return password_context.verify(plain_password, self.password_hash)

    @property
    def is_admin(self) -> bool:
        """Propiedad para verificar si el usuario es Administrador."""
        return self.role == UserRole.ADMIN

    @property
    def is_organizer(self) -> bool:
        """Propiedad para verificar si el usuario es Organizador."""
        return self.role == UserRole.ORGANIZER