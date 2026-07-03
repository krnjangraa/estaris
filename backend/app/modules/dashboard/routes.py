from fastapi import APIRouter, Depends

from app.api.deps import SessionDep, get_current_admin
from app.modules.auth.models import Admin
from app.modules.dashboard.schemas import DashboardStatsRead
from app.modules.dashboard.services import DashboardService

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)

@router.get(
    "/stats",
    response_model=DashboardStatsRead,
)
def get_dashboard_stats(
    session: SessionDep,
    admin: Admin = Depends(get_current_admin),
):
    return DashboardService.get_stats(
        session=session,
        admin_id=admin.id,
    )
