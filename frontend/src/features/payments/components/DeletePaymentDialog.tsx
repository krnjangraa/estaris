import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useDeletePayment } from "../hooks";
import type { Payment } from "../types";

interface Props {
  leaseId: string;
  payment?: Payment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeletePaymentDialog({
  leaseId,
  payment,
  open,
  onOpenChange,
}: Props) {
  const deletePayment = useDeletePayment(leaseId);

  function handleConfirm() {
    if (!payment) return;

    deletePayment.mutate(payment.id, {
      onSuccess() {
        toast.success("Payment deleted successfully");
        onOpenChange(false);
      },
      onError(error: any) {
        toast.error(
          error.response?.data?.detail ??
            "Unable to delete payment"
        );
      },
    });
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Payment Record?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete the payment record for{" "}
            <strong>
              {payment
                ? `${payment.billing_month.toString().padStart(2, "0")}/${
                    payment.billing_year
                  }`
                : ""}
            </strong>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleConfirm}
            disabled={deletePayment.isPending}
          >
            {deletePayment.isPending
              ? "Deleting..."
              : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
