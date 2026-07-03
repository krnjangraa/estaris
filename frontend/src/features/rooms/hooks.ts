import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
  getGlobalRooms,
} from "./api";

export function useRooms(buildingId: string) {
  return useQuery({
    queryKey: ["rooms", buildingId],
    queryFn: () => getRooms(buildingId),
    enabled: !!buildingId,
  });
}

export function useCreateRoom(buildingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      createRoom(buildingId, data),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["rooms", buildingId],
      });

      queryClient.invalidateQueries({
        queryKey: ["buildings"],
      });
    },
  });
}

export function useUpdateRoom(buildingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: any) => updateRoom(id, data),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["rooms", buildingId],
      });
    },
  });
}

export function useDeleteRoom(buildingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRoom,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["rooms", buildingId],
      });

      queryClient.invalidateQueries({
        queryKey: ["buildings"],
      });
    },
  });
}