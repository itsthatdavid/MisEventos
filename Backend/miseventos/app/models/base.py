# app/models/base.py (Versión Mejorada)

from datetime import datetime
from typing import Optional, List, Type, TypeVar
from sqlmodel import Field, SQLModel, select
from sqlalchemy import event
from sqlalchemy.orm import Session, Mapper

# Para el método de clase get_all_active
T = TypeVar("T", bound="BaseModel")

# Listener para actualizar `updated_at` automáticamente
@event.listens_for(SQLModel, 'before_update', propagate=True)
def receive_before_update(mapper: Mapper, connection, target: "BaseModel"):
    """
    Listener de SQLAlchemy para actualizar `updated_at` antes de cada actualización.
    """
    if hasattr(target, 'updated_at'):
        target.updated_at = datetime.utcnow()

class BaseModel(SQLModel):
    """
    Modelo base mejorado.
    Incluye campos de auditoría, manejo de soft-delete y actualización
    automática de timestamps.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    deleted_at: Optional[datetime] = Field(default=None, nullable=True, index=True)

    @property
    def is_soft_deleted(self) -> bool:
        """Propiedad para verificar fácilmente si el registro está lógicamente eliminado."""
        return self.deleted_at is not None

    def soft_delete(self, db_session: Session):
        """
        Marca el registro como eliminado (soft delete).
        La transacción debe ser confirmada (commit) por el llamador.
        """
        self.deleted_at = datetime.utcnow()
        db_session.add(self)

    def revert_soft_delete(self, db_session: Session):
        """
        Revierte un soft delete.
        La transacción debe ser confirmada (commit) por el llamador.
        """
        self.deleted_at = None
        db_session.add(self)
        
    @classmethod
    def get_all_active(cls: Type[T], db: Session) -> List[T]:
        """
        Obtiene todos los registros que NO están lógicamente eliminados.
        """
        return db.exec(select(cls).where(cls.deleted_at == None)).all()