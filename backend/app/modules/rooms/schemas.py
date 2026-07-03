from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class RoomCreate(BaseModel):
    room_number: str = Field(
        min_length=1,
        max_length=20,
    )

    room_type: str = Field(
        min_length=1,
        max_length=50,
    )

    capacity: int = Field(
        ge=1,
    )

    base_rent: float = Field(
        gt=0,
    )


class RoomUpdate(BaseModel):
    room_number: str | None = Field(
        default=None,
        min_length=1,
        max_length=20,
    )

    room_type: str | None = Field(
        default=None,
        min_length=1,
        max_length=50,
    )

    capacity: int | None = Field(
        default=None,
        ge=1,
    )

    base_rent: float | None = Field(
        default=None,
        gt=0,
    )


class RoomRead(BaseModel):
    id: UUID
    building_id: UUID

    room_number: str
    room_type: str

    capacity: int
    base_rent: float

    occupied: int
    available: int

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )