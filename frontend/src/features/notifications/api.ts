import api from "@/api/axios";
import type { RentDueNotification } from "./types";

export async function getRentDueNotifications(): Promise<RentDueNotification[]> {
  const response = await api.get<RentDueNotification[]>("/notifications/rent-due");
  return response.data;
}

export async function markNotified(paymentId: string): Promise<RentDueNotification> {
  const response = await api.post<RentDueNotification>(
    `/notifications/mark-notified/${paymentId}`
  );
  return response.data;
}
