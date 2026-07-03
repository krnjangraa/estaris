import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import BuildingForm from "@/features/buildings/components/BuildingForm";
import BuildingTable from "@/features/buildings/components/BuildingTable";
import { useBuildings } from "@/features/buildings/hooks";

export default function BuildingsPage() {
  const [open, setOpen] = useState(false);

  const {
    data: buildings = [],
    isLoading,
  } = useBuildings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Buildings
          </h1>

          <p className="text-muted-foreground">
            Manage all your buildings.
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />

          Add Building
        </Button>
      </div>

      <BuildingForm
        open={open}
        onOpenChange={setOpen}
      />

      {isLoading ? (
        <div className="text-center py-10">
          Loading...
        </div>
      ) : (
        <BuildingTable
          buildings={buildings}
        />
      )}
    </div>
  );
}