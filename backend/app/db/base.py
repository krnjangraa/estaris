from sqlmodel import SQLModel

from app.modules.auth.models import Admin
from app.modules.buildings.models import Building
from app.modules.rooms.models import Room
from app.modules.tenants.models import Tenant
from app.modules.leases.models import Lease
from app.modules.payments.models import Payment

__all__ = [
    "SQLModel",
    "Admin",
    "Building",
    "Room",
    "Tenant",
    "Lease",
    "Payment",
]