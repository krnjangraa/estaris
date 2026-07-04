import { useState } from "react";
import { Plus } from "lucide-react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

import TenantForm from "@/features/tenants/components/TenantForm";
import TenantTable from "@/features/tenants/components/TenantTable";
import { useTenants } from "@/features/tenants/hooks";
import { useGlobalPayments } from "@/features/payments/hooks";
import PaymentTable from "@/features/payments/components/PaymentTable";
import { useRoom } from "@/features/rooms/hooks";


export default function TenantsPage() {
  const { roomId } = useParams();

  const id = roomId ?? "";

  const [open, setOpen] = useState(false);

  const {
    data: tenants = [],
    isLoading: tenantsLoading,
  } = useTenants(id);

  const {
    data: room,
    isLoading: roomLoading,
  } = useRoom(id);

  const {
    data: payments = [],
    isLoading: paymentsLoading,
  } = useGlobalPayments({ room_id: id });

  if (tenantsLoading || roomLoading) {
    return (
      <div className="py-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Room {room?.room_number} Tenants
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

      <div className="space-y-4 pt-8 border-t">
        <div>
          <h2 className="text-2xl font-bold">Room Rent History & Status</h2>
          <p className="text-muted-foreground text-sm">
            View paid/unpaid status for this room, send reminders, or record payments.
          </p>
        </div>

        {paymentsLoading ? (
          <div className="py-6 text-center text-slate-500">Loading payments...</div>
        ) : (
          <PaymentTable
            leaseId=""
            payments={payments}
            showDetails={false}
          />
        )}
      </div>
    </div>
  );
}