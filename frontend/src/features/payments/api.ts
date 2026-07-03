import api from "@/api/axios";

import type {
  Payment,
  PaymentCreate,
  PaymentUpdate,
} from "./types";

export async function getPayments(leaseId: string) {
  const response = await api.get<Payment[]>(
    `/leases/${leaseId}/payments`
  );
  return response.data;
}

export async function getGlobalPayments(params?: {
  building_id?: string;
  room_id?: string;
  status?: string;
}) {
  const response = await api.get<Payment[]>("/payments", {
    params,
  });
  return response.data;
}

export async function createPayment(
  leaseId: string,
  data: PaymentCreate
) {
  const response = await api.post<Payment>(
    `/leases/${leaseId}/payments`,
    data
  );
  return response.data;
}

export async function updatePayment(
  paymentId: string,
  data: PaymentUpdate
) {
  const response = await api.patch<Payment>(
    `/payments/${paymentId}`,
    data
  );
  return response.data;
}

export async function deletePayment(paymentId: string) {
  await api.delete(`/payments/${paymentId}`);
}

export async function printReceipt(paymentId: string) {
  const response = await api.get<string>(
    `/payments/${paymentId}/receipt`,
    {
      responseType: "text",
    }
  );

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(response.data);
    printWindow.document.close();
  }
}
