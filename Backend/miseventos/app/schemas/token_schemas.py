# app/schemas/token_schemas.py
from typing import Optional
from sqlmodel import SQLModel

class Token(SQLModel):
    """Schema de respuesta de token JWT."""
    access_token: str
    token_type: str = "bearer"

class TokenPayload(SQLModel):
    """Define la estructura del payload dentro del token JWT."""
    sub: Optional[str] = None # "Subject", típicamente el email o id del usuario
