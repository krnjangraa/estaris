from pydantic import BaseModel
from typing import List
from uuid import UUID
from datetime import date

# Occupancy Report
class BuildingOccupancyReportItem(BaseModel):
    building_id: UUID
    building_name: str
    rooms_count: int
    capacity: int
    occupied: int
    vacant: int
    occupancy_percentage: float

class OccupancyReport(BaseModel):
    total_buildings: int
    total_rooms: int
    total_capacity: int
    total_occupied: int
    total_vacant: int
    overall_occupancy_percentage: float
    items: List[BuildingOccupancyReportItem]

# Financial Report
class MonthlyFinancialReportItem(BaseModel):
    month: int
    month_name: str
    expected: float
    collected: float
    pending: float
    collection_percentage: float

class FinancialReport(BaseModel):
    year: int
    total_expected: float
    total_collected: float
    total_pending: float
    overall_collection_percentage: float
    items: List[MonthlyFinancialReportItem]

# Pending Dues Report
class PendingDueReportItem(BaseModel):
    payment_id: UUID
    lease_id: UUID
    tenant_id: UUID
    tenant_name: str
    tenant_phone: str
    emergency_contact: str
    emergency_phone: str
    building_name: str
    room_number: str
    month: int
    year: int
    amount_due: float
    amount_paid: float
    amount_pending: float
    status: str

class PendingDuesReport(BaseModel):
    total_pending_accounts: int
    total_pending_amount: float
    items: List[PendingDueReportItem]
