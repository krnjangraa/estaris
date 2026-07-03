import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPayment,
  deletePayment,
  getGlobalPayments,
  getPayments,
  updatePayment,
} from "./api";

export function usePayments(leaseId: string) {
  return useQuery({
    queryKey: ["payments", leaseId],
    queryFn: () => getPayments(leaseId),
    enabled: !!leaseId,
  });
}

export function useGlobalPayments(filters?: {
  building_id?: string;
  room_id?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["payments", "global", filters],
    queryFn: () => getGlobalPayments(filters),
  });
}

export function useCreatePayment(leaseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createPayment(leaseId, data),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["payments", leaseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["payments", "global"],
      });
    },
  });
}

export function useUpdatePayment(leaseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => updatePayment(id, data),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["payments", leaseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["payments", "global"],
      });
      // Invalidate lease to reflect any status changes after payment update
      queryClient.invalidateQueries({
        queryKey: ["lease", leaseId],
      });
    },
  });
}

export function useDeletePayment(leaseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePayment,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["payments", leaseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["payments", "global"],
      });
    },
  });
}
