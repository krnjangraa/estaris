from datetime import date
from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Column, Date, Enum as SQLEnum, ForeignKey, Integer, Numeric, String
from sqlmodel import Field, Relationship

from app.db.base_model import TimestampedUUIDModel

if TYPE_CHECKING:
    from app.modules.leases.models import Lease


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    PARTIAL = "partial"


class PaymentMethod(str, Enum):
    CASH = "cash"
    UPI = "upi"
    BANK_TRANSFER = "bank_transfer"


class Payment(TimestampedUUIDModel, table=True):
    __tablename__ = "payments"

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

    remarks: str | None = Field(
        default=None,
        sa_column=Column(
            String(255),
            nullable=True,
        ),
    )

    lease: "Lease" = Relationship(
        back_populates="payments",
    )