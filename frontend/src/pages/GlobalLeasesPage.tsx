import { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalLeases } from "@/features/leases/hooks";
import { Input } from "@/components/ui/input";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  terminated: "bg-red-100 text-red-800",
};

export default function GlobalLeasesPage() {
  const [search, setSearch] = useState("");
  const { data: leases = [], isLoading } = useGlobalLeases();

  const filteredLeases = leases.filter((l) => {
    const term = search.toLowerCase();
    return (
      l.tenant_name.toLowerCase().includes(term) ||
      l.room_number.toLowerCase().includes(term) ||
      l.building_name.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leases Directory</h1>
          <p className="text-muted-foreground">
            View all leases across your buildings
          </p>
        </div>
        <div className="w-full sm:w-72">
          <Input
            type="search"
            placeholder="Search tenant, room or building..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>


      {isLoading ? (
        <div className="py-10 text-center text-slate-500">
          Loading leases...
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Monthly Rent</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeases.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-slate-500 py-8"
                  >
                    No leases found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeases.map((lease) => (
                  <TableRow key={lease.id}>
                    <TableCell className="font-medium">
                      <Link to={`/tenants/${lease.tenant_id}`} className="text-primary hover:underline">
                        {lease.tenant_name}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <Link to={`/rooms/${lease.room_id}`} className="text-primary hover:underline font-semibold">
                        {lease.room_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link to={`/buildings/${lease.building_id}/rooms`} className="text-primary hover:underline font-semibold">
                        {lease.building_name}
                      </Link>
                    </TableCell>

                    <TableCell>{lease.start_date}</TableCell>
                    <TableCell>{lease.end_date}</TableCell>
                    <TableCell>
                      ₹{lease.monthly_rent.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          statusStyles[lease.status] ?? ""
                        }
                      >
                        {lease.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
