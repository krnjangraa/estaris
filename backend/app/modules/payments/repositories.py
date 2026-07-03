from uuid import UUID

from sqlmodel import Session, select
from sqlalchemy.orm import joinedload

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
            .options(
                joinedload(Payment.lease)
                .joinedload(Lease.tenant)
                .joinedload(Tenant.room)
                .joinedload(Room.building)
            )
            .where(Payment.lease_id == lease_id)
            .order_by(
                Payment.billing_year.desc(),
                Payment.billing_month.desc(),
            )
        )

        return list(session.exec(statement))

    @staticmethod
    def get_by_month_year(
        session: Session,
        lease_id: UUID,
        billing_month: int,
        billing_year: int,
    ) -> Payment | None:

        statement = (
            select(Payment)
            .where(Payment.lease_id == lease_id)
            .where(Payment.billing_month == billing_month)
            .where(Payment.billing_year == billing_year)
        )

        return session.exec(statement).first()

    @staticmethod
    def get_all_global(
        session: Session,
        admin_id: UUID,
        building_id: UUID | None = None,
        room_id: UUID | None = None,
        status: str | None = None,
    ) -> list[Payment]:

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
        )

        if building_id:
            statement = statement.where(Building.id == building_id)
        if room_id:
            statement = statement.where(Room.id == room_id)
        if status:
            statement = statement.where(Payment.status == status)

        statement = statement.order_by(
            Payment.billing_year.desc(),
            Payment.billing_month.desc(),
            Payment.created_at.desc(),
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