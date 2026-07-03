from uuid import UUID

from sqlmodel import Session, select

from app.modules.buildings.models import Building
from app.modules.leases.models import Lease
from app.modules.payments.models import Payment
from app.modules.rooms.models import Room
from app.modules.tenants.models import Tenant


class PaymentRepository:

    @staticmethod
    def create(
        session: Session,
        payment: Payment,
    ) -> Payment:

        session.add(payment)
        session.commit()
        session.refresh(payment)

        return payment

    @staticmethod
    def get_by_id(
        session: Session,
        payment_id: UUID,
        admin_id: UUID,
    ) -> Payment | None:

        statement = (
            select(Payment)
            .join(Lease)
            .join(Tenant)
            .join(Room)
            .join(Building)
            .where(Payment.id == payment_id)
            .where(Building.admin_id == admin_id)
        )

        return session.exec(statement).first()

    @staticmethod
    def get_all_by_lease(
        session: Session,
        lease_id: UUID,
    ) -> list[Payment]:

        statement = (
            select(Payment)
            .where(Payment.lease_id == lease_id)
            .order_by(
                Payment.billing_year.desc(),
                Payment.billing_month.desc(),
            )
        )

        return list(session.exec(statement))

    @staticmethod
    def update(
        session: Session,
        payment: Payment,
    ) -> Payment:

        session.add(payment)
        session.commit()
        session.refresh(payment)

        return payment

    @staticmethod
    def delete(
        session: Session,
        payment: Payment,
    ) -> None:

        session.delete(payment)
        session.commit()