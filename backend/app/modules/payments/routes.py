from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentAdmin, SessionDep
from app.modules.leases.services import LeaseService
from app.modules.payments.schemas import (
    PaymentCreate,
    PaymentRead,
    PaymentUpdate,
)
from app.modules.payments.services import PaymentService

router = APIRouter(
    tags=["Payments"],
)


@router.post(
    "/leases/{lease_id}/payments",
    response_model=PaymentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_payment(
    lease_id: UUID,
    data: PaymentCreate,
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

    return PaymentService.create(
        session=session,
        lease=lease,
        data=data,
    )


@router.get(
    "/leases/{lease_id}/payments",
    response_model=list[PaymentRead],
)
def get_payments(
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

    return PaymentService.get_all(
        session=session,
        lease_id=lease_id,
    )


@router.get(
    "/payments/{payment_id}",
    response_model=PaymentRead,
)
def get_payment(
    payment_id: UUID,
    session: SessionDep,
    admin: CurrentAdmin,
):
    payment = PaymentService.get(
        session=session,
        payment_id=payment_id,
        admin_id=admin.id,
    )

    if payment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )

    return payment


@router.patch(
    "/payments/{payment_id}",
    response_model=PaymentRead,
)
def update_payment(
    payment_id: UUID,
    data: PaymentUpdate,
    session: SessionDep,
    admin: CurrentAdmin,
):
    payment = PaymentService.get(
        session=session,
        payment_id=payment_id,
        admin_id=admin.id,
    )

    if payment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )

    return PaymentService.update(
        session=session,
        payment=payment,
        data=data,
    )


@router.delete(
    "/payments/{payment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_payment(
    payment_id: UUID,
    session: SessionDep,
    admin: CurrentAdmin,
):
    payment = PaymentService.get(
        session=session,
        payment_id=payment_id,
        admin_id=admin.id,
    )

    if payment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )

    PaymentService.delete(
        session=session,
        payment=payment,
    )

    return None