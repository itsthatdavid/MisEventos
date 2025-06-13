# app/dependencies.py

from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlmodel import select
from jose import jwt, JWTError

from app.core.db import SessionLocal
from app.core import security
from app.models import User, Event, EventSession

# Esquema de seguridad para obtener el token de la cabecera "Authorization"
oauth2_scheme = OAuth2PasswordBearer(token_url="/auth/login")

def get_db() -> Generator:
    """
    Generador de sesión de base de datos.
    """
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    """
    Decodifica el token JWT y obtiene el usuario actual.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = security.decode_jwt_token(token)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Verifica si el usuario actual está activo.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Dependencias para obtener objetos por ID, manejando el error 404
def get_event_by_id(event_id: int, db: Session = Depends(get_db)) -> Event:
    event = db.get(Event, event_id)
    if not event or event.deleted_at:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return event

def get_session_by_id(session_id: int, db: Session = Depends(get_db)) -> EventSession:
    session = db.get(EventSession, session_id)
    if not session or session.deleted_at:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return session
