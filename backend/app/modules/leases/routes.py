from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentAdmin, SessionDep
from app.modules.leases.schemas import (
    LeaseCreate,
    LeaseRead,
    LeaseUpdate,
    GlobalLeaseRead,
)
from app.modules.leases.services import LeaseService
from app.modules.tenants.services import TenantService

router = APIRouter(
    tags=["Leases"],
)


@router.post(
    "/tenants/{tenant_id}/leases",
    response_model=LeaseRead,
    status_code=status.HTTP_201_CREATED,
)
def create_lease(
    tenant_id: UUID,
    data: LeaseCreate,
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

    return LeaseService.create(
        session=session,
        tenant=tenant,
        data=data,
    )


@router.get(
    "/tenants/{tenant_id}/leases",
    response_model=list[LeaseRead],
)
def get_leases(
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

    return LeaseService.get_all(
        session=session,
        tenant_id=tenant_id,
    )


@router.get(
    "/leases/{lease_id}",
    response_model=LeaseRead,
)
def get_lease(
    lease_id: UUID,
    session: SessionDep,
    admin: CurrentAdmin,
):
    lease = LeaseService.get(
        session=session,
        lease_id=lease_id,
        admin_id=admin.id,
    )

    if lease is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lease not found",
        )

    return lease


@router.patch(
    "/leases/{lease_id}",
    response_model=LeaseRead,
)
def update_lease(
    lease_id: UUID,
    data: LeaseUpdate,
    session: SessionDep,
    admin: CurrentAdmin,
):
    lease = LeaseService.get(
        session=session,
        lease_id=lease_id,
        admin_id=admin.id,
    )

    if lease is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lease not found",
        )

    return LeaseService.update(
        session=session,
        lease=lease,
        data=data,
    )


@router.delete(
    "/leases/{lease_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_lease(
    lease_id: UUID,
    session: SessionDep,
    admin: CurrentAdmin,
):
    lease = LeaseService.get(
        session=session,
        lease_id=lease_id,
        admin_id=admin.id,
    )

    if lease is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lease not found",
        )

    LeaseService.delete(
        session=session,
        lease=lease,
    )

    return None


@router.get(
    "/leases",
    response_model=list[GlobalLeaseRead],
)
def get_global_leases(
    session: SessionDep,
    admin: CurrentAdmin,
):
    return LeaseService.get_all_global(
        session=session,
        admin_id=admin.id,
    )