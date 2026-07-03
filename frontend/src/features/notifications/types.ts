export interface RentDueNotification {
  payment_id: string;
  tenant_name: string;
  contact_number: string;
  room_number: string;
  building_name: string;
  amount_due: number;
  billing_month: number;
  billing_year: number;
  payment_due_day: number;
  days_overdue: number; // positive = overdue, 0 = due today, negative = upcoming
  status: "pending" | "overdue";
  reminder_sent_at: string | null;
}
