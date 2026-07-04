import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createLease,
  deleteLease,
  getLease,
  getLeases,
  updateLease,
  getGlobalLeases,
} from "./api";

export function useLeases(tenantId: string) {
  return useQuery({
    queryKey: ["leases", tenantId],
    queryFn: () => getLeases(tenantId),
    enabled: !!tenantId,
  });
}

export function useCreateLease(
  tenantId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      createLease(tenantId, data),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["leases", tenantId],
      });
      // Invalidate tenants because active lease changes their status/availability if required
      queryClient.invalidateQueries({
        queryKey: ["tenants"],
      });
    },
  });
}

export function useUpdateLease(
  tenantId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: any) => updateLease(id, data),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["leases", tenantId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tenants"],
      });
    },
  });
}

export function useDeleteLease(
  tenantId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLease,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["leases", tenantId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tenants"],
      });
    },
  });
}

export function useLease(leaseId: string) {
  return useQuery({
    queryKey: ["lease", leaseId],
    queryFn: () => getLease(leaseId),
    enabled: !!leaseId,
  });
}

export function useGlobalLeases() {
  return useQuery({
    queryKey: ["leases", "global"],
    queryFn: getGlobalLeases,
  });
}

