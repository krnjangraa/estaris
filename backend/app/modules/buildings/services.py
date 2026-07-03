from uuid import UUID

from sqlmodel import Session

from app.modules.buildings.models import Building
from app.modules.buildings.repositories import BuildingRepository
from app.modules.buildings.schemas import (
    BuildingCreate,
    BuildingUpdate,
)


class BuildingService:

    @staticmethod
    def create(
        session: Session,
        admin_id: UUID,
        data: BuildingCreate,
    ) -> Building:

        building = Building(
            admin_id=admin_id,
            name=data.name,
            address=data.address,
            total_rooms=0,
        )

        return BuildingRepository.create(
            session,
            building,
        )

    @staticmethod
    def get_all(
        session: Session,
        admin_id: UUID,
    ) -> list[Building]:

        return BuildingRepository.get_all_by_admin(
            session,
            admin_id,
        )

    @staticmethod
    def get(
        session: Session,
        building_id: UUID,
        admin_id: UUID,
    ) -> Building | None:

        return BuildingRepository.get_by_id(
            session,
            building_id,
            admin_id,
        )

    @staticmethod
    def update(
        session: Session,
        building: Building,
        data: BuildingUpdate,
    ) -> Building:

        if data.name is not None:
            building.name = data.name

        if data.address is not None:
            building.address = data.address

        session.add(building)
        session.commit()
        session.refresh(building)

        return building

    @staticmethod
    def delete(
        session: Session,
        building: Building,
    ) -> None:

        BuildingRepository.delete(
            session,
            building,
        )