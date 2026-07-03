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
  useCreateRoom,
  useUpdateRoom,
} from "../hooks";

import {
  roomSchema,
  type RoomInput,
  type RoomSchema,
} from "../schema";

import type { Room } from "../types";

interface Props {
  buildingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: Room;
}

export default function RoomForm({
  buildingId,
  open,
  onOpenChange,
  room,
}: Props) {
  const createRoom = useCreateRoom(buildingId);
  const updateRoom = useUpdateRoom(buildingId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<
    RoomInput,
    unknown,
    RoomSchema
  >({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      room_number: "",
      room_type: "",
      capacity: 1,
      base_rent: 0,
    },
  });

  useEffect(() => {
    if (room) {
      reset({
        room_number: room.room_number,
        room_type: room.room_type,
        capacity: room.capacity,
        base_rent: room.base_rent,
      });
    } else {
      reset({
        room_number: "",
        room_type: "",
        capacity: 1,
        base_rent: 0,
      });
    }
  }, [room, reset]);

  function onSubmit(values: RoomSchema) {
    if (room) {
      updateRoom.mutate(
        {
          id: room.id,
          data: values,
        },
        {
          onSuccess() {
            toast.success("Room updated");
            onOpenChange(false);
          },
          onError() {
            toast.error("Unable to update room");
          },
        }
      );

      return;
    }

    createRoom.mutate(values, {
      onSuccess() {
        toast.success("Room created");
        reset();
        onOpenChange(false);
      },
      onError() {
        toast.error("Unable to create room");
      },
    });
  }

  const loading =
    createRoom.isPending ||
    updateRoom.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {room ? "Edit Room" : "Add Room"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="room_number">
              Room Number
            </Label>

            <Input
              id="room_number"
              {...register("room_number")}
            />

            {errors.room_number && (
              <p className="text-sm text-red-500">
                {errors.room_number.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="room_type">
              Room Type
            </Label>

            <Input
              id="room_type"
              {...register("room_type")}
            />

            {errors.room_type && (
              <p className="text-sm text-red-500">
                {errors.room_type.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">
              Capacity
            </Label>

            <Input
              id="capacity"
              type="number"
              {...register("capacity")}
            />

            {errors.capacity && (
              <p className="text-sm text-red-500">
                {errors.capacity.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="base_rent">
              Monthly Rent
            </Label>

            <Input
              id="base_rent"
              type="number"
              step="0.01"
              {...register("base_rent")}
            />

            {errors.base_rent && (
              <p className="text-sm text-red-500">
                {errors.base_rent.message}
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
              : room
              ? "Update Room"
              : "Create Room"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}