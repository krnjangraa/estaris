from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class BuildingCreate(BaseModel):
    name: str
    address: str


class BuildingUpdate(BaseModel):
    name: str | None = None
    address: str | None = None


class BuildingRead(BaseModel):
    id: UUID
    admin_id: UUID

    name: str
    address: str
    total_rooms: int
    occupancy_rate: float
    monthly_rent_roll: float
    rent_due: float



    created_at: datetime
    updated_at: datetime


    model_config = ConfigDict(
        from_attributes=True,
    )