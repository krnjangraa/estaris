from datetime import date
from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentAdmin, SessionDep
from app.modules.notifications.schemas import RentDueNotification
from app.modules.notifications.services import NotificationService
from app.modules.payments.models import PaymentStatus
from app.modules.payments.repositories import PaymentRepository

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get(
    "/rent-due",
    response_model=list[RentDueNotification],
    summary="Get all pending/overdue rent payments",
)
def get_rent_due_notifications(
    session: SessionDep,
    admin: CurrentAdmin,
):
    """
    Returns a list of pending and overdue payments across all of the
    admin's buildings, enriched with tenant contact details for sending reminders.
    """
    payments = NotificationService.get_rent_due(session, admin.id)
    today = date.today()

    result: list[RentDueNotification] = []
    for payment in payments:
        lease = payment.lease
        tenant = lease.tenant
        room = tenant.room
        building = room.building

        # Calculate due date for this billing cycle
        due_day = min(lease.payment_due_day, 28)  # cap at 28 to be safe
        try:
            due_date = date(payment.billing_year, payment.billing_month, due_day)
        except ValueError:
            due_date = date(payment.billing_year, payment.billing_month, 28)

        days_overdue = (today - due_date).days

        result.append(
            RentDueNotification(
                payment_id=payment.id,
                tenant_name=tenant.name,
                contact_number=tenant.contact_number,
                room_number=room.room_number,
                building_name=building.name,
                amount_due=float(payment.amount_due),
                billing_month=payment.billing_month,
                billing_year=payment.billing_year,
                payment_due_day=lease.payment_due_day,
                days_overdue=days_overdue,
                status=payment.status.value,
                reminder_sent_at=payment.reminder_sent_at,
            )
        )

    # Sort: most overdue first
    result.sort(key=lambda n: n.days_overdue, reverse=True)
    return result


@router.post(
    "/mark-notified/{payment_id}",
    response_model=RentDueNotification,
    summary="Mark a payment reminder as sent",
)
def mark_notified(
    payment_id: UUID,
    session: SessionDep,
    admin: CurrentAdmin,
):
    """
    Stamps reminder_sent_at = now() on the payment so the admin can track
    who was already reminded.
    """
    payment = PaymentRepository.get_by_id(
        session=session,
        payment_id=payment_id,
        admin_id=admin.id,
    )
    if payment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )

    payment = NotificationService.mark_notified(session, payment)

    lease = payment.lease
    tenant = lease.tenant
    room = tenant.room
    building = room.building
    today = date.today()

    due_day = min(lease.payment_due_day, 28)
    try:
        due_date = date(payment.billing_year, payment.billing_month, due_day)
    except ValueError:
        due_date = date(payment.billing_year, payment.billing_month, 28)

    days_overdue = (today - due_date).days

    return RentDueNotification(
        payment_id=payment.id,
        tenant_name=tenant.name,
        contact_number=tenant.contact_number,
        room_number=room.room_number,
        building_name=building.name,
        amount_due=float(payment.amount_due),
        billing_month=payment.billing_month,
        billing_year=payment.billing_year,
        payment_due_day=lease.payment_due_day,
        days_overdue=days_overdue,
        status=payment.status.value,
        reminder_sent_at=payment.reminder_sent_at,
    )
