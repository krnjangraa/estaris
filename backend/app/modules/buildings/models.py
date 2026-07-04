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

    @property
    def occupancy_rate(self) -> float:
        total_capacity = sum(r.capacity for r in self.rooms)
        if total_capacity == 0:
            return 0.0
        occupied = sum(len([t for t in r.tenants if t.status == "active"]) for r in self.rooms)
        return round((occupied / total_capacity) * 100, 1)

    @property
    def monthly_rent_roll(self) -> float:
        total = 0.0
        for r in self.rooms:
            for t in r.tenants:
                if t.status == "active":
                    active_leases = [l for l in t.leases if l.status == "active"]
                    if active_leases:
                        total += float(active_leases[0].monthly_rent)
        return total

    @property
    def rent_due(self) -> float:
        total_due = 0.0
        for r in self.rooms:
            for t in r.tenants:
                for lease in t.leases:
                    for payment in lease.payments:
                        if payment.status in ["pending", "overdue"]:
                            total_due += float(payment.amount_due) - float(payment.amount_paid)
        return total_due