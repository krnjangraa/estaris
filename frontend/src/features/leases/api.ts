import api from "@/api/axios";

import type {
  Lease,
  LeaseCreate,
  LeaseUpdate,
} from "./types";

export async function getLeases(
  tenantId: string
) {
  const response = await api.get<Lease[]>(
    `/tenants/${tenantId}/leases`
  );

  return response.data;
}

export async function createLease(
  tenantId: string,
  data: LeaseCreate
) {
  const response = await api.post<Lease>(
    `/tenants/${tenantId}/leases`,
    data
  );

  return response.data;
}

export async function updateLease(
  leaseId: string,
  data: LeaseUpdate
) {
  const response = await api.patch<Lease>(
    `/leases/${leaseId}`,
    data
  );

  return response.data;
}

export async function deleteLease(
  leaseId: string
) {
  await api.delete(`/leases/${leaseId}`);
}

export async function getLease(
  leaseId: string
) {
  const response = await api.get<Lease>(
    `/leases/${leaseId}`
  );
  return response.data;
}
