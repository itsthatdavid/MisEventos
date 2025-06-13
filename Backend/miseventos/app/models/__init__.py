# app/models/__init__.py

"""
Este archivo hace que las clases de modelo sean directamente importables
desde el paquete 'app.models', simplificando las importaciones en
otras partes de la aplicación.

Permite hacer:
    from app.models import User, Event

En lugar de:
    from app.models.user import User
    from app.models.event import Event
"""

# Importa el modelo base, aunque no siempre se usa directamente, es bueno tenerlo.
from .base import BaseModel

# Importa los modelos principales de la aplicación.
from .user import User
from .event import Event
from .session import EventSession
from .attendance import Attendance