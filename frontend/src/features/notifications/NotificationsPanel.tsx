import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Bell,

  CheckCircle2,
  Clock,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useMarkNotified, useRentDueNotifications } from "./hooks";
import type { RentDueNotification } from "./types";
import PaymentForm from "@/features/payments/components/PaymentForm";
import type { Payment } from "@/features/payments/types";


const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function buildWhatsAppLink(n: RentDueNotification): string {
  // Normalize phone: strip non-digits, prepend 91 if 10 digits
  const digits = n.contact_number.replace(/\D/g, "");
  const phone = digits.length === 10 ? `91${digits}` : digits;

  const overdueText =
    n.days_overdue > 0
      ? ` Your payment is ${n.days_overdue} day${n.days_overdue > 1 ? "s" : ""} overdue.`
      : n.days_overdue === 0
      ? " Your payment is due today."
      : "";

  const message = encodeURIComponent(
    `Dear ${n.tenant_name},\n\nThis is a reminder that your rent of ₹${n.amount_due.toLocaleString("en-IN")} for ${MONTH_NAMES[n.billing_month]} ${n.billing_year} (Room ${n.room_number}, ${n.building_name}) is pending.${overdueText} Please arrange the payment at the earliest.\n\nThank you,\nEstaris Management`
  );

  return `https://wa.me/${phone}?text=${message}`;
}

function buildSmsLink(n: RentDueNotification): string {
  const digits = n.contact_number.replace(/\D/g, "");
  const message = encodeURIComponent(
    `Rent reminder: ₹${n.amount_due.toLocaleString("en-IN")} due for ${MONTH_NAMES[n.billing_month]} ${n.billing_year} (Room ${n.room_number}, ${n.building_name}). - Estaris`
  );
  return `sms:${digits}?body=${message}`;
}

function OverdueBadge({ days }: { days: number }) {
  if (days > 7)
    return (
      <Badge variant="destructive" className="text-xs gap-1">
        <AlertCircle className="w-3 h-3" />
        {days}d overdue
      </Badge>
    );
  if (days > 0)
    return (
      <Badge className="text-xs gap-1 bg-orange-500 hover:bg-orange-600 text-white">
        <Clock className="w-3 h-3" />
        {days}d overdue
      </Badge>
    );
  if (days === 0)
    return (
      <Badge className="text-xs gap-1 bg-yellow-500 hover:bg-yellow-600 text-white">
        <Clock className="w-3 h-3" />
        Due today
      </Badge>
    );
  return (
    <Badge variant="secondary" className="text-xs gap-1">
      Due in {Math.abs(days)}d
    </Badge>
  );
}

function NotificationCard({
  n,
  onPayClick,
}: {
  n: RentDueNotification;
  onPayClick: (n: RentDueNotification) => void;
}) {
  const markNotified = useMarkNotified();
  const alreadyNotified = !!n.reminder_sent_at;

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        alreadyNotified
          ? "bg-muted/40 border-border/50 opacity-75"
          : "bg-card border-border hover:border-primary/30"
      }`}
    >
      {/* Top row: name + overdue badge */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <Link to={`/tenants/${n.tenant_id}`} className="font-semibold text-sm leading-tight text-primary hover:underline block">
            {n.tenant_name}
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">
            Room{" "}
            <Link to={`/rooms/${n.room_id}`} className="text-primary hover:underline font-medium">
              {n.room_number}
            </Link>{" "}
            ·{" "}
            <Link to={`/buildings/${n.building_id}/rooms`} className="text-primary hover:underline font-medium">
              {n.building_name}
            </Link>
          </p>
        </div>

        <OverdueBadge days={n.days_overdue} />
      </div>

      {/* Amount */}
      <p className="text-lg font-bold text-primary mt-2">
        ₹{n.amount_due.toLocaleString("en-IN")}
        <span className="text-xs font-normal text-muted-foreground ml-1">
          for {MONTH_NAMES[n.billing_month]} {n.billing_year}
        </span>
      </p>

      {/* Already notified indicator */}
      {alreadyNotified && (
        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
          <CheckCircle2 className="w-3 h-3" />
          Reminded on{" "}
          {format(new Date(n.reminder_sent_at!), "dd MMM, hh:mm a")}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-3 flex-wrap">
        <Button
          size="sm"
          className="gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs h-8"
          asChild
        >
          <a href={buildWhatsAppLink(n)} target="_blank" rel="noreferrer">
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs h-8"
          asChild
        >
          <a href={buildSmsLink(n)}>
            <Phone className="w-3.5 h-3.5" />
            SMS
          </a>
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
          onClick={() => onPayClick(n)}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Mark Paid
        </Button>

        <Button
          size="sm"
          variant={alreadyNotified ? "ghost" : "secondary"}
          className="gap-1.5 text-xs h-8 ml-auto"
          disabled={markNotified.isPending}
          onClick={() => markNotified.mutate(n.payment_id)}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {alreadyNotified ? "Re-mark" : "Mark notified"}
        </Button>
      </div>
    </div>
  );
}

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({
  open,
  onClose,
}: NotificationsPanelProps) {
  const { data: notifications = [], isLoading } = useRentDueNotifications();
  const [payNotification, setPayNotification] = useState<RentDueNotification | null>(null);

  const unnotified = notifications.filter((n) => !n.reminder_sent_at);
  const notified = notifications.filter((n) => n.reminder_sent_at);

  const paymentToEdit: Payment | undefined = payNotification ? {
    id: payNotification.payment_id,
    lease_id: payNotification.lease_id,
    billing_month: payNotification.billing_month,
    billing_year: payNotification.billing_year,
    amount_due: payNotification.amount_due,
    amount_paid: payNotification.amount_due,
    payment_date: new Date().toISOString().split("T")[0],
    payment_method: "upi",
    status: "paid",
    receipt_number: "",
    tenant_name: payNotification.tenant_name,
    contact_number: payNotification.contact_number,
    room_number: payNotification.room_number,
    building_name: payNotification.building_name,
    created_at: "",
    updated_at: "",
  } : undefined;

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full sm:w-[420px] p-0 flex flex-col"
        >
          {/* Header */}
          <SheetHeader className="px-5 pt-5 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <SheetTitle className="text-base">Rent Reminders</SheetTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-left">
              {isLoading
                ? "Loading..."
                : notifications.length === 0
                ? "All rents are up to date 🎉"
                : `${unnotified.length} tenant${unnotified.length !== 1 ? "s" : ""} pending reminder`}
            </p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-xl bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground gap-3">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
                <p className="text-sm font-medium">No pending reminders</p>
                <p className="text-xs">All tenants are up to date.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Unnotified first */}
                {unnotified.map((n) => (
                  <NotificationCard
                    key={n.payment_id}
                    n={n}
                    onPayClick={setPayNotification}
                  />
                ))}

                {/* Already notified section */}
                {notified.length > 0 && unnotified.length > 0 && (
                  <Separator className="my-2" />
                )}
                {notified.length > 0 && (
                  <>
                    <p className="text-xs font-medium text-muted-foreground px-1">
                      Already reminded ({notified.length})
                    </p>
                    {notified.map((n) => (
                      <NotificationCard
                        key={n.payment_id}
                        n={n}
                        onPayClick={setPayNotification}
                      />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {paymentToEdit && (
        <PaymentForm
          leaseId={paymentToEdit.lease_id}
          open={!!payNotification}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setPayNotification(null);
            }
          }}
          payment={paymentToEdit}
          defaultAmountDue={paymentToEdit.amount_due}
        />
      )}
    </>
  );
}
