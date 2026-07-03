import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  useCreatePayment,
  useUpdatePayment,
} from "../hooks";
import {
  paymentSchema,
  type PaymentInput,
  type PaymentSchema,
} from "../schema";
import type { Payment } from "../types";

interface Props {
  leaseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: Payment;
  defaultAmountDue?: number;
}

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export default function PaymentForm({
  leaseId,
  open,
  onOpenChange,
  payment,
  defaultAmountDue,
}: Props) {
  const createPayment = useCreatePayment(leaseId);
  const updatePayment = useUpdatePayment(leaseId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentInput, unknown, PaymentSchema>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      billing_month: new Date().getMonth() + 1,
      billing_year: new Date().getFullYear(),
      amount_due: defaultAmountDue ?? undefined,
      amount_paid: defaultAmountDue ?? 0,
      payment_date: new Date().toISOString().split("T")[0],
      payment_method: "upi",
      status: "paid",
      transaction_reference: "",
      remarks: "",
    },
  });

  useEffect(() => {
    if (payment) {
      reset({
        billing_month: payment.billing_month,
        billing_year: payment.billing_year,
        amount_due: payment.amount_due,
        amount_paid: payment.amount_paid,
        payment_date: payment.payment_date,
        payment_method: payment.payment_method,
        status: payment.status,
        transaction_reference: payment.transaction_reference ?? "",
        remarks: payment.remarks ?? "",
      });
    } else {
      reset({
        billing_month: new Date().getMonth() + 1,
        billing_year: new Date().getFullYear(),
        amount_due: defaultAmountDue ?? undefined,
        amount_paid: defaultAmountDue ?? 0,
        payment_date: new Date().toISOString().split("T")[0],
        payment_method: "upi",
        status: "paid",
        transaction_reference: "",
        remarks: "",
      });
    }
  }, [payment, reset, open, defaultAmountDue]);

  function onSubmit(values: PaymentSchema) {
    if (payment) {
      updatePayment.mutate(
        {
          id: payment.id,
          data: values,
        },
        {
          onSuccess() {
            toast.success("Payment record updated");
            onOpenChange(false);
          },
          onError(error: any) {
            toast.error(
              error.response?.data?.detail ??
                "Unable to update payment"
            );
          },
        }
      );
      return;
    }

    createPayment.mutate(values, {
      onSuccess() {
        toast.success("Payment record created");
        reset();
        onOpenChange(false);
      },
      onError(error: any) {
        toast.error(
          error.response?.data?.detail ??
            "Unable to create payment"
        );
      },
    });
  }

  const loading = createPayment.isPending || updatePayment.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {payment ? "Edit Payment Record" : "Add Payment Record"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billing_month">Billing Month</Label>
              <select
                id="billing_month"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!!payment || loading}
                {...register("billing_month")}
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              {errors.billing_month && (
                <p className="text-sm text-red-500">{errors.billing_month.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing_year">Billing Year</Label>
              <Input
                id="billing_year"
                type="number"
                disabled={!!payment || loading}
                {...register("billing_year")}
              />
              {errors.billing_year && (
                <p className="text-sm text-red-500">{errors.billing_year.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount_due">Amount Due (Optional)</Label>
              <Input
                id="amount_due"
                type="number"
                step="0.01"
                placeholder={defaultAmountDue ? `Rent: ₹${defaultAmountDue}` : "0.00"}
                disabled={loading}
                {...register("amount_due")}
              />
              {errors.amount_due && (
                <p className="text-sm text-red-500">{errors.amount_due.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount_paid">Amount Paid</Label>
              <Input
                id="amount_paid"
                type="number"
                step="0.01"
                disabled={loading}
                {...register("amount_paid")}
              />
              {errors.amount_paid && (
                <p className="text-sm text-red-500">{errors.amount_paid.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment_date">Payment Date</Label>
              <Input
                id="payment_date"
                type="date"
                disabled={loading}
                {...register("payment_date")}
              />
              {errors.payment_date && (
                <p className="text-sm text-red-500">{errors.payment_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <select
                id="payment_method"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
                {...register("payment_method")}
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="card">Card</option>
              </select>
              {errors.payment_method && (
                <p className="text-sm text-red-500">{errors.payment_method.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Payment Status</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
                {...register("status")}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction_reference">Transaction Reference</Label>
              <Input
                id="transaction_reference"
                placeholder="UPI Ref / Txn ID"
                disabled={loading}
                {...register("transaction_reference")}
              />
              {errors.transaction_reference && (
                <p className="text-sm text-red-500">{errors.transaction_reference.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Input
              id="remarks"
              placeholder="Any additional notes"
              disabled={loading}
              {...register("remarks")}
            />
            {errors.remarks && (
              <p className="text-sm text-red-500">{errors.remarks.message}</p>
            )}
          </div>

          <Button className="w-full mt-2" type="submit" disabled={loading}>
            {loading ? "Saving..." : payment ? "Update Payment Record" : "Create Payment Record"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
