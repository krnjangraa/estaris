from datetime import date
from enum import Enum
from typing import TYPE_CHECKING, List
from uuid import UUID

from sqlalchemy import Column, Date, Enum as SQLEnum, ForeignKey, Integer, Numeric
from sqlmodel import Field, Relationship

from app.db.base_model import TimestampedUUIDModel

if TYPE_CHECKING:
    from app.modules.tenants.models import Tenant
    from app.modules.payments.models import Payment


class LeaseStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    TERMINATED = "terminated"


class Lease(TimestampedUUIDModel, table=True):
    __tablename__ = "leases"

    tenant_id: UUID = Field(
        sa_column=Column(
            ForeignKey("tenants.id", ondelete="RESTRICT"),
            nullable=False,
        )
    )

    start_date: date = Field(
        sa_column=Column(
            Date,
            nullable=False,
        )
    )

    end_date: date = Field(
        sa_column=Column(
            Date,
            nullable=False,
        )
    )

    monthly_rent: float = Field(
        gt=0,
        sa_column=Column(
            Numeric(10, 2),
            nullable=False,
        ),
    )

    security_deposit: float = Field(
        ge=0,
        sa_column=Column(
            Numeric(10, 2),
            nullable=False,
        ),
    )

    payment_due_day: int = Field(
        ge=1,
        le=31,
        sa_column=Column(
            Integer,
            nullable=False,
        ),
    )

    status: LeaseStatus = Field(
        default=LeaseStatus.ACTIVE,
        sa_column=Column(
            SQLEnum(
                LeaseStatus,
                values_callable=lambda enum: [e.value for e in enum],
                name="lease_status",
            ),
            nullable=False,
        ),
    )

    tenant: "Tenant" = Relationship(
        back_populates="leases",
    )
    payments: List["Payment"] = Relationship(
        back_populates="lease",
    )