import { useState } from "react";
import { ArrowLeft, MessageCircle, CheckCircle2, ShieldAlert } from "lucide-react";

import { useParams, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useTenant } from "@/features/tenants/hooks";
import { useLeases } from "@/features/leases/hooks";
import { usePayments } from "@/features/payments/hooks";
import type { Payment } from "@/features/payments/types";

export default function TenantInfoPage() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const id = tenantId ?? "";

  const [messaging, setMessaging] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  const { data: tenant, isLoading: loadingTenant } = useTenant(id);
  const { data: leases = [], isLoading: loadingLeases } = useLeases(id);

  const activeLease = leases.find((l) => l.status === "active");
  const activeLeaseId = activeLease?.id ?? "";

  const { data: payments = [], isLoading: loadingPayments } = usePayments(activeLeaseId);

  if (loadingTenant || loadingLeases || loadingPayments) {
    return <div className="py-10 text-center">Loading tenant profile...</div>;
  }

  if (!tenant) {
    return <div className="py-10 text-center text-red-500">Tenant not found</div>;
  }

  const unpaidPayments = payments.filter((p) => p.status === "pending" || p.status === "overdue");
  const hasUnpaid = unpaidPayments.length > 0;

  function handleSendCustomMessage() {
    const digits = tenant!.contact_number.replace(/\D/g, "");
    const phone = digits.length === 10 ? `91${digits}` : digits;
    const link = `https://wa.me/${phone}?text=${encodeURIComponent(customMessage)}`;
    window.open(link, "_blank");
    setMessaging(false);
    setCustomMessage("");
  }

  function handleOpenMessageDialog() {
    setMessaging(true);
    setCustomMessage(`Hello ${tenant!.name},\n\n`);
  }

  function handleSendRentReminder(payment: Payment) {
    const digits = tenant!.contact_number.replace(/\D/g, "");
    const phone = digits.length === 10 ? `91${digits}` : digits;
    
    const MONTH_NAMES = [
      "", "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = MONTH_NAMES[payment.billing_month];
    const amount = Number(payment.amount_due ?? 0).toLocaleString("en-IN");

    const msg = `Dear ${tenant!.name},\n\nThis is a reminder that your rent of ₹${amount} for ${month} ${payment.billing_year} (Room ${tenant!.room_number}, ${tenant!.building_name}) is pending. Please arrange the payment at the earliest.\n\nThank you,\nEstaris Management`;
    const link = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(link, "_blank");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Tenant Profile</h1>
          <p className="text-muted-foreground">
            View full registration details and rent status
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader className="border-b">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{tenant.name}</CardTitle>
                <CardDescription className="mt-1">
                  Assigned to Room {tenant.room_number} · {tenant.building_name}
                </CardDescription>
              </div>
              <Badge variant={tenant.status === "active" ? "default" : "secondary"}>
                {tenant.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="py-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Number</h4>
                <p className="text-sm font-medium mt-1">{tenant.contact_number}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Move-In Date</h4>
                <p className="text-sm font-medium mt-1">{new Date(tenant.move_in_date).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID Proof</h4>
                <p className="text-sm font-medium mt-1">
                  {tenant.id_proof_type} - {tenant.id_proof_number}
                </p>
              </div>
              {tenant.monthly_rent && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Monthly Lease Rent</h4>
                  <p className="text-sm font-bold mt-1 text-slate-800">
                    ₹{Number(tenant.monthly_rent).toLocaleString("en-IN")}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Emergency Contact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <h5 className="text-xs text-muted-foreground">Name</h5>
                  <p className="text-sm font-medium">{tenant.emergency_contact_name}</p>
                </div>
                <div>
                  <h5 className="text-xs text-muted-foreground">Contact Phone</h5>
                  <p className="text-sm font-medium">{tenant.emergency_contact_number}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Permanent Address</h4>
              <p className="text-sm font-medium mt-2 text-slate-600 whitespace-pre-wrap">
                {tenant.permanent_address}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Message & Reminders */}
        <div className="space-y-6">
          <Card className="shadow-sm border-emerald-100 bg-emerald-50/20">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Contact or message the tenant directly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                onClick={handleOpenMessageDialog}
              >
                <MessageCircle className="h-4 w-4" />
                Custom WhatsApp
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-100">
            <CardHeader>
              <CardTitle className="text-lg">Rent Due Status</CardTitle>
              <CardDescription>Outstanding rent bills matching active lease</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasUnpaid ? (
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2.5">
                    <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-950">Rent Pending / Overdue</p>
                      <p className="text-xs text-red-700 mt-0.5">
                        {unpaidPayments.length} unpaid bill{unpaidPayments.length !== 1 ? "s" : ""} found.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {unpaidPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="p-3 border rounded-lg flex items-center justify-between bg-white shadow-sm"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-700">
                            Bill for month {payment.billing_month}/{payment.billing_year}
                          </p>
                          <p className="text-sm font-bold text-slate-900 mt-0.5">
                            ₹{Number(payment.amount_due).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 text-xs"
                          onClick={() => handleSendRentReminder(payment)}
                        >
                          Remind
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-green-50 border border-green-100 flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-950">All Rents Paid</p>
                    <p className="text-xs text-green-700 mt-0.5">
                      No pending or overdue payments for this tenant.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={messaging} onOpenChange={(open) => !open && setMessaging(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Custom Message</DialogTitle>
            <DialogDescription>
              Draft a custom WhatsApp message to send to {tenant.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tenant-msg">Message</Label>
              <Textarea
                id="tenant-msg"
                rows={5}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessaging(false)}>
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
    </div>
  );
}
