# app/routers/users.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas import user_schemas, attendance_schemas
from app.dependencies import get_db, get_current_active_user
from app.services import registration_service

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me", response_model=user_schemas.UserRead)
def read_users_me(
    current_user: User = Depends(get_current_active_user)
):
    """
    Obtiene el perfil del usuario actualmente autenticado.
    """
    return current_user

@router.get("/me/registrations", response_model=List[attendance_schemas.UserEventRegistration])
def get_my_registrations(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene una lista de todos los eventos/sesiones a los que el usuario
    actual está registrado.
    """
    # El servicio obtiene los datos crudos de asistencia
    attendances = registration_service.get_user_registrations(db=db, user=current_user)
    
    # Transformamos los datos al schema específico que el frontend necesita
    registrations = []
    for att in attendances:
        registrations.append(
            attendance_schemas.UserEventRegistration(
                event_name=att.session.event.name,
                event_category=att.session.event.category,
                session_datetime=att.session.session_datetime,
                session_location=att.session.specific_location,
                registration_status=att.status,
                event_id=att.session.event.id,
                session_id=att.session.id
            )
        )
    return registrations
