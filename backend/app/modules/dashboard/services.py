import datetime
from uuid import UUID
from sqlmodel import Session, select
from sqlalchemy import desc
from sqlalchemy.orm import joinedload

from app.modules.buildings.models import Building
from app.modules.rooms.models import Room
from app.modules.tenants.models import Tenant
from app.modules.leases.models import Lease
from app.modules.payments.models import Payment
from app.modules.dashboard.schemas import (
    DashboardStatsRead,
    OccupancyStats,
    FinancialStats,
    BuildingOccupancyItem,
    RecentActivityItem,
)

class DashboardService:
    @staticmethod
    def get_stats(session: Session, admin_id: UUID) -> DashboardStatsRead:
        # 1. Total Buildings
        buildings = session.exec(
            select(Building).where(Building.admin_id == admin_id)
        ).all()
        total_buildings = len(buildings)

        # 2. Total Rooms & Capacity
        rooms = session.exec(
            select(Room)
            .join(Building)
            .where(Building.admin_id == admin_id)
        ).all()
        total_rooms = len(rooms)
        total_capacity = sum(r.capacity for r in rooms)

        # 3. Occupancy Stats
        active_tenants = session.exec(
            select(Tenant)
            .options(joinedload(Tenant.room))
            .join(Room)
            .join(Building)
            .where(
                Building.admin_id == admin_id,
                Tenant.status == "active"
            )
        ).all()
        occupied_slots = len(active_tenants)
        vacant_slots = max(0, total_capacity - occupied_slots)
        occupancy_percentage = (
            (occupied_slots / total_capacity * 100) if total_capacity > 0 else 0.0
        )

        occupancy = OccupancyStats(
            total_capacity=total_capacity,
            occupied_slots=occupied_slots,
            vacant_slots=vacant_slots,
            occupancy_percentage=round(occupancy_percentage, 2),
        )

        # 4. Building Breakdown
        building_occupancy = []
        for b in buildings:
            b_rooms = [r for r in rooms if r.building_id == b.id]
            b_capacity = sum(r.capacity for r in b_rooms)
            b_occupied = len(
                [t for t in active_tenants if t.room_id in [r.id for r in b_rooms]]
            )
            b_vacant = max(0, b_capacity - b_occupied)
            b_pct = (b_occupied / b_capacity * 100) if b_capacity > 0 else 0.0

            building_occupancy.append(
                BuildingOccupancyItem(
                    building_id=b.id,
                    building_name=b.name,
                    capacity=b_capacity,
                    occupied=b_occupied,
                    vacant=b_vacant,
                    occupancy_percentage=round(b_pct, 2),
                )
            )

        # 5. Financial Stats (Current Calendar Month)
        today = datetime.date.today()
        curr_month = today.month
        curr_year = today.year

        month_payments = session.exec(
            select(Payment)
            .join(Lease)
            .join(Tenant)
            .join(Room)
            .join(Building)
            .where(
                Building.admin_id == admin_id,
                Payment.billing_month == curr_month,
                Payment.billing_year == curr_year,
            )
        ).all()

        total_expected = float(sum(p.amount_due for p in month_payments))
        total_collected = float(
            sum(p.amount_paid for p in month_payments if p.status == "paid")
        )
        total_pending = max(0.0, total_expected - total_collected)
        collection_percentage = (
            (total_collected / total_expected * 100) if total_expected > 0 else 0.0
        )

        financials = FinancialStats(
            total_expected=round(total_expected, 2),
            total_collected=round(total_collected, 2),
            total_pending=round(total_pending, 2),
            collection_percentage=round(collection_percentage, 2),
        )

        # 6. Recent Activity Feed
        # Payments
        rec_payments = session.exec(
            select(Payment)
            .options(joinedload(Payment.lease).joinedload(Lease.tenant))
            .join(Lease)
            .join(Tenant)
            .join(Room)
            .join(Building)
            .where(Building.admin_id == admin_id)
            .order_by(desc(Payment.created_at))
            .limit(5)
        ).all()

        # Tenants
        rec_tenants = session.exec(
            select(Tenant)
            .options(joinedload(Tenant.room))
            .join(Room)
            .join(Building)
            .where(Building.admin_id == admin_id)
            .order_by(desc(Tenant.created_at))
            .limit(5)
        ).all()

        # Leases
        rec_leases = session.exec(
            select(Lease)
            .options(joinedload(Lease.tenant))
            .join(Tenant)
            .join(Room)
            .join(Building)
            .where(Building.admin_id == admin_id)
            .order_by(desc(Lease.created_at))
            .limit(5)
        ).all()

        activity = []
        for p in rec_payments:
            tenant_name = p.lease.tenant.name if p.lease and p.lease.tenant else "Unknown Tenant"
            activity.append({
                "id": p.id,
                "type": "payment",
                "title": "Payment Collected",
                "description": f"Collected ₹{p.amount_paid:,.2f} from {tenant_name} (Receipt No: {p.receipt_number})",
                "timestamp": p.created_at.isoformat(),
                "raw_time": p.created_at
            })

        for t in rec_tenants:
            room_num = t.room.room_number if t.room else "Unknown"
            activity.append({
                "id": t.id,
                "type": "tenant",
                "title": "New Tenant Added",
                "description": f"Tenant {t.name} registered in Room {room_num}",
                "timestamp": t.created_at.isoformat(),
                "raw_time": t.created_at
            })

        for l in rec_leases:
            tenant_name = l.tenant.name if l.tenant else "Unknown Tenant"
            activity.append({
                "id": l.id,
                "type": "lease",
                "title": "Lease Agreement Created",
                "description": f"Lease created for {tenant_name} at ₹{l.monthly_rent:,.2f}/mo",
                "timestamp": l.created_at.isoformat(),
                "raw_time": l.created_at
            })

        # Sort combined activity chronologically descending
        activity.sort(key=lambda x: x["raw_time"], reverse=True)

        recent_activity = [
            RecentActivityItem(
                id=item["id"],
                type=item["type"],
                title=item["title"],
                description=item["description"],
                timestamp=item["timestamp"]
            )
            for item in activity[:10]
        ]

        return DashboardStatsRead(
            total_buildings=total_buildings,
            total_rooms=total_rooms,
            occupancy=occupancy,
            financials=financials,
            building_occupancy=building_occupancy,
            recent_activity=recent_activity,
        )
