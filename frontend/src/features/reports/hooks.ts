import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getOccupancyReport,
  getFinancialReport,
  getPendingDuesReport,
  downloadOccupancyCSV,
  downloadPaymentsCSV,
  downloadPendingDuesCSV,
} from "./api";

export function useOccupancyReport() {
  return useQuery({
    queryKey: ["reports", "occupancy"],
    queryFn: getOccupancyReport,
  });
}

export function useFinancialReport(year: number) {
  return useQuery({
    queryKey: ["reports", "financials", year],
    queryFn: () => getFinancialReport(year),
    enabled: !!year,
  });
}

export function usePendingDuesReport() {
  return useQuery({
    queryKey: ["reports", "pending-dues"],
    queryFn: getPendingDuesReport,
  });
}

export function useDownloadOccupancy() {
  return useMutation({
    mutationFn: downloadOccupancyCSV,
    onSuccess() {
      toast.success("Occupancy report CSV downloaded");
    },
    onError() {
      toast.error("Failed to download occupancy CSV");
    },
  });
}

export function useDownloadPayments() {
  return useMutation({
    mutationFn: downloadPaymentsCSV,
    onSuccess() {
      toast.success("Payments report CSV downloaded");
    },
    onError() {
      toast.error("Failed to download payments CSV");
    },
  });
}

export function useDownloadPendingDues() {
  return useMutation({
    mutationFn: downloadPendingDuesCSV,
    onSuccess() {
      toast.success("Pending dues report CSV downloaded");
    },
    onError() {
      toast.error("Failed to download pending dues CSV");
    },
  });
}
