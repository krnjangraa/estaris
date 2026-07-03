export interface Room {
  id: string;
  building_id: string;

  room_number: string;
  room_type: string;

  capacity: number;
  base_rent: number;

  occupied: number;
  available: number;

  created_at: string;
  updated_at: string;
}

export interface RoomCreate {
  room_number: string;
  room_type: string;
  capacity: number;
  base_rent: number;
}

export interface RoomUpdate {
  room_number?: string;
  room_type?: string;
  capacity?: number;
  base_rent?: number;
}

export interface GlobalRoom extends Room {
  building_name: string;
}