import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRentDueNotifications, markNotified } from "./api";

export const NOTIFICATIONS_QUERY_KEY = ["notifications", "rent-due"] as const;

/** Fetches pending/overdue rent payments. Refetches every 5 minutes. */
export function useRentDueNotifications() {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: getRentDueNotifications,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000,       // treat as fresh for 2 minutes
  });
}

/** Stamps reminder_sent_at on the payment and refreshes the list. */
export function useMarkNotified() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => markNotified(paymentId),
    onSuccess(updatedNotification) {
      // Optimistically update the cached list instead of a full refetch
      queryClient.setQueryData(
        NOTIFICATIONS_QUERY_KEY,
        (old: any) =>
          old?.map((n: any) =>
            n.payment_id === updatedNotification.payment_id
              ? updatedNotification
              : n
          ) ?? []
      );
    },
  });
}
