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
  useCreateBuilding,
  useUpdateBuilding,
} from "../hooks";
import {
  buildingSchema,
  type BuildingSchema,
} from "../schema";
import type { Building } from "../types";

interface BuildingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  building?: Building;
}

export default function BuildingForm({
  open,
  onOpenChange,
  building,
}: BuildingFormProps) {
  const createBuilding = useCreateBuilding();
  const updateBuilding = useUpdateBuilding();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BuildingSchema>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  useEffect(() => {
    if (building) {
      reset({
        name: building.name,
        address: building.address,
      });
    } else {
      reset({
        name: "",
        address: "",
      });
    }
  }, [building, reset]);

  function onSubmit(values: BuildingSchema) {
    if (building) {
      updateBuilding.mutate(
        {
          id: building.id,
          data: values,
        },
        {
          onSuccess() {
            toast.success("Building updated");
            onOpenChange(false);
          },
          onError() {
            toast.error("Failed to update building");
          },
        }
      );

      return;
    }

    createBuilding.mutate(values, {
      onSuccess() {
        toast.success("Building created");
        reset();
        onOpenChange(false);
      },
      onError() {
        toast.error("Failed to create building");
      },
    });
  }

  const loading =
    createBuilding.isPending ||
    updateBuilding.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {building ? "Edit Building" : "Add Building"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="name">
              Building Name
            </Label>

            <Input
              id="name"
              placeholder="Sunrise PG"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              Address
            </Label>

            <Input
              id="address"
              placeholder="Sector 62, Noida"
              {...register("address")}
            />

            {errors.address && (
              <p className="text-sm text-red-500">
                {errors.address.message}
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
              : building
              ? "Update Building"
              : "Create Building"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}