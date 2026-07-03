from uuid import UUID

from sqlmodel import Session, select

from app.modules.buildings.models import Building
from app.modules.leases.models import Lease, LeaseStatus
from app.modules.rooms.models import Room
from app.modules.tenants.models import Tenant


class LeaseRepository:

    @staticmethod
    def create(
        session: Session,
        lease: Lease,
    ) -> Lease:
        session.add(lease)
        session.commit()
        session.refresh(lease)
        return lease

    @staticmethod
    def get_by_id(
        session: Session,
        lease_id: UUID,
        admin_id: UUID,
    ) -> Lease | None:

        statement = (
            select(Lease)
            .join(Tenant)
            .join(Room)
            .join(Building)
            .where(Lease.id == lease_id)
            .where(Building.admin_id == admin_id)
        )

        return session.exec(statement).first()

    @staticmethod
    def get_all_by_tenant(
        session: Session,
        tenant_id: UUID,
    ) -> list[Lease]:

        statement = (
            select(Lease)
            .where(Lease.tenant_id == tenant_id)
            .order_by(Lease.start_date.desc())
        )

        return list(session.exec(statement))

    @staticmethod
    def active_lease(
        session: Session,
        tenant_id: UUID,
    ) -> Lease | None:

        statement = (
            select(Lease)
            .where(Lease.tenant_id == tenant_id)
            .where(Lease.status == LeaseStatus.ACTIVE)
        )

        return session.exec(statement).first()

    @staticmethod
    def update(
        session: Session,
        lease: Lease,
    ) -> Lease:

        session.add(lease)
        session.commit()
        session.refresh(lease)

        return lease

    @staticmethod
    def delete(
        session: Session,
        lease: Lease,
    ) -> None:

        session.delete(lease)
        session.commit()