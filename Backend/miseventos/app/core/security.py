# app/core/security.py

from datetime import datetime, timedelta
from typing import Any, Union

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import settings

# --- Manejo de Contraseñas ---

# Se crea un contexto para el hashing de contraseñas.
# bcrypt es el algoritmo recomendado.
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Genera el hash de una contraseña.
    """
    return password_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica una contraseña en texto plano contra su hash.
    """
    return password_context.verify(plain_password, hashed_password)


# --- Manejo de JSON Web Tokens (JWT) ---

def create_jwt_token(
    subject: Union[str, Any], expires_delta: timedelta = None
) -> str:
    """
    Crea un nuevo token JWT.
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt

def decode_jwt_token(token: str) -> dict:
    """
    Decodifica un token JWT y devuelve su payload.
    Lanza JWTError si el token es inválido o ha expirado.
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError as e:
        # Podrías querer loguear el error aquí antes de relanzarlo o manejarlo.
        raise e
