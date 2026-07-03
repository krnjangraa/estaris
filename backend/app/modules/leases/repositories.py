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

    @staticmethod
    def get_all_global(
        session: Session,
        admin_id: UUID,
    ):
        statement = (
            select(
                Lease,
                Tenant.name.label("tenant_name"),
                Room.room_number,
                Building.name.label("building_name"),
            )
            .join(Tenant, Tenant.id == Lease.tenant_id)
            .join(Room, Room.id == Tenant.room_id)
            .join(Building, Building.id == Room.building_id)
            .where(Building.admin_id == admin_id)
            .order_by(Lease.start_date.desc())
        )

        result = session.exec(statement).all()

        leases = []
        for lease, tenant_name, room_number, building_name in result:
            l_dict = lease.model_dump()
            l_dict["tenant_name"] = tenant_name
            l_dict["room_number"] = room_number
            l_dict["building_name"] = building_name
            leases.append(l_dict)

        return leases