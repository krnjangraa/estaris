import { useState } from "react";
import { Plus } from "lucide-react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useBuilding } from "@/features/buildings/hooks";
import RoomForm from "@/features/rooms/components/RoomForm";
import RoomTable from "@/features/rooms/components/RoomTable";
import { useRooms } from "@/features/rooms/hooks";

export default function RoomsPage() {
  const { buildingId } = useParams();

  const [open, setOpen] = useState(false);

  const id = buildingId ?? "";

  const {
    data: building,
    isLoading: buildingLoading,
  } = useBuilding(id);

  const {
    data: rooms = [],
    isLoading: roomsLoading,
  } = useRooms(id);

  if (buildingLoading || roomsLoading) {
    return (
      <div className="py-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {building?.name}
          </h1>

          <p className="text-muted-foreground">
            Manage rooms for this building.
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>

      <RoomForm
        buildingId={id}
        open={open}
        onOpenChange={setOpen}
      />

      <RoomTable
        buildingId={id}
        rooms={rooms}
      />
    </div>
  );
}