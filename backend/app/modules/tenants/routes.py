from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentAdmin, SessionDep
from app.modules.rooms.services import RoomService
from app.modules.tenants.schemas import (
    TenantCreate,
    TenantRead,
    TenantUpdate,
    GlobalTenantRead,
)
from app.modules.tenants.services import TenantService

router = APIRouter(
    tags=["Tenants"],
)


@router.post(
    "/rooms/{room_id}/tenants",
    response_model=TenantRead,
    status_code=status.HTTP_201_CREATED,
)
def create_tenant(
    room_id: UUID,
    data: TenantCreate,
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

    return TenantService.create(
        session=session,
        room=room,
        data=data,
    )


@router.get(
    "/rooms/{room_id}/tenants",
    response_model=list[TenantRead],
)
def get_tenants(
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

    return TenantService.get_all(
        session=session,
        room_id=room_id,
    )


@router.get(
    "/tenants/{tenant_id}",
    response_model=TenantRead,
)
def get_tenant(
    tenant_id: UUID,
    session: SessionDep,
    admin: CurrentAdmin,
):
    tenant = TenantService.get(
        session=session,
        tenant_id=tenant_id,
        admin_id=admin.id,
    )

    if tenant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )

    return tenant


@router.patch(
    "/tenants/{tenant_id}",
    response_model=TenantRead,
)
def update_tenant(
    tenant_id: UUID,
    data: TenantUpdate,
    session: SessionDep,
    admin: CurrentAdmin,
):
    tenant = TenantService.get(
        session=session,
        tenant_id=tenant_id,
        admin_id=admin.id,
    )

    if tenant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )

    return TenantService.update(
        session=session,
        tenant=tenant,
        data=data,
    )


@router.delete(
    "/tenants/{tenant_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_tenant(
    tenant_id: UUID,
    session: SessionDep,
    admin: CurrentAdmin,
):
    tenant = TenantService.get(
        session=session,
        tenant_id=tenant_id,
        admin_id=admin.id,
    )

    if tenant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )

    TenantService.delete(
        session=session,
        tenant=tenant,
    )

    return None


@router.get(
    "/tenants",
    response_model=list[GlobalTenantRead],
)
def get_global_tenants(
    session: SessionDep,
    admin: CurrentAdmin,
):
    return TenantService.get_all_global(
        session=session,
        admin_id=admin.id,
    )