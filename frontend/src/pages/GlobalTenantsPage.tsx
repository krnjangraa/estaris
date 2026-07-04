import { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalTenants } from "@/features/tenants/hooks";
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

export default function GlobalTenantsPage() {
  const [search, setSearch] = useState("");
  const { data: tenants = [], isLoading } = useGlobalTenants();

  const filteredTenants = tenants.filter((t) => {
    const term = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(term) ||
      t.contact_number.toLowerCase().includes(term) ||
      t.room_number.toLowerCase().includes(term) ||
      t.building_name.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tenants Directory</h1>
          <p className="text-muted-foreground">
            View all tenants across your buildings
          </p>
        </div>
        <div className="w-full sm:w-72">
          <Input
            type="search"
            placeholder="Search name, phone, room or building..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>


      {isLoading ? (
        <div className="py-10 text-center text-slate-500">
          Loading tenants...
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Move-in Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-slate-500 py-8"
                  >
                    No tenants found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">
                      <Link to={`/tenants/${tenant.id}`} className="text-primary hover:underline">
                        {tenant.name}
                      </Link>
                    </TableCell>

                    <TableCell>{tenant.contact_number}</TableCell>
                    <TableCell>
                      <Link to={`/rooms/${tenant.room_id}`} className="text-primary hover:underline font-semibold">
                        {tenant.room_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link to={`/buildings/${tenant.building_id}/rooms`} className="text-primary hover:underline font-semibold">
                        {tenant.building_name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tenant.status === "active"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          tenant.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{tenant.move_in_date}</TableCell>
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
