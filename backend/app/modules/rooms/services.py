from uuid import UUID

from sqlmodel import Session
from fastapi import HTTPException, status
from app.modules.buildings.models import Building
from app.modules.buildings.repositories import BuildingRepository
from app.modules.rooms.models import Room
from app.modules.rooms.repositories import RoomRepository
from app.modules.rooms.schemas import (
    RoomCreate,
    RoomUpdate,
)


class RoomService:

    @staticmethod
    def create(
        session: Session,
        building_id: UUID,
        data: RoomCreate,
    ) -> Room:

        room = Room(
            building_id=building_id,
            room_number=data.room_number,
            room_type=data.room_type,
            capacity=data.capacity,
            base_rent=data.base_rent,
        )

        room = RoomRepository.create(
            session,
            room,
        )

        building = session.get(
            Building,
            building_id,
        )

        if building:
            building.total_rooms += 1
            BuildingRepository.update(
                session,
                building,
            )

        return room

    @staticmethod
    def get(
        session: Session,
        room_id: UUID,
        admin_id: UUID,
    ) -> Room | None:

        return RoomRepository.get_by_id(
            session,
            room_id,
            admin_id,
        )

    @staticmethod
    def get_all(
        session: Session,
        building_id: UUID,
    ) -> list[dict]:

        return RoomRepository.get_all_with_occupancy(
            session,
            building_id,
        )

    @staticmethod
    def update(
        session: Session,
        room: Room,
        data: RoomUpdate,
    ) -> Room:

        if data.room_number is not None:
            room.room_number = data.room_number

        if data.room_type is not None:
            room.room_type = data.room_type

        if data.capacity is not None:
            room.capacity = data.capacity

        if data.base_rent is not None:
            room.base_rent = data.base_rent

        return RoomRepository.update(
            session,
            room,
        )
    



    @staticmethod
    def delete(
        session: Session,
        room: Room,
    ) -> None:

        if room.tenants:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete room with assigned tenants.",
            )

        building = session.get(
            Building,
            room.building_id,
        )

        RoomRepository.delete(
            session,
            room,
        )

        if building:
            building.total_rooms -= 1
            BuildingRepository.update(
                session,
                building,
            )
    