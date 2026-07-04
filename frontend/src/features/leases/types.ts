export type LeaseStatus = "active" | "completed" | "terminated";

export interface Lease {
  id: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit: number;
  payment_due_day: number;
  status: LeaseStatus;
  created_at: string;
  updated_at: string;
}

export interface LeaseCreate {
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit: number;
  payment_due_day: number;
}

export interface LeaseUpdate {
  end_date?: string;
  monthly_rent?: number;
  security_deposit?: number;
  payment_due_day?: number;
  status?: LeaseStatus;
}

export interface GlobalLease extends Lease {
  tenant_name: string;
  room_number: string;
  building_name: string;
  room_id: string;
  building_id: string;
}

