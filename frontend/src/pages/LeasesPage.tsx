import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import LeaseForm from "@/features/leases/components/LeaseForm";
import LeaseTable from "@/features/leases/components/LeaseTable";
import { useLeases } from "@/features/leases/hooks";
import { useTenant } from "@/features/tenants/hooks";

export default function LeasesPage() {
  const { tenantId } = useParams();
  const navigate = useNavigate();

  const id = tenantId ?? "";

  const [open, setOpen] = useState(false);

  const { data: tenant, isLoading: loadingTenant } = useTenant(id);
  const { data: leases = [], isLoading: loadingLeases } = useLeases(id);

  if (loadingTenant || loadingLeases) {
    return <div className="py-10 text-center">Loading...</div>;
  }

  if (!tenant) {
    return (
      <div className="py-10 text-center text-red-500">Tenant not found</div>
    );
  }

  const hasActiveLease = leases.some((lease) => lease.status === "active");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/rooms/${tenant.room_id}`)}

        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Leases</h1>
          <p className="text-muted-foreground">
            Manage lease agreements for {tenant.name}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {hasActiveLease ? (
            <span className="text-amber-600 font-medium">
              This tenant currently has an active lease. Terminate it to create a new one.
            </span>
          ) : (
            <span>No active lease. You can create a new lease.</span>
          )}
        </div>

        <Button onClick={() => setOpen(true)} disabled={hasActiveLease}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lease
        </Button>
      </div>

      <LeaseForm
        tenantId={id}
        open={open}
        onOpenChange={setOpen}
      />

      <LeaseTable
        tenantId={id}
        leases={leases}
      />
    </div>
  );
}
