from pydantic import BaseModel
from typing import List
from uuid import UUID
from datetime import date

class OccupancyStats(BaseModel):
    total_capacity: int
    occupied_slots: int
    vacant_slots: int
    occupancy_percentage: float

class FinancialStats(BaseModel):
    total_expected: float
    total_collected: float
    total_pending: float
    collection_percentage: float

class BuildingOccupancyItem(BaseModel):
    building_id: UUID
    building_name: str
    capacity: int
    occupied: int
    vacant: int
    occupancy_percentage: float

class RecentActivityItem(BaseModel):
    id: UUID
    type: str  # "payment", "tenant", "lease"
    title: str
    description: str
    timestamp: str

class DashboardStatsRead(BaseModel):
    total_buildings: int
    total_rooms: int
    occupancy: OccupancyStats
    financials: FinancialStats
    building_occupancy: List[BuildingOccupancyItem]
    recent_activity: List[RecentActivityItem]
