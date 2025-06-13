# app/schemas/auth_schemas.py

from sqlmodel import SQLModel, Field

# Nota: Usamos str para los emails y dejamos que FastAPI y Pydantic manejen
# la validación a nivel de endpoint.

class LoginRequest(SQLModel):
    """Schema para la solicitud de login que envía el cliente."""
    email: str
    password: str

class PasswordChange(SQLModel):
    """Schema para cuando un usuario logueado quiere cambiar su contraseña."""
    current_password: str
    new_password: str = Field(min_length=8, max_length=100)

class PasswordResetRequest(SQLModel):
    """Schema para solicitar un reseteo de contraseña (primer paso)."""
    email: str

class PasswordResetConfirm(SQLModel):
    """
    Schema para confirmar el reseteo de contraseña usando un token
    recibido por email (segundo paso).
    """
    token: str
    new_password: str = Field(min_length=8, max_length=100)