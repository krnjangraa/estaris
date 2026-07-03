import { useState } from "react";
import { Pencil, Trash2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Badge,
} from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useDeleteTenant,
} from "../hooks";

import type {
  Tenant,
} from "../types";

import TenantForm from "./TenantForm";
import DeleteTenantDialog from "./DeleteTenantDialog";

interface Props {
  roomId: string;
  tenants: Tenant[];
}

export default function TenantTable({
  roomId,
  tenants,
}: Props) {
  const navigate = useNavigate();

  const [editing, setEditing] =
    useState<Tenant>();

  const [deleting, setDeleting] =
    useState<Tenant>();

  const deleteTenant =
    useDeleteTenant(roomId);

  function handleDelete() {
    if (!deleting) return;

    deleteTenant.mutate(deleting.id, {
      onSuccess() {
        toast.success("Tenant deleted");
        setDeleting(undefined);
      },

      onError(error: any) {
        toast.error(
          error.response?.data?.detail ??
            "Failed to delete tenant"
        );
      },
    });
  }

  return (
    <>
      <TenantForm
        roomId={roomId}
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(undefined);
          }
        }}
        tenant={editing}
      />

      <DeleteTenantDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(undefined);
          }
        }}
        onConfirm={handleDelete}
        loading={deleteTenant.isPending}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>

            <TableHead>
              Contact
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead>
              Move In
            </TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell className="font-medium">
                {tenant.name}
              </TableCell>

              <TableCell>
                {tenant.contact_number}
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    tenant.status === "active"
                      ? "default"
                      : "secondary"
                  }
                >
                  {tenant.status}
                </Badge>
              </TableCell>

              <TableCell>
                {new Date(
                  tenant.move_in_date
                ).toLocaleDateString()}
              </TableCell>

              <TableCell className="text-right space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  title="Edit Tenant"
                  onClick={() =>
                    setEditing(tenant)
                  }
                >
                  <Pencil size={16} />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    navigate(`/tenants/${tenant.id}/leases`)
                  }
                  title="View Leases"
                >
                  <FileText size={16} />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  title="Delete Tenant"
                  onClick={() =>
                    setDeleting(tenant)
                  }
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {tenants.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-10 text-muted-foreground"
              >
                No tenants found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}