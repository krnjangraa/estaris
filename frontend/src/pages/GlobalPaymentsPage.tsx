import { useState } from "react";

import { useBuildings } from "@/features/buildings/hooks";
import PaymentTable from "@/features/payments/components/PaymentTable";
import { useGlobalPayments } from "@/features/payments/hooks";
import { useRooms } from "@/features/rooms/hooks";

export default function GlobalPaymentsPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const { data: buildings = [] } = useBuildings();
  const { data: rooms = [] } = useRooms(selectedBuilding);

  const filters = {
    building_id: selectedBuilding || undefined,
    room_id: selectedRoom || undefined,
    status: selectedStatus || undefined,
  };

  const { data: payments = [], isLoading } = useGlobalPayments(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments Directory</h1>
        <p className="text-muted-foreground">
          View and manage all rent payments across your buildings
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-wrap gap-4 items-end">
        <div className="space-y-1.5 flex-grow sm:flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-slate-700">Filter by Building</label>
          <select
            id="building-filter"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={selectedBuilding}
            onChange={(e) => {
              setSelectedBuilding(e.target.value);
              setSelectedRoom("");
            }}
          >
            <option value="">All Buildings</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 flex-grow sm:flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-slate-700">Filter by Room</label>
          <select
            id="room-filter"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            disabled={!selectedBuilding}
          >
            <option value="">All Rooms</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.room_number} ({r.room_type})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 flex-grow sm:flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-slate-700">Filter by Status</label>
          <select
            id="status-filter"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-slate-500">Loading payments...</div>
      ) : (
        <PaymentTable
          leaseId=""
          payments={payments}
          showDetails
        />
      )}
    </div>
  );
}
