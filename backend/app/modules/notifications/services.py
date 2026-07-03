from datetime import date, datetime, timezone
from uuid import UUID

from sqlalchemy.orm import joinedload
from sqlmodel import Session, select

from app.modules.buildings.models import Building
from app.modules.leases.models import Lease
from app.modules.payments.models import Payment, PaymentStatus
from app.modules.rooms.models import Room
from app.modules.tenants.models import Tenant


class NotificationService:

    @staticmethod
    def get_rent_due(session: Session, admin_id: UUID) -> list[Payment]:
        """Return all pending/overdue payments for the admin's buildings."""
        statement = (
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
            .where(Payment.status.in_([PaymentStatus.PENDING, PaymentStatus.OVERDUE]))
            .order_by(Payment.billing_year, Payment.billing_month)
        )
        return list(session.exec(statement))

    @staticmethod
    def mark_notified(session: Session, payment: Payment) -> Payment:
        """Stamp reminder_sent_at with the current UTC time."""
        payment.reminder_sent_at = datetime.now(timezone.utc)
        session.add(payment)
        session.commit()
        session.refresh(payment)
        return payment
