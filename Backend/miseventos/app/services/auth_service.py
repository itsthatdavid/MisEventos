# app/services/auth_service.py

from typing import Optional
from sqlalchemy.orm import Session
from sqlmodel import select

from app.models.user import User
# Asumimos que tienes schemas definidos para la creación de usuarios
# y un contexto de passlib en core.security
from app.schemas.user_schemas import UserCreateSchema
from app.core.security import password_context, create_jwt_token

class EmailAlreadyExistsError(Exception):
    """Excepción para cuando un email ya está registrado."""
    pass

def register_new_user(db: Session, user_data: UserCreateSchema) -> User:
    """
    Orquesta el registro de un nuevo usuario.

    1. Verifica que el email no esté ya en uso.
    2. Crea una instancia del modelo `User`.
    3. USA EL MÉTODO DEL MODELO: Llama a `user.set_password(plain_password)`.
    4. Guarda el nuevo usuario en la base de datos y hace commit.
    5. Retorna la instancia del usuario creado.
    """
    # 1. Verificar unicidad
    existing_user = db.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise EmailAlreadyExistsError("Un usuario con este email ya existe.")

    # 2. Crear el objeto a partir del schema, excluyendo la contraseña plana
    user_dict = user_data.model_dump(exclude={"password"})
    new_user = User(**user_dict)

    # 3. Usar el método del modelo para manejar la lógica de la contraseña
    new_user.set_password(user_data.password)

    # 4. Persistir y confirmar
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """
    Autentica a un usuario.

    1. Busca un usuario por su email.
    2. Si el usuario existe y está activo...
    3. USA EL MÉTODO DEL MODELO: Llama a `user.check_password(password)`.
    4. Si la contraseña es correcta, actualiza `user.last_login` y hace commit.
    5. Retorna el objeto `User` si la autenticación es exitosa, si no, `None`.
    """
    user = db.exec(select(User).where(User.email == email)).first()

    if not user or not user.is_active:
        return None

    # Usar el método del modelo para la lógica de verificación de contraseña
    if not user.check_password(password):
        return None
    
    # Actualizar último login como parte del proceso de autenticación exitoso
    user.last_login = datetime.utcnow()
    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def create_access_token(user: User) -> str:
    """
    Genera un token JWT para un usuario.
    Esta función utiliza una utilidad de seguridad.
    """
    return create_jwt_token(subject=user.email)
