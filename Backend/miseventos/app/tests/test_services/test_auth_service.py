# tests/test_services/test_auth_service.py

import pytest
from sqlalchemy.orm import Session
from app.services import auth_service
from app.schemas import user_schemas
from app.models import User

def test_register_new_user(db_session: Session):
    """
    Prueba unitaria para el servicio de registro de usuarios.
    Verifica el caso de éxito.
    """
    user_in = user_schemas.UserCreate(
        name="John Doe",
        email="john.doe@example.com",
        password="supersecretpassword123"
    )
    
    created_user = auth_service.register_new_user(db=db_session, user_data=user_in)
    
    assert created_user is not None
    assert created_user.email == user_in.email
    assert created_user.name == user_in.name
    assert created_user.id is not None
    # Verifica que la contraseña se haya hasheado y no esté en texto plano
    assert hasattr(created_user, "password_hash")
    assert created_user.password_hash != user_in.password

def test_register_user_with_existing_email(db_session: Session):
    """
    Prueba que el servicio lanza un error si el email ya existe.
    """
    # Primero, creamos un usuario
    user_in_1 = user_schemas.UserCreate(
        name="Jane Doe",
        email="jane.doe@example.com",
        password="password1"
    )
    auth_service.register_new_user(db=db_session, user_data=user_in_1)
    
    # Luego, intentamos crear otro con el mismo email
    user_in_2 = user_schemas.UserCreate(
        name="Jane Smith",
        email="jane.doe@example.com",
        password="password2"
    )
    
    # Usamos pytest.raises para verificar que se lanza la excepción correcta
    with pytest.raises(auth_service.EmailAlreadyExistsError):
        auth_service.register_new_user(db=db_session, user_data=user_in_2)

def test_authenticate_user_success(db_session: Session):
    """
    Prueba la autenticación exitosa de un usuario.
    """
    password = "a_very_good_password"
    user_in = user_schemas.UserCreate(
        name="Auth Test",
        email="auth.test@example.com",
        password=password
    )
    auth_service.register_new_user(db=db_session, user_data=user_in)
    
    authenticated_user = auth_service.authenticate_user(
        db=db_session, email=user_in.email, password=password
    )
    
    assert authenticated_user is not None
    assert authenticated_user.email == user_in.email

def test_authenticate_user_wrong_password(db_session: Session):
    """
    Prueba que la autenticación falla con una contraseña incorrecta.
    """
    user_in = user_schemas.UserCreate(
        name="Wrong Pass",
        email="wrong.pass@example.com",
        password="correct_password"
    )
    auth_service.register_new_user(db=db_session, user_data=user_in)
    
    authenticated_user = auth_service.authenticate_user(
        db=db_session, email=user_in.email, password="wrong_password"
    )
    
    assert authenticated_user is None
