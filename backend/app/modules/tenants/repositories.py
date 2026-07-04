from uuid import UUID

from sqlmodel import Session, func, select

from app.modules.buildings.models import Building
from app.modules.rooms.models import Room
from app.modules.tenants.models import Tenant, TenantStatus


class TenantRepository:

    @staticmethod
    def create(
        session: Session,
        tenant: Tenant,
    ) -> Tenant:
        session.add(tenant)
        session.commit()
        session.refresh(tenant)
        return tenant

    @staticmethod
    def get_by_id(
        session: Session,
        tenant_id: UUID,
        admin_id: UUID,
    ) -> Tenant | None:

        statement = (
            select(Tenant)
            .join(Room)
            .join(Building)
            .where(Tenant.id == tenant_id)
            .where(Building.admin_id == admin_id)
        )

        return session.exec(statement).first()

    @staticmethod
    def get_all_by_room(
        session: Session,
        room_id: UUID,
    ) -> list[Tenant]:

        statement = (
            select(Tenant)
            .where(Tenant.room_id == room_id)
            .order_by(Tenant.name)
        )

        return list(session.exec(statement))

    @staticmethod
    def active_tenant_count(
        session: Session,
        room_id: UUID,
    ) -> int:

        statement = (
            select(func.count())
            .select_from(Tenant)
            .where(Tenant.room_id == room_id)
            .where(Tenant.status == TenantStatus.ACTIVE)
        )

        return session.exec(statement).one()

    @staticmethod
    def update(
        session: Session,
        tenant: Tenant,
    ) -> Tenant:

        session.add(tenant)
        session.commit()
        session.refresh(tenant)

        return tenant

    @staticmethod
    def delete(
        session: Session,
        tenant: Tenant,
    ) -> None:

        session.delete(tenant)
        session.commit()

    @staticmethod
    def get_all_global(
        session: Session,
        admin_id: UUID,
    ):
        statement = (
            select(
                Tenant,
                Room.room_number,
                Building.name.label("building_name"),
                Building.id.label("building_id"),
            )
            .join(Room, Room.id == Tenant.room_id)
            .join(Building, Building.id == Room.building_id)
            .where(Building.admin_id == admin_id)
            .order_by(Tenant.name)
        )

        result = session.exec(statement).all()

        tenants = []
        for tenant, room_number, building_name, building_id in result:
            t_dict = tenant.model_dump()
            t_dict["room_number"] = room_number
            t_dict["building_name"] = building_name
            t_dict["building_id"] = building_id
            tenants.append(t_dict)

        return tenants