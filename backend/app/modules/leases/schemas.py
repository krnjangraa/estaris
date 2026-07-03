from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.modules.leases.models import LeaseStatus


class LeaseCreate(BaseModel):
    start_date: date
    end_date: date

    monthly_rent: float = Field(gt=0)
    security_deposit: float = Field(ge=0)

    payment_due_day: int = Field(
        ge=1,
        le=31,
    )


class LeaseUpdate(BaseModel):
    end_date: date | None = None

    monthly_rent: float | None = Field(
        default=None,
        gt=0,
    )

    security_deposit: float | None = Field(
        default=None,
        ge=0,
    )

    payment_due_day: int | None = Field(
        default=None,
        ge=1,
        le=31,
    )

    status: LeaseStatus | None = None


class LeaseRead(BaseModel):
    id: UUID

    tenant_id: UUID

    start_date: date
    end_date: date

    monthly_rent: float
    security_deposit: float

    payment_due_day: int

    status: LeaseStatus

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class GlobalLeaseRead(LeaseRead):
    tenant_name: str
    room_number: str
    building_name: str