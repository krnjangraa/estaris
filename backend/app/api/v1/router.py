from fastapi import APIRouter

from app.modules.auth.routes import router as auth_router
from app.modules.buildings.routes import router as building_router
from app.modules.rooms.routes import router as room_router
from app.modules.tenants.routes import router as tenant_router
from app.modules.leases.routes import router as lease_router
from app.modules.payments.routes import router as payment_router
api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(building_router)
api_router.include_router(room_router)
api_router.include_router(tenant_router)
api_router.include_router(lease_router)
api_router.include_router(payment_router)