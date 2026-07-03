from uuid import UUID


from app.modules.rooms.models import Room


from sqlmodel import Session, select, func
from sqlalchemy import and_
from app.modules.tenants.models import Tenant, TenantStatus

from app.modules.buildings.models import Building
class RoomRepository:

    @staticmethod
    def create(
        session: Session,
        room: Room,
    ) -> Room:
        session.add(room)
        session.commit()
        session.refresh(room)
        return room

    @staticmethod
    def get_by_id(
        session: Session,
        room_id: UUID,
        admin_id: UUID,
    ) -> Room | None:

        statement = (
            select(Room)
            .join(Building)
            .where(Room.id == room_id)
            .where(Building.admin_id == admin_id)
        )

        return session.exec(statement).first()

    @staticmethod
    def get_all_by_building(
        session: Session,
        building_id: UUID,
    ) -> list[Room]:
        statement = (
            select(Room)
            .where(Room.building_id == building_id)
            .order_by(Room.room_number)
        )

        return list(session.exec(statement))

    @staticmethod
    def update(
        session: Session,
        room: Room,
    ) -> Room:
        session.add(room)
        session.commit()
        session.refresh(room)
        return room

    @staticmethod
    def delete(
        session: Session,
        room: Room,
    ) -> None:
        session.delete(room)
        session.commit()

    @staticmethod
    def get_all_with_occupancy(
        session: Session,
        building_id: UUID,
    ):
        statement = (
            select(
                Room,
                func.count(Tenant.id).label("occupied"),
            )
            .outerjoin(
                Tenant,
                and_(
                    Tenant.room_id == Room.id,
                    Tenant.status == TenantStatus.ACTIVE,
                ),
            )
            .where(Room.building_id == building_id)
            .group_by(Room.id)
            .order_by(Room.room_number)
        )

        result = session.exec(statement).all()

        rooms = []

        for room, occupied in result:
            rooms.append(
                {
                    "id": room.id,
                    "building_id": room.building_id,
                    "room_number": room.room_number,
                    "room_type": room.room_type,
                    "capacity": room.capacity,
                    "base_rent": float(room.base_rent),
                    "occupied": occupied,
                    "available": room.capacity - occupied,
                    "created_at": room.created_at,
                    "updated_at": room.updated_at,
                }
            )

        return rooms