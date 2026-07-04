export type TenantStatus = "active" | "vacated";

export interface Tenant {
  id: string;
  room_id: string;

  name: string;
  permanent_address: string;

  contact_number: string;

  emergency_contact_name: string;
  emergency_contact_number: string;

  id_proof_type: string;
  id_proof_number: string;

  move_in_date: string;

  status: TenantStatus;
  monthly_rent?: number;

  created_at: string;
  updated_at: string;

}

export interface TenantCreate {
  name: string;
  permanent_address: string;
  contact_number: string;

  emergency_contact_name: string;
  emergency_contact_number: string;

  id_proof_type: string;
  id_proof_number: string;

  move_in_date: string;
}

export interface TenantUpdate {
  name?: string;
  permanent_address?: string;
  contact_number?: string;

  emergency_contact_name?: string;
  emergency_contact_number?: string;

  id_proof_type?: string;
  id_proof_number?: string;

  status?: TenantStatus;
}

export interface GlobalTenant extends Tenant {
  room_number: string;
  building_name: string;
  building_id: string;
}