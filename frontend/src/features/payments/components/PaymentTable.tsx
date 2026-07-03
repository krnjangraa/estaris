import { Pencil, Printer, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { printReceipt } from "../api";
import type { Payment } from "../types";
import DeletePaymentDialog from "./DeletePaymentDialog";
import PaymentForm from "./PaymentForm";

interface Props {
  leaseId: string;
  payments: Payment[];
  defaultAmountDue?: number;
  showDetails?: boolean;
}

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function PaymentTable({
  leaseId,
  payments,
  defaultAmountDue,
  showDetails = false,
}: Props) {
  const [editing, setEditing] = useState<Payment | undefined>(undefined);
  const [deleting, setDeleting] = useState<Payment | undefined>(undefined);
  const [printingId, setPrintingId] = useState<string | null>(null);

  async function handlePrint(paymentId: string) {
    setPrintingId(paymentId);
    try {
      await printReceipt(paymentId);
      toast.success("Receipt print window loaded");
    } catch {
      toast.error("Failed to load receipt");
    } finally {
      setPrintingId(null);
    }
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {showDetails && (
              <>
                <TableHead>Tenant</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Room</TableHead>
              </>
            )}
            <TableHead>Billing Month</TableHead>
            <TableHead>Amount Due</TableHead>
            <TableHead>Amount Paid</TableHead>
            <TableHead>Payment Date</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Receipt No</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showDetails ? 11 : 8}
                className="text-center py-10 text-slate-500"
              >
                No payment records found.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                {showDetails && (
                  <>
                    <TableCell className="font-semibold text-slate-800">
                      {payment.tenant_name}
                    </TableCell>
                    <TableCell>{payment.building_name}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-600">
                      {payment.room_number}
                    </TableCell>
                  </>
                )}
                <TableCell className="font-medium">
                  {MONTH_NAMES[payment.billing_month]} {payment.billing_year}
                </TableCell>
                <TableCell>₹{Number(payment.amount_due ?? 0).toLocaleString("en-IN")}</TableCell>
                <TableCell>₹{Number(payment.amount_paid ?? 0).toLocaleString("en-IN")}</TableCell>
                <TableCell>{payment.payment_date}</TableCell>
                <TableCell className="capitalize">
                  {payment.payment_method.replace("_", " ")}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(
                      payment.status
                    )}`}
                  >
                    {payment.status.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {payment.receipt_number}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      title="Print Receipt"
                      onClick={() => handlePrint(payment.id)}
                      disabled={printingId === payment.id}
                    >
                      <Printer size={16} />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      title="Edit Payment"
                      onClick={() => setEditing(payment)}
                    >
                      <Pencil size={16} />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      title="Delete Payment"
                      onClick={() => setDeleting(payment)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PaymentForm
        leaseId={editing?.lease_id ?? leaseId}
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(undefined);
          }
        }}
        payment={editing}
        defaultAmountDue={defaultAmountDue}
      />

      <DeletePaymentDialog
        leaseId={deleting?.lease_id ?? leaseId}
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(undefined);
          }
        }}
        payment={deleting}
      />
    </div>
  );
}
