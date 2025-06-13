# app/routers/registrations.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models import User, EventSession
from app.schemas import attendance_schemas
from app.services import registration_service
from app.dependencies import get_db, get_current_active_user, get_session_by_id

router = APIRouter(
    prefix="/registrations",
    tags=["Event Registrations"]
)

@router.post("", response_model=attendance_schemas.AttendanceRead, status_code=status.HTTP_201_CREATED)
def register_for_session(
    registration_in: attendance_schemas.AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Registra al usuario autenticado en una sesión específica.
    """
    # Obtenemos la sesión usando una dependencia o directamente
    session = get_session_by_id(session_id=registration_in.session_id, db=db)
    
    try:
        return registration_service.register_user_for_session(db=db, user=current_user, session=session)
    except registration_service.RegistrationError as e:
        # Captura errores de negocio específicos del servicio
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_registration_for_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Cancela el registro del usuario autenticado para una sesión.
    """
    session = get_session_by_id(session_id=session_id, db=db)
    
    try:
        registration_service.cancel_registration(db=db, user=current_user, session=session)
    except registration_service.RegistrationError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    
    return None # Retorna 204 No Content
