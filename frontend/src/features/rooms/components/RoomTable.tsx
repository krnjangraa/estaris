import { useState } from "react";
import { Pencil, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

import type { Room } from "../types";
import { useDeleteRoom } from "../hooks";
import DeleteRoomDialog from "./DeleteRoomDialog";
import RoomForm from "./RoomForm";

interface Props {
  buildingId: string;
  rooms: Room[];
}

export default function RoomTable({
  buildingId,
  rooms,
}: Props) {
  const navigate = useNavigate();

  const [editing, setEditing] =
    useState<Room>();

  const [deleting, setDeleting] =
    useState<Room>();

  const deleteRoom =
    useDeleteRoom(buildingId);

  function handleDelete() {
    if (!deleting) return;

    deleteRoom.mutate(deleting.id, {
      onSuccess() {
        toast.success("Room deleted");
        setDeleting(undefined);
      },

      onError(error: any) {
        toast.error(
          error.response?.data?.detail ??
            "Failed to delete room"
        );
      },
    });
  }

  return (
    <>
      <RoomForm
        buildingId={buildingId}
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(undefined);
          }
        }}
        room={editing}
      />

      <DeleteRoomDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(undefined);
          }
        }}
        onConfirm={handleDelete}
        loading={deleteRoom.isPending}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Room</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-center">
              Capacity
            </TableHead>
            <TableHead className="text-center">
              Occupied
            </TableHead>
            <TableHead className="text-center">
              Available
            </TableHead>
            <TableHead className="text-right">
              Rent
            </TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell className="font-medium">
                {room.room_number}
              </TableCell>

              <TableCell>
                {room.room_type}
              </TableCell>

              <TableCell className="text-center">
                {room.capacity}
              </TableCell>

              <TableCell className="text-center">
                {room.occupied}
              </TableCell>

              <TableCell
                className={`text-center font-medium ${
                  room.available === 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {room.available}
              </TableCell>

              <TableCell className="text-right">
                ₹
                {Number(room.base_rent).toLocaleString(
                  "en-IN"
                )}
              </TableCell>

              <TableCell className="space-x-2 text-right">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setEditing(room)
                  }
                >
                  <Pencil size={16} />
                </Button>

                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() =>
                    navigate(
                      `/rooms/${room.id}/tenants`
                    )
                  }
                >
                  <Users size={16} />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() =>
                    setDeleting(room)
                  }
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {rooms.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-10 text-center text-muted-foreground"
              >
                No rooms found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}