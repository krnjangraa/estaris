from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import SessionDep, get_current_admin
from app.modules.auth.models import Admin
from app.modules.buildings.schemas import (
    BuildingCreate,
    BuildingRead,
    BuildingUpdate,
)
from app.modules.buildings.services import BuildingService

router = APIRouter(
    prefix="/buildings",
    tags=["Buildings"],
)


@router.post(
    "",
    response_model=BuildingRead,
    status_code=status.HTTP_201_CREATED,
)
def create_building(
    data: BuildingCreate,
    session: SessionDep,
    admin: Admin = Depends(get_current_admin),
):
    return BuildingService.create(
        session=session,
        admin_id=admin.id,
        data=data,
    )


@router.get(
    "",
    response_model=list[BuildingRead],
)
def get_buildings(
    session: SessionDep,
    admin: Admin = Depends(get_current_admin),
):
    return BuildingService.get_all(
        session=session,
        admin_id=admin.id,
    )


@router.get(
    "/{building_id}",
    response_model=BuildingRead,
)
def get_building(
    building_id: UUID,
    session: SessionDep,
    admin: Admin = Depends(get_current_admin),
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

    return building


@router.patch(
    "/{building_id}",
    response_model=BuildingRead,
)
def update_building(
    building_id: UUID,
    data: BuildingUpdate,
    session: SessionDep,
    admin: Admin = Depends(get_current_admin),
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

    return BuildingService.update(
        session=session,
        building=building,
        data=data,
    )


@router.delete(
    "/{building_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_building(
    building_id: UUID,
    session: SessionDep,
    admin: Admin = Depends(get_current_admin),
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

    BuildingService.delete(
        session=session,
        building=building,
    )