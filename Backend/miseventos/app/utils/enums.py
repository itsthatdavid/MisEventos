from enum import Enum


class EventCategory(str, Enum):
    """Categorías de eventos disponibles"""
    CONFERENCE = "conference"
    WORKSHOP = "workshop"
    SEMINAR = "seminar"
    MEETUP = "meetup"
    WEBINAR = "webinar"
    TRAINING = "training"
    SOCIAL = "social"
    OTHER = "other"


class EventStatus(str, Enum):
    """Estados posibles de un evento"""
    DRAFT = "draft"
    PUBLISHED = "published"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    SUSPENDED = "suspended"


class SessionStatus(str, Enum):
    """Estados posibles de una sesión"""
    DRAFT = "draft"
    TEASER = "teaser"
    PRESALE = "presale"
    SALE = "sale"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    SUSPENDED = "suspended"


class UserRole(str, Enum):
    """Roles de usuario en el sistema"""
    ADMIN = "admin"
    ORGANIZER = "organizer"
    ATTENDEE = "attendee"


class AttendanceStatus(str, Enum):
    """Estados de registro de asistencia"""
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    WAITLIST = "waitlist"