import secrets
from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.modules.leases.models import Lease
from app.modules.payments.models import Payment
from app.modules.payments.repositories import PaymentRepository
from app.modules.payments.schemas import (
    PaymentCreate,
    PaymentUpdate,
)


class PaymentService:

    @staticmethod
    def create(
        session: Session,
        lease: Lease,
        data: PaymentCreate,
    ) -> Payment:
        # Check duplicate billing month
        existing = PaymentRepository.get_by_month_year(
            session=session,
            lease_id=lease.id,
            billing_month=data.billing_month,
            billing_year=data.billing_year,
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment for this billing month already exists for this lease.",
            )

        # Generate unique receipt number
        while True:
            random_hex = secrets.token_hex(2).upper()
            receipt_number = f"REC-{data.billing_year}{data.billing_month:02d}-{random_hex}"
            collision = session.exec(
                select(Payment).where(Payment.receipt_number == receipt_number)
            ).first()
            if not collision:
                break

        amount_due = data.amount_due if data.amount_due is not None else lease.monthly_rent

        payment = Payment(
            lease_id=lease.id,
            billing_month=data.billing_month,
            billing_year=data.billing_year,
            amount_due=amount_due,
            amount_paid=data.amount_paid,
            payment_date=data.payment_date,
            payment_method=data.payment_method,
            status=data.status,
            transaction_reference=data.transaction_reference,
            receipt_number=receipt_number,
            remarks=data.remarks,
        )

        return PaymentRepository.create(
            session,
            payment,
        )

    @staticmethod
    def get(
        session: Session,
        payment_id,
        admin_id,
    ):

        return PaymentRepository.get_by_id(
            session,
            payment_id,
            admin_id,
        )

    @staticmethod
    def get_all(
        session: Session,
        lease_id,
    ):

        return PaymentRepository.get_all_by_lease(
            session,
            lease_id,
        )

    @staticmethod
    def get_all_global(
        session: Session,
        admin_id,
        building_id=None,
        room_id=None,
        status=None,
    ):

        return PaymentRepository.get_all_global(
            session=session,
            admin_id=admin_id,
            building_id=building_id,
            room_id=room_id,
            status=status,
        )

    @staticmethod
    def update(
        session: Session,
        payment: Payment,
        data: PaymentUpdate,
    ):

        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(payment, key, value)

        return PaymentRepository.update(
            session,
            payment,
        )

    @staticmethod
    def delete(
        session: Session,
        payment: Payment,
    ):

        PaymentRepository.delete(
            session,
            payment,
        )