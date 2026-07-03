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


@router.get(
    "/payments",
    response_model=list[PaymentRead],
)
def get_global_payments(
    session: SessionDep,
    admin: CurrentAdmin,
    building_id: UUID | None = None,
    room_id: UUID | None = None,
    status: str | None = None,
):
    return PaymentService.get_all_global(
        session=session,
        admin_id=admin.id,
        building_id=building_id,
        room_id=room_id,
        status=status,
    )


from fastapi.responses import HTMLResponse


@router.get(
    "/payments/{payment_id}/receipt",
    response_class=HTMLResponse,
)
def get_payment_receipt(
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

    # Resolve details via relationships
    lease = payment.lease
    tenant = lease.tenant
    room = tenant.room
    building = room.building

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Payment Receipt - {payment.receipt_number}</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 40px;
                color: #1e293b;
                background-color: #f8fafc;
            }}
            .receipt-box {{
                max-width: 800px;
                margin: auto;
                padding: 40px;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                background-color: #ffffff;
            }}
            .header {{
                text-align: center;
                border-bottom: 2px solid #3b82f6;
                padding-bottom: 24px;
                margin-bottom: 24px;
            }}
            .header h1 {{
                margin: 0;
                color: #1e3a8a;
                font-size: 32px;
                font-weight: 800;
                letter-spacing: -0.025em;
            }}
            .header p {{
                margin: 8px 0 0;
                color: #64748b;
                font-size: 16px;
                font-weight: 500;
            }}
            .meta-info {{
                display: flex;
                justify-content: space-between;
                margin-bottom: 32px;
                gap: 20px;
            }}
            .meta-info div {{
                flex: 1;
                font-size: 15px;
                line-height: 1.6;
            }}
            .meta-info .right {{
                text-align: right;
            }}
            .details-table {{
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 32px;
            }}
            .details-table th, .details-table td {{
                border: 1px solid #e2e8f0;
                padding: 16px;
                text-align: left;
                font-size: 15px;
            }}
            .details-table th {{
                background-color: #f1f5f9;
                color: #1e3a8a;
                font-weight: 600;
            }}
            .details-table .amount {{
                text-align: right;
            }}
            .footer {{
                margin-top: 48px;
                text-align: center;
                color: #64748b;
                font-size: 13px;
                border-top: 1px dashed #e2e8f0;
                padding-top: 24px;
            }}
            .btn-print {{
                display: block;
                width: 140px;
                margin: 24px auto;
                padding: 12px;
                text-align: center;
                background-color: #3b82f6;
                color: #ffffff;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 15px;
                box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
                transition: background-color 0.2s;
            }}
            .btn-print:hover {{
                background-color: #2563eb;
            }}
            @media print {{
                .btn-print {{
                    display: none;
                }}
                body {{
                    margin: 0;
                    background-color: #ffffff;
                }}
                .receipt-box {{
                    border: none;
                    box-shadow: none;
                    padding: 0;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="receipt-box">
            <div class="header">
                <h1>ESTARIS HOSTEL/PG</h1>
                <p>Official Payment Receipt</p>
            </div>
            
            <div class="meta-info">
                <div>
                    <strong>Receipt No:</strong> {payment.receipt_number}<br>
                    <strong>Date:</strong> {payment.payment_date.strftime('%B %d, %Y')}<br>
                    <strong>Billing Period:</strong> {payment.billing_month:02d}/{payment.billing_year}
                </div>
                <div class="right">
                    <strong>Tenant:</strong> {tenant.name}<br>
                    <strong>Room:</strong> {room.room_number} ({room.room_type})<br>
                    <strong>Building:</strong> {building.name}
                </div>
            </div>

            <table class="details-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="amount">Amount Due</th>
                        <th class="amount">Amount Paid</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Rent Payment ({payment.billing_month:02d}/{payment.billing_year})</td>
                        <td class="amount">₹{payment.amount_due:,.2f}</td>
                        <td class="amount">₹{payment.amount_paid:,.2f}</td>
                    </tr>
                </tbody>
            </table>

            <div class="meta-info">
                <div>
                    <strong>Payment Method:</strong> {payment.payment_method.upper()}<br>
                    <strong>Transaction Ref:</strong> {payment.transaction_reference or "N/A"}<br>
                    <strong>Status:</strong> {payment.status.upper()}
                </div>
                <div class="right">
                    <span style="font-size: 22px; color: #16a34a;"><strong>Paid Amount: ₹{payment.amount_paid:,.2f}</strong></span>
                </div>
            </div>

            <div class="footer">
                <p>Thank you for your payment!</p>
                <p>This is a system-generated receipt and does not require a physical signature.</p>
            </div>
        </div>
        
        <button class="btn-print" onclick="window.print()">Print Receipt</button>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)