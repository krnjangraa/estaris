import { useNavigate } from "react-router-dom";
import { useGlobalRooms } from "@/features/rooms/hooks";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function GlobalRoomsPage() {
  const navigate = useNavigate();
  const { data: rooms = [], isLoading } = useGlobalRooms();


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rooms Directory</h1>
        <p className="text-muted-foreground">
          View all rooms across your buildings
        </p>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-slate-500">
          Loading rooms...
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Number</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Occupied</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Base Rent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-slate-500 py-8"
                  >
                    No rooms found
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room) => (
                  <TableRow
                    key={room.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => navigate(`/rooms/${room.id}`)}
                  >
                    <TableCell className="font-medium">
                      {room.room_number}
                    </TableCell>
                    <TableCell
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/buildings/${room.building_id}/rooms`);
                      }}
                      className="hover:underline text-primary cursor-pointer font-medium"
                    >
                      {room.building_name}
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">
                        {room.room_type}
                      </Badge>
                    </TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>{room.occupied}</TableCell>
                    <TableCell>{room.available}</TableCell>
                    <TableCell>
                      ₹{room.base_rent.toLocaleString("en-IN")}
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
