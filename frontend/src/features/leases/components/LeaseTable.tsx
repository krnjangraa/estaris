import { useState } from "react";
import { Pencil, Trash2, StopCircle, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useDeleteLease,
  useUpdateLease,
} from "../hooks";

import type { Lease } from "../types";
import LeaseForm from "./LeaseForm";
import DeleteLeaseDialog from "./DeleteLeaseDialog";

interface Props {
  tenantId: string;
  leases: Lease[];
}

export default function LeaseTable({
  tenantId,
  leases,
}: Props) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState<Lease | undefined>(undefined);
  const [deleting, setDeleting] = useState<Lease>();

  const deleteLease = useDeleteLease(tenantId);
  const updateLease = useUpdateLease(tenantId);

  function handleTerminate(lease: Lease) {
    if (
      !window.confirm(
        "Are you sure you want to terminate this lease?"
      )
    ) {
      return;
    }

    updateLease.mutate(
      {
        id: lease.id,
        data: { status: "terminated" },
      },
      {
        onSuccess() {
          toast.success("Lease terminated");
        },
        onError(error: any) {
          toast.error(
            error.response?.data?.detail ??
              "Failed to terminate lease"
          );
        },
      }
    );
  }

  function handleDelete() {
    if (!deleting) return;

    deleteLease.mutate(deleting.id, {
      onSuccess() {
        toast.success("Lease deleted");
        setDeleting(undefined);
      },
      onError(error: any) {
        toast.error(
          error.response?.data?.detail ??
            "Failed to delete lease"
        );
      },
    });
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "terminated":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <>
      <LeaseForm
        tenantId={tenantId}
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(undefined);
          }
        }}
        lease={editing}
      />

      <DeleteLeaseDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(undefined);
          }
        }}
        onConfirm={handleDelete}
        loading={deleteLease.isPending}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="text-right">Rent</TableHead>
            <TableHead className="text-right">Deposit</TableHead>
            <TableHead className="text-center">Due Day</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {leases.map((lease) => (
            <TableRow key={lease.id}>
              <TableCell className="font-medium">
                {new Date(lease.start_date).toLocaleDateString()}
              </TableCell>

              <TableCell>
                {new Date(lease.end_date).toLocaleDateString()}
              </TableCell>

              <TableCell className="text-right">
                ₹{Number(lease.monthly_rent).toLocaleString("en-IN")}
              </TableCell>

              <TableCell className="text-right">
                ₹{Number(lease.security_deposit).toLocaleString("en-IN")}
              </TableCell>

              <TableCell className="text-center">
                {lease.payment_due_day}
              </TableCell>

              <TableCell>
                <Badge variant={getStatusBadgeVariant(lease.status)}>
                  {lease.status.toUpperCase()}
                </Badge>
              </TableCell>

              <TableCell className="text-right space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  title="View Payments"
                  onClick={() => navigate(`/leases/${lease.id}/payments`)}
                >
                  <CreditCard size={16} />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  title="Edit Lease"
                  onClick={() => setEditing(lease)}
                >
                  <Pencil size={16} />
                </Button>

                {lease.status === "active" && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    onClick={() => handleTerminate(lease)}
                    title="Terminate Lease"
                  >
                    <StopCircle size={16} />
                  </Button>
                )}

                {(lease.status === "terminated" ||
                  lease.status === "completed") && (
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setDeleting(lease)}
                    title="Delete Lease"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}

          {leases.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-10 text-muted-foreground"
              >
                No leases found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
