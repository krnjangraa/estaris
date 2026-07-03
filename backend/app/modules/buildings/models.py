from typing import TYPE_CHECKING, List
from uuid import UUID

from sqlalchemy import Column, ForeignKey, String
from sqlmodel import Field, Relationship

from app.db.base_model import TimestampedUUIDModel

if TYPE_CHECKING:
    from app.modules.auth.models import Admin
    from app.modules.rooms.models import Room


class Building(TimestampedUUIDModel, table=True):
    __tablename__ = "buildings"

    admin_id: UUID = Field(
        sa_column=Column(
            ForeignKey("admins.id", ondelete="CASCADE"),
            nullable=False,
        )
    )

    name: str = Field(
        sa_column=Column(
            String(150),
            nullable=False,
            index=True,
        )
    )

    address: str = Field(
        sa_column=Column(
            String(500),
            nullable=False,
        )
    )

    total_rooms: int = Field(
        default=0,
        nullable=False,
        ge=0,
    )

    admin: "Admin" = Relationship(
        back_populates="buildings",
    )
    rooms: List["Room"] = Relationship(
        back_populates="building",
    )