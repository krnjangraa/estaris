import api from "@/api/axios";

import type {
  Room,
  RoomCreate,
  RoomUpdate,
  GlobalRoom,
} from "./types";

export async function getRooms(buildingId: string) {
  const response = await api.get<Room[]>(
    `/buildings/${buildingId}/rooms`
  );

  return response.data;
}

export async function createRoom(
  buildingId: string,
  data: RoomCreate
) {
  const response = await api.post<Room>(
    `/buildings/${buildingId}/rooms`,
    data
  );

  return response.data;
}

export async function updateRoom(
  roomId: string,
  data: RoomUpdate
) {
  const response = await api.patch<Room>(
    `/rooms/${roomId}`,
    data
  );

  return response.data;
}

export async function deleteRoom(roomId: string) {
  await api.delete(`/rooms/${roomId}`);
}

export async function getGlobalRooms() {
  const response = await api.get<GlobalRoom[]>("/rooms");
  return response.data;
}