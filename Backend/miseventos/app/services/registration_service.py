# app/services/registration_service.py

from typing import List
from sqlalchemy.orm import Session
from sqlmodel import select

from app.models.user import User
from app.models.session import EventSession
from app.models.attendance import Attendance

class RegistrationError(Exception):
    """Excepción genérica para errores de registro."""
    pass

class AlreadyRegisteredError(RegistrationError):
    """El usuario ya está registrado."""
    pass

class SessionFullError(RegistrationError):
    """La sesión está llena."""
    pass

def register_user_for_session(db: Session, user: User, session: EventSession) -> Attendance:
    """
    Orquesta el proceso de registro de un usuario en una sesión.
    """
    # 1. Usa el método del modelo para la lógica de negocio encapsulada.
    if not session.can_register(user):
        # Aquí podemos ser más específicos sobre el error
        if session.is_full:
            raise SessionFullError("No se puede registrar: la sesión está llena.")
        else:
            raise AlreadyRegisteredError("El usuario ya está registrado en esta sesión.")

    # 2. Si las reglas de negocio pasan, el servicio crea el registro
    new_attendance = Attendance(user_id=user.id, session_id=session.id)
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    # 3. Aquí se podría llamar a un servicio de notificaciones
    # notification_service.send_registration_confirmation(user, session)
    
    return new_attendance

def cancel_registration(db: Session, user: User, session: EventSession) -> Attendance:
    """
    Cancela la asistencia de un usuario a una sesión.
    """
    attendance_record = db.exec(
        select(Attendance).where(Attendance.user_id == user.id, Attendance.session_id == session.id)
    ).first()

    if not attendance_record:
        raise RegistrationError("El usuario no tiene un registro en esta sesión para cancelar.")

    # Usa el método del modelo para cambiar el estado
    attendance_record.cancel()

    db.add(attendance_record)
    db.commit()
    db.refresh(attendance_record)
    
    return attendance_record

def get_user_registrations(db: Session, user: User) -> List[Attendance]:
    """
    Obtiene todos los eventos a los que un usuario está registrado.
    """
    # Usa la relación cargada en el objeto User si ya está disponible,
    # o realiza una consulta directa.
    return user.attendances
