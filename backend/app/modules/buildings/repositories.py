from uuid import UUID

from sqlmodel import Session, select

from app.modules.buildings.models import Building


class BuildingRepository:

    @staticmethod
    def create(
        session: Session,
        building: Building,
    ) -> Building:
        session.add(building)
        session.commit()
        session.refresh(building)
        return building

    @staticmethod
    def get_by_id(
        session: Session,
        building_id: UUID,
        admin_id: UUID,
    ) -> Building | None:
        statement = (
            select(Building)
            .where(Building.id == building_id)
            .where(Building.admin_id == admin_id)
        )

        return session.exec(statement).first()

    @staticmethod
    def get_all_by_admin(
        session: Session,
        admin_id: UUID,
    ) -> list[Building]:
        statement = (
            select(Building)
            .where(Building.admin_id == admin_id)
            .order_by(Building.created_at.desc())
        )

        return list(session.exec(statement))

    @staticmethod
    def delete(
        session: Session,
        building: Building,
    ) -> None:
        session.delete(building)
        session.commit()

    @staticmethod
    def exists_for_admin(
        session: Session,
        building_id: UUID,
        admin_id: UUID,
    ) -> bool:

        statement = (
            select(Building)
            .where(Building.id == building_id)
            .where(Building.admin_id == admin_id)
        )

        return session.exec(statement).first() is not None
    @staticmethod
    def update(
        session: Session,
        building: Building,
    ) -> Building:
        session.add(building)
        session.commit()
        session.refresh(building)
        return building