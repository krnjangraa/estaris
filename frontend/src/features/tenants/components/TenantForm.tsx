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
  useCreateTenant,
  useUpdateTenant,
} from "../hooks";

import {
  tenantSchema,
  type TenantSchema,
} from "../schema";

import type { Tenant } from "../types";

interface Props {
  roomId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant?: Tenant;
}

export default function TenantForm({
  roomId,
  open,
  onOpenChange,
  tenant,
}: Props) {
  const createTenant = useCreateTenant(roomId);
  const updateTenant = useUpdateTenant(roomId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TenantSchema>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: "",
      permanent_address: "",
      contact_number: "",
      emergency_contact_name: "",
      emergency_contact_number: "",
      id_proof_type: "",
      id_proof_number: "",
      move_in_date: "",
    },
  });

  useEffect(() => {
    if (tenant) {
      reset({
        name: tenant.name,
        permanent_address: tenant.permanent_address,
        contact_number: tenant.contact_number,
        emergency_contact_name:
          tenant.emergency_contact_name,
        emergency_contact_number:
          tenant.emergency_contact_number,
        id_proof_type: tenant.id_proof_type,
        id_proof_number: tenant.id_proof_number,
        move_in_date: tenant.move_in_date,
      });
    } else {
      reset({
        name: "",
        permanent_address: "",
        contact_number: "",
        emergency_contact_name: "",
        emergency_contact_number: "",
        id_proof_type: "",
        id_proof_number: "",
        move_in_date: "",
      });
    }
  }, [tenant, reset]);

  function onSubmit(values: TenantSchema) {
    if (tenant) {
      updateTenant.mutate(
        {
          id: tenant.id,
          data: values,
        },
        {
          onSuccess() {
            toast.success("Tenant updated");
            onOpenChange(false);
          },
          onError() {
            toast.error("Unable to update tenant");
          },
        }
      );

      return;
    }

    createTenant.mutate(values, {
      onSuccess() {
        toast.success("Tenant created");
        reset();
        onOpenChange(false);
      },
      onError(error: any) {
        toast.error(
          error.response?.data?.detail ??
            "Unable to create tenant"
        );
      },
    });
  }

  const loading =
    createTenant.isPending ||
    updateTenant.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {tenant
              ? "Edit Tenant"
              : "Add Tenant"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <Label>Name</Label>

            <Input
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Contact Number</Label>

            <Input
              {...register("contact_number")}
            />

            {errors.contact_number && (
              <p className="text-sm text-red-500">
                {errors.contact_number.message}
              </p>
            )}
          </div>

          <div className="col-span-2 space-y-2">
            <Label>
              Permanent Address
            </Label>

            <Input
              {...register(
                "permanent_address"
              )}
            />

            {errors.permanent_address && (
              <p className="text-sm text-red-500">
                {
                  errors.permanent_address
                    .message
                }
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Emergency Contact Name
            </Label>

            <Input
              {...register(
                "emergency_contact_name"
              )}
            />

            {errors.emergency_contact_name && (
              <p className="text-sm text-red-500">
                {
                  errors
                    .emergency_contact_name
                    .message
                }
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>
              Emergency Contact Number
            </Label>

            <Input
              {...register(
                "emergency_contact_number"
              )}
            />

            {errors.emergency_contact_number && (
              <p className="text-sm text-red-500">
                {
                  errors
                    .emergency_contact_number
                    .message
                }
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>ID Proof Type</Label>

            <Input
              {...register("id_proof_type")}
              placeholder="Aadhaar / PAN / Passport"
            />

            {errors.id_proof_type && (
              <p className="text-sm text-red-500">
                {errors.id_proof_type.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>ID Proof Number</Label>

            <Input
              {...register("id_proof_number")}
            />

            {errors.id_proof_number && (
              <p className="text-sm text-red-500">
                {errors.id_proof_number.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Move In Date</Label>

            <Input
              type="date"
              {...register("move_in_date")}
            />

            {errors.move_in_date && (
              <p className="text-sm text-red-500">
                {errors.move_in_date.message}
              </p>
            )}
          </div>

          <div className="col-span-2">
            <Button
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : tenant
                ? "Update Tenant"
                : "Create Tenant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}