import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";


import {
  createBuilding,
  deleteBuilding,
  getBuilding,
  getBuildings,
  updateBuilding,
} from "./api";

export function useBuildings() {
  return useQuery({
    queryKey: ["buildings"],
    queryFn: getBuildings,
  });
}

export function useCreateBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBuilding,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["buildings"],
      });
    },
  });
}

export function useUpdateBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        address?: string;
      };
    }) => updateBuilding(id, data),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["buildings"],
      });
    },
  });
}

export function useDeleteBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBuilding,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["buildings"],
      });
    },
  });
}
export function useBuilding(
  buildingId: string
) {
  return useQuery({
    queryKey: ["building", buildingId],
    queryFn: () => getBuilding(buildingId),
    enabled: !!buildingId,
  });
}