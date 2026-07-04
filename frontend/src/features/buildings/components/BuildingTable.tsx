import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
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

      onError(error: any) {
        toast.error(
          error.response?.data?.detail ??
            "Failed to delete building"
        );
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
            <TableHead className="text-right">Occupancy</TableHead>
            <TableHead className="text-right">Rent Roll</TableHead>
            <TableHead className="text-right">Rent Due</TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {buildings.map((building) => (
            <TableRow
              key={building.id}
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => navigate(`/buildings/${building.id}/rooms`)}
            >
              <TableCell className="font-medium">
                {building.name}
              </TableCell>

              <TableCell>
                {building.address}
              </TableCell>

              <TableCell>
                {building.total_rooms}
              </TableCell>

              <TableCell className="text-right font-medium">
                {building.occupancy_rate}%
              </TableCell>

              <TableCell className="text-right font-medium">
                ₹{Number(building.monthly_rent_roll).toLocaleString("en-IN")}
              </TableCell>

              <TableCell className="text-right">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full border ${
                  building.rent_due > 0
                    ? "bg-red-100 text-red-800 border-red-200"
                    : "bg-green-100 text-green-800 border-green-200"
                }`}>
                  ₹{Number(building.rent_due).toLocaleString("en-IN")}
                </span>
              </TableCell>

              <TableCell className="text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="icon"
                  variant="outline"
                  title="Edit Building"
                  onClick={() =>
                    setEditing(building)
                  }
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  title="Delete Building"
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
                colSpan={7}
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