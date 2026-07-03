from typing import TYPE_CHECKING, List, Optional
from uuid import UUID

from sqlalchemy import Column, ForeignKey, Integer, Numeric, String, UniqueConstraint
from sqlmodel import Field, Relationship

from app.db.base_model import TimestampedUUIDModel

if TYPE_CHECKING:
    from app.modules.buildings.models import Building
    from app.modules.tenants.models import Tenant


class Room(TimestampedUUIDModel, table=True):
    __tablename__ = "rooms"
    __table_args__ = (
        UniqueConstraint(
            "building_id",
            "room_number",
            name="uq_room_number_per_building",
        ),
    )

    building_id: UUID = Field(
        sa_column=Column(
            ForeignKey("buildings.id", ondelete="CASCADE"),
            nullable=False,
        )
    )

    room_number: str = Field(
        sa_column=Column(
            String(20),
            nullable=False,
        )
    )

    room_type: str = Field(
        sa_column=Column(
            String(50),
            nullable=False,
        )
    )

    capacity: int = Field(
        sa_column=Column(
            Integer,
            nullable=False,
        ),
        ge=1,
    )

    base_rent: float = Field(
        sa_column=Column(
            Numeric(10, 2),
            nullable=False,
        ),
        gt=0,
    )

    building: "Building" = Relationship(
        back_populates="rooms",
    )
    tenants: List["Tenant"] = Relationship(
        back_populates="room",
    )

    @property
    def occupied(self) -> int:
        return sum(1 for t in self.tenants if t.status == "active")

    @property
    def available(self) -> int:
        return self.capacity - self.occupied