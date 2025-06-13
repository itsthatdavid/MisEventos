# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.services import auth_service
from app.schemas import user_schemas, token_schemas, auth_schemas
from app.dependencies import get_db, get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=user_schemas.UserRead, status_code=status.HTTP_201_CREATED)
def register_user(
    user_in: user_schemas.UserCreate,
    db: Session = Depends(get_db)
):
    """
    Endpoint para registrar un nuevo usuario.
    """
    try:
        created_user = auth_service.register_new_user(db=db, user_data=user_in)
        return created_user
    except auth_service.EmailAlreadyExistsError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )

@router.post("/login", response_model=token_schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Endpoint para el inicio de sesión usando OAuth2PasswordRequestForm.
    """
    user = auth_service.authenticate_user(db=db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth_service.create_access_token(user=user)
    
    return token_schemas.Token(access_token=access_token, token_type="bearer")

@router.post("/login-json", response_model=token_schemas.Token)
def login_with_json(
    login_data: auth_schemas.LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Endpoint alternativo para login con JSON (más conveniente para frontend).
    """
    user = auth_service.authenticate_user(db=db, email=login_data.email, password=login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth_service.create_access_token(user=user)
    
    return token_schemas.Token(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=user_schemas.UserRead)
def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Obtener información del usuario actual.
    """
    return current_user