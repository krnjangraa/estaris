from sqlmodel import Session

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

        payment = Payment(
            lease_id=lease.id,
            billing_month=data.billing_month,
            billing_year=data.billing_year,
            amount_due=data.amount_due,
            amount_paid=data.amount_paid,
            payment_date=data.payment_date,
            payment_method=data.payment_method,
            status=data.status,
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