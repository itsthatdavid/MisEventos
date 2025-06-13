# alembic/env.py - Versión mejorada
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import sys
import sqlmodel

# Agregar el directorio de la app al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Importar configuración y modelos específicos
from app.core.config import settings
from app.models.base import BaseModel
from app.models.user import User
from app.models.event import Event
from app.models.session import EventSession
from app.models.attendance import Attendance

# this is the Alembic Config object
config = context.config

# Override con la URL dinámica de configuración
database_url = os.getenv("DATABASE_URL") or settings.DATABASE_URL
config.set_main_option("sqlalchemy.url", database_url)

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set target metadata for autogenerate support
target_metadata = BaseModel.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,  # Detecta cambios de tipo
        compare_server_default=True,  # Detecta cambios de defaults
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata,
            compare_type=True,  # Detecta cambios de tipo
            compare_server_default=True,  # Detecta cambios de defaults
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()