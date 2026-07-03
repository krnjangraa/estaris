import csv
import io
from uuid import UUID
from sqlmodel import Session, select
from sqlalchemy.orm import joinedload

from app.modules.buildings.models import Building
from app.modules.rooms.models import Room
from app.modules.tenants.models import Tenant
from app.modules.leases.models import Lease
from app.modules.payments.models import Payment
from app.modules.reports.schemas import (
    OccupancyReport,
    BuildingOccupancyReportItem,
    FinancialReport,
    MonthlyFinancialReportItem,
    PendingDuesReport,
    PendingDueReportItem,
)

MONTH_NAMES = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

class ReportService:
    @staticmethod
    def get_occupancy_report(session: Session, admin_id: UUID) -> OccupancyReport:
        buildings = session.exec(
            select(Building).where(Building.admin_id == admin_id)
        ).all()
        rooms = session.exec(
            select(Room).join(Building).where(Building.admin_id == admin_id)
        ).all()
        active_tenants = session.exec(
            select(Tenant)
            .join(Room)
            .join(Building)
            .where(
                Building.admin_id == admin_id,
                Tenant.status == "active"
            )
        ).all()

        total_buildings = len(buildings)
        total_rooms = len(rooms)
        total_capacity = sum(r.capacity for r in rooms)
        total_occupied = len(active_tenants)
        total_vacant = max(0, total_capacity - total_occupied)
        overall_pct = (total_occupied / total_capacity * 100) if total_capacity > 0 else 0.0

        items = []
        for b in buildings:
            b_rooms = [r for r in rooms if r.building_id == b.id]
            b_rooms_count = len(b_rooms)
            b_capacity = sum(r.capacity for r in b_rooms)
            b_occupied = len(
                [t for t in active_tenants if t.room_id in [r.id for r in b_rooms]]
            )
            b_vacant = max(0, b_capacity - b_occupied)
            b_pct = (b_occupied / b_capacity * 100) if b_capacity > 0 else 0.0

            items.append(
                BuildingOccupancyReportItem(
                    building_id=b.id,
                    building_name=b.name,
                    rooms_count=b_rooms_count,
                    capacity=b_capacity,
                    occupied=b_occupied,
                    vacant=b_vacant,
                    occupancy_percentage=round(b_pct, 2),
                )
            )

        return OccupancyReport(
            total_buildings=total_buildings,
            total_rooms=total_rooms,
            total_capacity=total_capacity,
            total_occupied=total_occupied,
            total_vacant=total_vacant,
            overall_occupancy_percentage=round(overall_pct, 2),
            items=items,
        )

    @staticmethod
    def get_financial_report(session: Session, admin_id: UUID, year: int) -> FinancialReport:
        payments = session.exec(
            select(Payment)
            .join(Lease)
            .join(Tenant)
            .join(Room)
            .join(Building)
            .where(
                Building.admin_id == admin_id,
                Payment.billing_year == year
            )
        ).all()

        total_expected = float(sum(p.amount_due for p in payments))
        total_collected = float(
            sum(p.amount_paid for p in payments if p.status == "paid")
        )
        total_pending = max(0.0, total_expected - total_collected)
        overall_collection_pct = (
            (total_collected / total_expected * 100) if total_expected > 0 else 0.0
        )

        monthly_items = []
        for m in range(1, 13):
            m_payments = [p for p in payments if p.billing_month == m]
            m_expected = float(sum(p.amount_due for p in m_payments))
            m_collected = float(
                sum(p.amount_paid for p in m_payments if p.status == "paid")
            )
            m_pending = max(0.0, m_expected - m_collected)
            m_pct = (m_collected / m_expected * 100) if m_expected > 0 else 0.0

            monthly_items.append(
                MonthlyFinancialReportItem(
                    month=m,
                    month_name=MONTH_NAMES[m],
                    expected=round(m_expected, 2),
                    collected=round(m_collected, 2),
                    pending=round(m_pending, 2),
                    collection_percentage=round(m_pct, 2),
                )
            )

        return FinancialReport(
            year=year,
            total_expected=round(total_expected, 2),
            total_collected=round(total_collected, 2),
            total_pending=round(total_pending, 2),
            overall_collection_percentage=round(overall_collection_pct, 2),
            items=monthly_items,
        )

    @staticmethod
    def get_pending_dues(session: Session, admin_id: UUID) -> PendingDuesReport:
        payments = session.exec(
            select(Payment)
            .options(
                joinedload(Payment.lease)
                .joinedload(Lease.tenant)
                .joinedload(Tenant.room)
                .joinedload(Room.building)
            )
            .join(Lease)
            .join(Tenant)
            .join(Room)
            .join(Building)
            .where(
                Building.admin_id == admin_id,
                Payment.status.in_(["pending", "overdue"])
            )
            .order_by(Payment.billing_year.desc(), Payment.billing_month.desc())
        ).all()

        items = []
        total_pending_amount = 0.0

        for p in payments:
            if not p.lease or not p.lease.tenant:
                continue

            tenant = p.lease.tenant
            room = tenant.room
            building = room.building if room else None

            amount_pending = max(0.0, p.amount_due - p.amount_paid)
            total_pending_amount += amount_pending

            items.append(
                PendingDueReportItem(
                    payment_id=p.id,
                    lease_id=p.lease_id,
                    tenant_id=tenant.id,
                    tenant_name=tenant.name,
                    tenant_phone=tenant.contact_number,
                    emergency_contact=tenant.emergency_contact_name,
                    emergency_phone=tenant.emergency_contact_number,
                    building_name=building.name if building else "N/A",
                    room_number=room.room_number if room else "N/A",
                    month=p.billing_month,
                    year=p.billing_year,
                    amount_due=float(p.amount_due),
                    amount_paid=float(p.amount_paid),
                    amount_pending=float(amount_pending),
                    status=p.status,
                )
            )

        return PendingDuesReport(
            total_pending_accounts=len(items),
            total_pending_amount=round(total_pending_amount, 2),
            items=items,
        )

    @staticmethod
    def export_occupancy_csv(session: Session, admin_id: UUID) -> str:
        rooms = session.exec(
            select(Room)
            .options(joinedload(Room.building))
            .join(Building)
            .where(Building.admin_id == admin_id)
            .order_by(Building.name, Room.room_number)
        ).all()

        active_tenants = session.exec(
            select(Tenant)
            .join(Room)
            .join(Building)
            .where(Building.admin_id == admin_id, Tenant.status == "active")
        ).all()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Building",
            "Room Number",
            "Room Type",
            "Capacity",
            "Occupied",
            "Vacant",
            "Status",
            "Occupants"
        ])

        for r in rooms:
            r_tenants = [t for t in active_tenants if t.room_id == r.id]
            occupied = len(r_tenants)
            vacant = max(0, r.capacity - occupied)
            
            status = "Vacant"
            if occupied == r.capacity:
                status = "Fully Occupied"
            elif occupied > 0:
                status = "Partially Occupied"

            occupants_names = ", ".join(t.name for t in r_tenants)

            writer.writerow([
                r.building.name if r.building else "N/A",
                r.room_number,
                r.room_type,
                r.capacity,
                occupied,
                vacant,
                status,
                occupants_names
            ])

        return output.getvalue()

    @staticmethod
    def export_payments_csv(session: Session, admin_id: UUID) -> str:
        payments = session.exec(
            select(Payment)
            .options(
                joinedload(Payment.lease)
                .joinedload(Lease.tenant)
                .joinedload(Tenant.room)
                .joinedload(Room.building)
            )
            .join(Lease)
            .join(Tenant)
            .join(Room)
            .join(Building)
            .where(Building.admin_id == admin_id)
            .order_by(Payment.billing_year.desc(), Payment.billing_month.desc())
        ).all()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Receipt Number",
            "Tenant",
            "Building",
            "Room",
            "Billing Month",
            "Billing Year",
            "Amount Due",
            "Amount Paid",
            "Payment Date",
            "Method",
            "Status",
            "Transaction Reference",
            "Remarks"
        ])

        for p in payments:
            tenant = p.lease.tenant if p.lease else None
            room = tenant.room if tenant else None
            building = room.building if room else None

            writer.writerow([
                p.receipt_number,
                tenant.name if tenant else "N/A",
                building.name if building else "N/A",
                room.room_number if room else "N/A",
                MONTH_NAMES[p.billing_month],
                p.billing_year,
                float(p.amount_due),
                float(p.amount_paid),
                p.payment_date,
                p.payment_method,
                p.status.upper(),
                p.transaction_reference or "N/A",
                p.remarks or ""
            ])

        return output.getvalue()

    @staticmethod
    def export_pending_dues_csv(session: Session, admin_id: UUID) -> str:
        payments = session.exec(
            select(Payment)
            .options(
                joinedload(Payment.lease)
                .joinedload(Lease.tenant)
                .joinedload(Tenant.room)
                .joinedload(Room.building)
            )
            .join(Lease)
            .join(Tenant)
            .join(Room)
            .join(Building)
            .where(
                Building.admin_id == admin_id,
                Payment.status.in_(["pending", "overdue"])
            )
            .order_by(Payment.billing_year.desc(), Payment.billing_month.desc())
        ).all()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Tenant",
            "Contact Number",
            "Emergency Contact",
            "Emergency Contact Phone",
            "Building",
            "Room",
            "Billing Month",
            "Billing Year",
            "Amount Due",
            "Amount Paid",
            "Amount Pending",
            "Status"
        ])

        for p in payments:
            tenant = p.lease.tenant if p.lease else None
            room = tenant.room if tenant else None
            building = room.building if room else None

            amount_pending = max(0.0, p.amount_due - p.amount_paid)

            writer.writerow([
                tenant.name if tenant else "N/A",
                tenant.contact_number if tenant else "N/A",
                tenant.emergency_contact_name if tenant else "N/A",
                tenant.emergency_contact_number if tenant else "N/A",
                building.name if building else "N/A",
                room.room_number if room else "N/A",
                MONTH_NAMES[p.billing_month],
                p.billing_year,
                float(p.amount_due),
                float(p.amount_paid),
                float(amount_pending),
                p.status.upper()
            ])

        return output.getvalue()
