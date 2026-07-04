from datetime import date, datetime, timezone
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class RentDueNotification(BaseModel):
    payment_id: UUID
    lease_id: UUID
    tenant_id: UUID
    room_id: UUID
    building_id: UUID
    tenant_name: str

    contact_number: str
    room_number: str
    building_name: str
    amount_due: float
    billing_month: int
    billing_year: int
    payment_due_day: int
    days_overdue: int           # 0 = due today, positive = overdue, negative = upcoming
    status: str                 # "pending" | "overdue"
    reminder_sent_at: Optional[datetime] = None

