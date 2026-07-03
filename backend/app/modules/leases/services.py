from fastapi import HTTPException, status
from sqlmodel import Session

from app.modules.leases.models import Lease
from app.modules.leases.repositories import LeaseRepository
from app.modules.leases.schemas import (
    LeaseCreate,
    LeaseUpdate,
)
from app.modules.tenants.models import Tenant


class LeaseService:

    @staticmethod
    def create(
        session: Session,
        tenant: Tenant,
        data: LeaseCreate,
    ) -> Lease:

        active = LeaseRepository.active_lease(
            session,
            tenant.id,
        )

        if active is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tenant already has an active lease",
            )

        lease = Lease(
            tenant_id=tenant.id,
            start_date=data.start_date,
            end_date=data.end_date,
            monthly_rent=data.monthly_rent,
            security_deposit=data.security_deposit,
            payment_due_day=data.payment_due_day,
        )

        return LeaseRepository.create(
            session,
            lease,
        )

    @staticmethod
    def get(
        session: Session,
        lease_id,
        admin_id,
    ):

        return LeaseRepository.get_by_id(
            session,
            lease_id,
            admin_id,
        )

    @staticmethod
    def get_all(
        session: Session,
        tenant_id,
    ):

        return LeaseRepository.get_all_by_tenant(
            session,
            tenant_id,
        )

    @staticmethod
    def update(
        session: Session,
        lease: Lease,
        data: LeaseUpdate,
    ):

        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(lease, key, value)

        return LeaseRepository.update(
            session,
            lease,
        )

    @staticmethod
    def delete(
        session: Session,
        lease: Lease,
    ):

        LeaseRepository.delete(
            session,
            lease,
        )