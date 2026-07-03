import api from "@/api/axios";

import type {
  Building,
  BuildingCreate,
  BuildingUpdate,
} from "./types";

export async function getBuildings() {
  const response =
    await api.get<Building[]>("/buildings");

  return response.data;
}

export async function createBuilding(
  data: BuildingCreate
) {
  const response =
    await api.post<Building>(
      "/buildings",
      data
    );

  return response.data;
}

export async function updateBuilding(
  id: string,
  data: BuildingUpdate
) {
  const response =
    await api.patch<Building>(
      `/buildings/${id}`,
      data
    );

  return response.data;
}

export async function deleteBuilding(
  id: string
) {
  await api.delete(`/buildings/${id}`);
}
export async function getBuilding(
  buildingId: string
) {
  const response = await api.get<Building>(
    `/buildings/${buildingId}`
  );

  return response.data;
}