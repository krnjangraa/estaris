from enum import Enum
from typing import TYPE_CHECKING, List

from sqlalchemy import Column, Enum as SQLEnum, String
from sqlmodel import Field, Relationship

from app.db.base_model import TimestampedUUIDModel

if TYPE_CHECKING:
    from app.modules.buildings.models import Building


class AdminRole(str, Enum):
    OWNER = "owner"
    MANAGER = "manager"
    STAFF = "staff"


class Admin(TimestampedUUIDModel, table=True):
    __tablename__ = "admins"

    name: str = Field(
        sa_column=Column(
            String(100),
            nullable=False,
            index=True,
        )
    )

    email: str = Field(
        sa_column=Column(
            String(255),
            unique=True,
            nullable=False,
            index=True,
        )
    )

    password_hash: str = Field(
        sa_column=Column(
            String,
            nullable=False,
        )
    )

    role: AdminRole = Field(
        default=AdminRole.OWNER,
        sa_column=Column(
            SQLEnum(
                AdminRole,
                values_callable=lambda enum: [e.value for e in enum],
                name="admin_role",
            ),
            nullable=False,
        ),
    )

    buildings: List["Building"] = Relationship(
        back_populates="admin"
    )