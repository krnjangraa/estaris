import api from "@/api/axios";

import type {
  Tenant,
  TenantCreate,
  TenantUpdate,
} from "./types";

export async function getTenants(
  roomId: string
) {
  const response = await api.get<Tenant[]>(
    `/rooms/${roomId}/tenants`
  );

  return response.data;
}

export async function createTenant(
  roomId: string,
  data: TenantCreate
) {
  const response = await api.post<Tenant>(
    `/rooms/${roomId}/tenants`,
    data
  );

  return response.data;
}

export async function updateTenant(
  tenantId: string,
  data: TenantUpdate
) {
  const response = await api.patch<Tenant>(
    `/tenants/${tenantId}`,
    data
  );

  return response.data;
}

export async function deleteTenant(
  tenantId: string
) {
  await api.delete(`/tenants/${tenantId}`);
}