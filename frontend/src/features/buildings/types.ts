export interface Building {
  id: string;
  admin_id: string;

  name: string;
  address: string;

  total_rooms: number;
  occupancy_rate: number;
  monthly_rent_roll: number;
  rent_due: number;


  created_at: string;
  updated_at: string;

}

export interface BuildingCreate {
  name: string;
  address: string;
}

export interface BuildingUpdate {
  name?: string;
  address?: string;
}