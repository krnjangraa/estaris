import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLease } from "@/features/leases/hooks";
import PaymentForm from "@/features/payments/components/PaymentForm";
import PaymentTable from "@/features/payments/components/PaymentTable";
import { usePayments } from "@/features/payments/hooks";
import { useTenant } from "@/features/tenants/hooks";

export default function PaymentsPage() {
  const { leaseId } = useParams();
  const navigate = useNavigate();

  const id = leaseId ?? "";

  const [open, setOpen] = useState(false);

  const { data: lease, isLoading: loadingLease } = useLease(id);
  const { data: tenant, isLoading: loadingTenant } = useTenant(
    lease?.tenant_id ?? ""
  );
  const { data: payments = [], isLoading: loadingPayments } = usePayments(id);

  if (loadingLease || loadingTenant || loadingPayments) {
    return <div className="py-10 text-center">Loading...</div>;
  }

  if (!lease || !tenant) {
    return (
      <div className="py-10 text-center text-red-500">Lease or Tenant not found</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/tenants/${lease.tenant_id}/leases`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            Manage rent payments for {tenant.name}
          </p>
        </div>
      </div>

      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-500 block">Monthly Rent</span>
            <strong className="text-base text-slate-800">
              ₹{lease.monthly_rent.toLocaleString("en-IN")}
            </strong>
          </div>
          <div>
            <span className="text-slate-500 block">Security Deposit</span>
            <strong className="text-base text-slate-800">
              ₹{lease.security_deposit.toLocaleString("en-IN")}
            </strong>
          </div>
          <div>
            <span className="text-slate-500 block">Start Date</span>
            <strong className="text-base text-slate-800">{lease.start_date}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Lease Status</span>
            <span
              className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                lease.status === "active"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              {lease.status}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Payment Records</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment
        </Button>
      </div>

      <PaymentTable
        leaseId={id}
        payments={payments}
        defaultAmountDue={lease.monthly_rent}
      />

      <PaymentForm
        leaseId={id}
        open={open}
        onOpenChange={setOpen}
        defaultAmountDue={lease.monthly_rent}
      />
    </div>
  );
}
