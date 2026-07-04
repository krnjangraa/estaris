import { useState } from "react";
import { Eye, Pencil, Trash2, FileText, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Badge,
} from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

  const [viewingTenant, setViewingTenant] = useState<Tenant | null>(null);
  const [messagingTenant, setMessagingTenant] = useState<Tenant | null>(null);

  const [customMessage, setCustomMessage] = useState("");

  const deleteTenant =
    useDeleteTenant(roomId);

  function handleSendCustomMessage() {
    if (!messagingTenant) return;
    const digits = messagingTenant.contact_number.replace(/\D/g, "");
    const phone = digits.length === 10 ? `91${digits}` : digits;
    const link = `https://wa.me/${phone}?text=${encodeURIComponent(customMessage)}`;
    window.open(link, "_blank");
    setMessagingTenant(null);
    setCustomMessage("");
  }

  function handleOpenMessageDialog(tenant: Tenant) {
    setMessagingTenant(tenant);
    setCustomMessage(`Hello ${tenant.name},\n\n`);
  }


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
              Rent Details
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

              <TableCell className="text-right font-medium">
                {tenant.monthly_rent ? `₹${Number(tenant.monthly_rent).toLocaleString("en-IN")}` : "—"}
              </TableCell>

              <TableCell className="text-right space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  title="View Tenant Info"
                  onClick={() => setViewingTenant(tenant)}
                >
                  <Eye size={16} />
                </Button>

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
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  title="Send WhatsApp Message"
                  onClick={() => handleOpenMessageDialog(tenant)}
                >
                  <MessageCircle size={16} />
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
                colSpan={6}
                className="text-center py-10 text-muted-foreground"
              >
                No tenants found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={!!messagingTenant} onOpenChange={(open) => !open && setMessagingTenant(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Custom Message</DialogTitle>
            <DialogDescription>
              Draft a custom WhatsApp message to send to {messagingTenant?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="custom-msg">Message</Label>
              <Textarea
                id="custom-msg"
                rows={5}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessagingTenant(null)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSendCustomMessage}
            >
              Send WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingTenant} onOpenChange={(open) => !open && setViewingTenant(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tenant Details</DialogTitle>
            <DialogDescription>
              Full profile and registration details for {viewingTenant?.name}.
            </DialogDescription>
          </DialogHeader>
          {viewingTenant && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Full Name</h4>
                  <p className="text-sm font-medium mt-1">{viewingTenant.name}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Status</h4>
                  <Badge variant={viewingTenant.status === "active" ? "default" : "secondary"} className="mt-1">
                    {viewingTenant.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Phone Number</h4>
                  <p className="text-sm font-medium mt-1">{viewingTenant.contact_number}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Move-In Date</h4>
                  <p className="text-sm font-medium mt-1">{new Date(viewingTenant.move_in_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">ID Proof Type</h4>
                  <p className="text-sm font-medium mt-1">{viewingTenant.id_proof_type}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">ID Proof Number</h4>
                  <p className="text-sm font-medium mt-1">{viewingTenant.id_proof_number}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Emergency Contact</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <h5 className="text-xs text-muted-foreground">Name</h5>
                    <p className="text-sm font-medium">{viewingTenant.emergency_contact_name}</p>
                  </div>
                  <div>
                    <h5 className="text-xs text-muted-foreground">Phone</h5>
                    <p className="text-sm font-medium">{viewingTenant.emergency_contact_number}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Permanent Address</h4>
                <p className="text-sm font-medium mt-1 text-slate-600 whitespace-pre-wrap">{viewingTenant.permanent_address}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewingTenant(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}