from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.modules.payments.models import (
    PaymentMethod,
    PaymentStatus,
)


class PaymentCreate(BaseModel):
    billing_month: int = Field(ge=1, le=12)
    billing_year: int = Field(ge=2024)

    amount_due: float = Field(gt=0)
    amount_paid: float = Field(ge=0)

    payment_date: date

    payment_method: PaymentMethod

    status: PaymentStatus

    remarks: str | None = None


class PaymentUpdate(BaseModel):
    amount_due: float | None = Field(default=None, gt=0)

    amount_paid: float | None = Field(default=None, ge=0)

    payment_date: date | None = None

    payment_method: PaymentMethod | None = None

    status: PaymentStatus | None = None

    remarks: str | None = None


class PaymentRead(BaseModel):
    id: UUID

    lease_id: UUID

    billing_month: int
    billing_year: int

    amount_due: float
    amount_paid: float

    payment_date: date

    payment_method: PaymentMethod

    status: PaymentStatus

    remarks: str | None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )