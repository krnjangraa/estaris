import { useState } from "react";
import { Plus } from "lucide-react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

import TenantForm from "@/features/tenants/components/TenantForm";
import TenantTable from "@/features/tenants/components/TenantTable";
import { useTenants } from "@/features/tenants/hooks";

export default function TenantsPage() {
  const { roomId } = useParams();

  const id = roomId ?? "";

  const [open, setOpen] = useState(false);

  const {
    data: tenants = [],
    isLoading,
  } = useTenants(id);

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Tenants
          </h1>

          <p className="text-muted-foreground">
            Manage tenants assigned to this room.
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      <TenantForm
        roomId={id}
        open={open}
        onOpenChange={setOpen}
      />

      <TenantTable
        roomId={id}
        tenants={tenants}
      />
    </div>
  );
}