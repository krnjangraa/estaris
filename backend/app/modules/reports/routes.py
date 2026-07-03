from fastapi import APIRouter, Depends, Response
from fastapi.responses import StreamingResponse
import io

from app.api.deps import SessionDep, get_current_admin
from app.modules.auth.models import Admin
from app.modules.reports.schemas import (
    OccupancyReport,
    FinancialReport,
    PendingDuesReport,
)
from app.modules.reports.services import ReportService

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)

@router.get(
    "/occupancy",
    response_model=OccupancyReport,
)
def get_occupancy_report(
    session: SessionDep,
    admin: Admin = Depends(get_current_admin),
):
    return ReportService.get_occupancy_report(
        session=session,
        admin_id=admin.id,
    )

@router.get(
    "/financials",
    response_model=FinancialReport,
)
def get_financial_report(
    session: SessionDep,
    year: int,
    admin: Admin = Depends(get_current_admin),
):
    return ReportService.get_financial_report(
        session=session,
        admin_id=admin.id,
        year=year,
    )

@router.get(
    "/pending-dues",
    response_model=PendingDuesReport,
)
def get_pending_dues_report(
    session: SessionDep,
    admin: Admin = Depends(get_current_admin),
):
    return ReportService.get_pending_dues(
        session=session,
        admin_id=admin.id,
    )

@router.get(
    "/export/occupancy",
)
def export_occupancy(
    session: SessionDep,
    admin: Admin = Depends(get_current_admin),
):
    csv_data = ReportService.export_occupancy_csv(session=session, admin_id=admin.id)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=occupancy_report.csv"
        }
    )

@router.get(
    "/export/payments",
)
def export_payments(
    session: SessionDep,
    admin: Admin = Depends(get_current_admin),
):
    csv_data = ReportService.export_payments_csv(session=session, admin_id=admin.id)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=payments_report.csv"
        }
    )

@router.get(
    "/export/pending-dues",
)
def export_pending_dues(
    session: SessionDep,
    admin: Admin = Depends(get_current_admin),
):
    csv_data = ReportService.export_pending_dues_csv(session=session, admin_id=admin.id)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=pending_dues_report.csv"
        }
    )
