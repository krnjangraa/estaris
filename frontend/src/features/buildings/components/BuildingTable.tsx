import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DoorOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Building } from "../types";
import { useDeleteBuilding } from "../hooks";
import BuildingForm from "./BuildingForm";
import DeleteBuildingDialog from "./DeleteBuildingDialog";

interface Props {
  buildings: Building[];
}

export default function BuildingTable({
  buildings,
}: Props) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState<Building>();
  const [deleting, setDeleting] = useState<Building>();

  const deleteBuilding = useDeleteBuilding();

  function handleDelete() {
    if (!deleting) return;

    deleteBuilding.mutate(deleting.id, {
      onSuccess() {
        toast.success("Building deleted");
        setDeleting(undefined);
      },

      onError() {
        toast.error("Failed to delete building");
      },
    });
  }

  return (
    <>
      <BuildingForm
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) setEditing(undefined);
        }}
        building={editing}
      />

      <DeleteBuildingDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(undefined);
        }}
        onConfirm={handleDelete}
        loading={deleteBuilding.isPending}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Rooms</TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {buildings.map((building) => (
            <TableRow key={building.id}>
              <TableCell className="font-medium">
                {building.name}
              </TableCell>

              <TableCell>
                {building.address}
              </TableCell>

              <TableCell>
                {building.total_rooms}
              </TableCell>

              <TableCell className="text-right space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setEditing(building)
                  }
                >
                  <Pencil size={16} />
                </Button>
                <Button
                size="icon"
                variant="secondary"
                onClick={() =>
                    navigate(`/buildings/${building.id}/rooms`)
                }
                >
                <DoorOpen size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() =>
                    setDeleting(building)
                  }
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {buildings.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-10"
              >
                No buildings found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}