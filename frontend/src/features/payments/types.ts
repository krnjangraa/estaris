export type PaymentMethod = "cash" | "upi" | "bank_transfer" | "card";
export type PaymentStatus = "pending" | "paid" | "overdue";

export interface Payment {
  id: string;
  lease_id: string;
  billing_month: number;
  billing_year: number;
  amount_due: number;
  amount_paid: number;
  payment_date: string;
  due_date?: string;
  payment_method: PaymentMethod;

  status: PaymentStatus;
  transaction_reference?: string;
  receipt_number: string;
  tenant_name: string;
  tenant_id?: string;
  contact_number: string;

  room_number: string;
  building_name: string;
  room_id?: string;
  building_id?: string;

  remarks?: string;
  created_at: string;
  updated_at: string;
}


export interface PaymentCreate {
  billing_month: number;
  billing_year: number;
  amount_due?: number;
  amount_paid: number;
  payment_date: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  transaction_reference?: string;
  remarks?: string;
}

export interface PaymentUpdate {
  amount_due?: number;
  amount_paid?: number;
  payment_date?: string;
  payment_method?: PaymentMethod;
  status?: PaymentStatus;
  transaction_reference?: string;
  remarks?: string;
}
