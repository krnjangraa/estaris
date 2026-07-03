from uuid import UUID
from fastapi import HTTPException, status
from sqlmodel import Session

from app.modules.rooms.models import Room
from app.modules.tenants.models import Tenant
from app.modules.tenants.repositories import TenantRepository
from app.modules.tenants.schemas import (
    TenantCreate,
    TenantUpdate,
)


class TenantService:

    @staticmethod
    def create(
        session: Session,
        room: Room,
        data: TenantCreate,
    ) -> Tenant:

        active_tenants = TenantRepository.active_tenant_count(
            session=session,
            room_id=room.id,
        )

        if active_tenants >= room.capacity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Room is already full",
            )

        tenant = Tenant(
            room_id=room.id,
            name=data.name,
            permanent_address=data.permanent_address,
            contact_number=data.contact_number,
            emergency_contact_name=data.emergency_contact_name,
            emergency_contact_number=data.emergency_contact_number,
            id_proof_type=data.id_proof_type,
            id_proof_number=data.id_proof_number,
            move_in_date=data.move_in_date,
        )

        return TenantRepository.create(
            session,
            tenant,
        )

    @staticmethod
    def get(
        session: Session,
        tenant_id,
        admin_id,
    ) -> Tenant | None:

        return TenantRepository.get_by_id(
            session,
            tenant_id,
            admin_id,
        )

    @staticmethod
    def get_all(
        session: Session,
        room_id,
    ) -> list[Tenant]:

        return TenantRepository.get_all_by_room(
            session,
            room_id,
        )

    @staticmethod
    def update(
        session: Session,
        tenant: Tenant,
        data: TenantUpdate,
    ) -> Tenant:

        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(tenant, key, value)

        return TenantRepository.update(
            session,
            tenant,
        )

    @staticmethod
    def delete(
        session: Session,
        tenant: Tenant,
    ) -> None:

        if tenant.leases:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete tenant if lease exists.",
            )

        TenantRepository.delete(
            session,
            tenant,
        )

    @staticmethod
    def get_all_global(
        session: Session,
        admin_id: UUID,
    ) -> list[dict]:
        return TenantRepository.get_all_global(
            session=session,
            admin_id=admin_id,
        )