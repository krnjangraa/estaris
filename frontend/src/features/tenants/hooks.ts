import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTenant,
  deleteTenant,
  getTenant,
  getTenants,
  updateTenant,
  getGlobalTenants,
} from "./api";

export function useTenants(roomId: string) {
  return useQuery({
    queryKey: ["tenants", roomId],
    queryFn: () => getTenants(roomId),
    enabled: !!roomId,
  });
}

export function useTenant(tenantId: string) {
  return useQuery({
    queryKey: ["tenant", tenantId],
    queryFn: () => getTenant(tenantId),
    enabled: !!tenantId,
  });
}

export function useCreateTenant(
  roomId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      createTenant(roomId, data),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["tenants", roomId],
      });

      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
    },
  });
}

export function useUpdateTenant(
  roomId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: any) => updateTenant(id, data),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["tenants", roomId],
      });

      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
    },
  });
}

export function useDeleteTenant(
  roomId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTenant,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["tenants", roomId],
      });

      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
    },
  });
}

export function useGlobalTenants() {
  return useQuery({
    queryKey: ["tenants", "global"],
    queryFn: getGlobalTenants,
  });
}