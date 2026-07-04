from datetime import date
from enum import Enum
from typing import TYPE_CHECKING, List
from uuid import UUID

from sqlalchemy import Column, Enum as SQLEnum, ForeignKey, String, Date
from sqlmodel import Field, Relationship

from app.db.base_model import TimestampedUUIDModel

if TYPE_CHECKING:
    from app.modules.rooms.models import Room
    from app.modules.leases.models import Lease


class TenantStatus(str, Enum):
    ACTIVE = "active"
    VACATED = "vacated"


class Tenant(TimestampedUUIDModel, table=True):
    __tablename__ = "tenants"

    room_id: UUID = Field(
        sa_column=Column(
            ForeignKey("rooms.id", ondelete="RESTRICT"),
            nullable=False,
        )
    )

    name: str = Field(
        sa_column=Column(
            String(100),
            nullable=False,
        )
    )

    permanent_address: str = Field(
        sa_column=Column(
            String(500),
            nullable=False,
        )
    )

    contact_number: str = Field(
        sa_column=Column(
            String(20),
            nullable=False,
        )
    )

    emergency_contact_name: str = Field(
        sa_column=Column(
            String(100),
            nullable=False,
        )
    )

    emergency_contact_number: str = Field(
        sa_column=Column(
            String(20),
            nullable=False,
        )
    )

    id_proof_type: str = Field(
        sa_column=Column(
            String(50),
            nullable=False,
        )
    )

    id_proof_number: str = Field(
        sa_column=Column(
            String(100),
            nullable=False,
        )
    )

    move_in_date: date = Field(
        sa_column=Column(
            Date,
            nullable=False,
        )
    )

    status: TenantStatus = Field(
        default=TenantStatus.ACTIVE,
        sa_column=Column(
            SQLEnum(
                TenantStatus,
                values_callable=lambda enum: [e.value for e in enum],
                name="tenant_status",
            ),
            nullable=False,
        ),
    )

    room: "Room" = Relationship(
        back_populates="tenants",
    )
    leases: List["Lease"] = Relationship(
        back_populates="tenant",
    )

    @property
    def monthly_rent(self) -> float | None:
        active_leases = [l for l in self.leases if l.status == "active"]
        if active_leases:
            return float(active_leases[0].monthly_rent)
        return None

    @property
    def room_number(self) -> str:
        return self.room.room_number

    @property
    def building_name(self) -> str:
        return self.room.building.name

    @property
    def building_id(self) -> UUID:
        return self.room.building_id