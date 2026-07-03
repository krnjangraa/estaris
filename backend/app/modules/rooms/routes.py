from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentAdmin, SessionDep
from app.modules.buildings.services import BuildingService
from app.modules.rooms.schemas import (
    RoomCreate,
    RoomRead,
    RoomUpdate,
    GlobalRoomRead,
)
from app.modules.rooms.services import RoomService

router = APIRouter(
    tags=["Rooms"],
)


@router.post(
    "/buildings/{building_id}/rooms",
    response_model=RoomRead,
    status_code=status.HTTP_201_CREATED,
)
def create_room(
    building_id: UUID,
    data: RoomCreate,
    session: SessionDep,
    admin: CurrentAdmin,
):
    building = BuildingService.get(
        session=session,
        building_id=building_id,
        admin_id=admin.id,
    )

    if building is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Building not found",
        )

    return RoomService.create(
        session=session,
        building_id=building_id,
        data=data,
    )


@router.get(
    "/buildings/{building_id}/rooms",
    response_model=list[RoomRead],
)
def get_rooms(
    building_id: UUID,
    session: SessionDep,
    admin: CurrentAdmin,
):
    building = BuildingService.get(
        session=session,
        building_id=building_id,
        admin_id=admin.id,
    )

    if building is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Building not found",
        )

    return RoomService.get_all(
        session=session,
        building_id=building_id,
    )


@router.get(
    "/rooms/{room_id}",
    response_model=RoomRead,
)
def get_room(
    room_id: UUID,
    session: SessionDep,
    admin: CurrentAdmin,
):
    room = RoomService.get(
        session=session,
        room_id=room_id,
        admin_id=admin.id,
    )

    if room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found",
        )

    return room


@router.patch(
    "/rooms/{room_id}",
    response_model=RoomRead,
)
def update_room(
    room_id: UUID,
    data: RoomUpdate,
    session: SessionDep,
    admin: CurrentAdmin,
):
    room = RoomService.get(
        session=session,
        room_id=room_id,
        admin_id=admin.id,
    )

    if room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found",
        )

    return RoomService.update(
        session=session,
        room=room,
        data=data,
    )


@router.delete(
    "/rooms/{room_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_room(
    room_id: UUID,
    session: SessionDep,
    admin: CurrentAdmin,
):
    room = RoomService.get(
        session=session,
        room_id=room_id,
        admin_id=admin.id,
    )

    if room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found",
        )

    RoomService.delete(
        session=session,
        room=room,
    )


@router.get(
    "/rooms",
    response_model=list[GlobalRoomRead],
)
def get_global_rooms(
    session: SessionDep,
    admin: CurrentAdmin,
):
    return RoomService.get_all_global(
        session=session,
        admin_id=admin.id,
    )