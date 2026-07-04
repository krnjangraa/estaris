from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.modules.tenants.models import TenantStatus


class TenantCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)

    permanent_address: str = Field(min_length=5, max_length=500)

    contact_number: str = Field(min_length=10, max_length=20)

    emergency_contact_name: str = Field(
        min_length=2,
        max_length=100,
    )

    emergency_contact_number: str = Field(
        min_length=10,
        max_length=20,
    )

    id_proof_type: str = Field(
        min_length=2,
        max_length=50,
    )

    id_proof_number: str = Field(
        min_length=2,
        max_length=100,
    )

    move_in_date: date


class TenantUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)

    permanent_address: str | None = Field(
        default=None,
        min_length=5,
        max_length=500,
    )

    contact_number: str | None = Field(
        default=None,
        min_length=10,
        max_length=20,
    )

    emergency_contact_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    emergency_contact_number: str | None = Field(
        default=None,
        min_length=10,
        max_length=20,
    )

    id_proof_type: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    id_proof_number: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    status: TenantStatus | None = None


class TenantRead(BaseModel):
    id: UUID
    room_id: UUID

    name: str
    permanent_address: str

    contact_number: str

    emergency_contact_name: str
    emergency_contact_number: str

    id_proof_type: str
    id_proof_number: str

    move_in_date: date

    status: TenantStatus
    monthly_rent: float | None = None

    created_at: datetime
    updated_at: datetime


    model_config = ConfigDict(
        from_attributes=True,
    )


class GlobalTenantRead(TenantRead):
    room_number: str
    building_name: str
    building_id: UUID