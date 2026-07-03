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
  useCreateLease,
  useUpdateLease,
} from "../hooks";

import {
  leaseSchema,
  type LeaseInput,
  type LeaseSchema,
} from "../schema";

import type { Lease } from "../types";

interface Props {
  tenantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lease?: Lease;
}

export default function LeaseForm({
  tenantId,
  open,
  onOpenChange,
  lease,
}: Props) {
  const createLease = useCreateLease(tenantId);
  const updateLease = useUpdateLease(tenantId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<
    LeaseInput,
    unknown,
    LeaseSchema
  >({
    resolver: zodResolver(leaseSchema),
    defaultValues: {
      start_date: "",
      end_date: "",
      monthly_rent: 0,
      security_deposit: 0,
      payment_due_day: 1,
    },
  });

  useEffect(() => {
    if (lease) {
      reset({
        start_date: lease.start_date,
        end_date: lease.end_date,
        monthly_rent: lease.monthly_rent,
        security_deposit: lease.security_deposit,
        payment_due_day: lease.payment_due_day,
      });
    } else {
      reset({
        start_date: "",
        end_date: "",
        monthly_rent: 0,
        security_deposit: 0,
        payment_due_day: 1,
      });
    }
  }, [lease, reset, open]);

  function onSubmit(values: LeaseSchema) {
    if (lease) {
      updateLease.mutate(
        {
          id: lease.id,
          data: values,
        },
        {
          onSuccess() {
            toast.success("Lease updated");
            onOpenChange(false);
          },
          onError(error: any) {
            toast.error(
              error.response?.data?.detail ??
                "Unable to update lease"
            );
          },
        }
      );

      return;
    }

    createLease.mutate(values, {
      onSuccess() {
        toast.success("Lease created");
        reset();
        onOpenChange(false);
      },
      onError(error: any) {
        toast.error(
          error.response?.data?.detail ??
            "Unable to create lease"
        );
      },
    });
  }

  const loading =
    createLease.isPending ||
    updateLease.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {lease ? "Edit Lease" : "Add Lease"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">
                Start Date
              </Label>

              <Input
                id="start_date"
                type="date"
                {...register("start_date")}
                disabled={!!lease} // Usually start_date should not be modified once created
              />

              {errors.start_date && (
                <p className="text-sm text-red-500">
                  {errors.start_date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">
                End Date
              </Label>

              <Input
                id="end_date"
                type="date"
                {...register("end_date")}
              />

              {errors.end_date && (
                <p className="text-sm text-red-500">
                  {errors.end_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_rent">
                Monthly Rent
              </Label>

              <Input
                id="monthly_rent"
                type="number"
                step="0.01"
                {...register("monthly_rent")}
              />

              {errors.monthly_rent && (
                <p className="text-sm text-red-500">
                  {errors.monthly_rent.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="security_deposit">
                Security Deposit
              </Label>

              <Input
                id="security_deposit"
                type="number"
                step="0.01"
                {...register("security_deposit")}
              />

              {errors.security_deposit && (
                <p className="text-sm text-red-500">
                  {errors.security_deposit.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_due_day">
              Payment Due Day (1-31)
            </Label>

            <Input
              id="payment_due_day"
              type="number"
              min="1"
              max="31"
              {...register("payment_due_day")}
            />

            {errors.payment_due_day && (
              <p className="text-sm text-red-500">
                {errors.payment_due_day.message}
              </p>
            )}
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : lease
              ? "Update Lease"
              : "Create Lease"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
