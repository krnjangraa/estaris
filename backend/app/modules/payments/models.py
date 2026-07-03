from datetime import date, datetime
from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Column, Date, DateTime, Enum as SQLEnum, ForeignKey, Integer, Numeric, String, UniqueConstraint
from sqlmodel import Field, Relationship

from app.db.base_model import TimestampedUUIDModel

if TYPE_CHECKING:
    from app.modules.leases.models import Lease


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    OVERDUE = "overdue"


class PaymentMethod(str, Enum):
    CASH = "cash"
    UPI = "upi"
    BANK_TRANSFER = "bank_transfer"
    CARD = "card"


class Payment(TimestampedUUIDModel, table=True):
    __tablename__ = "payments"
    __table_args__ = (
        UniqueConstraint(
            "lease_id",
            "billing_month",
            "billing_year",
            name="uq_lease_month_year",
        ),
    )

    lease_id: UUID = Field(
        sa_column=Column(
            ForeignKey("leases.id", ondelete="CASCADE"),
            nullable=False,
        )
    )

    billing_month: int = Field(
        ge=1,
        le=12,
    )

    billing_year: int = Field(
        ge=2024,
    )

    amount_due: float = Field(
        gt=0,
        sa_column=Column(
            Numeric(10, 2),
            nullable=False,
        ),
    )

    amount_paid: float = Field(
        ge=0,
        sa_column=Column(
            Numeric(10, 2),
            nullable=False,
        ),
    )

    payment_date: date = Field(
        sa_column=Column(
            Date,
            nullable=False,
        )
    )

    payment_method: PaymentMethod = Field(
        sa_column=Column(
            SQLEnum(
                PaymentMethod,
                values_callable=lambda x: [e.value for e in x],
                name="payment_method",
            ),
            nullable=False,
        )
    )

    status: PaymentStatus = Field(
        sa_column=Column(
            SQLEnum(
                PaymentStatus,
                values_callable=lambda x: [e.value for e in x],
                name="payment_status",
            ),
            nullable=False,
        )
    )

    transaction_reference: str | None = Field(
        default=None,
        sa_column=Column(
            String(100),
            nullable=True,
        ),
    )

    receipt_number: str = Field(
        sa_column=Column(
            String(50),
            nullable=False,
            unique=True,
        ),
    )

    remarks: str | None = Field(
        default=None,
        sa_column=Column(
            String(255),
            nullable=True,
        ),
    )

    reminder_sent_at: datetime | None = Field(
        default=None,
        sa_column=Column(
            DateTime(timezone=True),
            nullable=True,
        ),
    )

    lease: "Lease" = Relationship(
        back_populates="payments",
    )

    @property
    def tenant_name(self) -> str:
        return self.lease.tenant.name

    @property
    def room_number(self) -> str:
        return self.lease.tenant.room.room_number

    @property
    def building_name(self) -> str:
        return self.lease.tenant.room.building.name