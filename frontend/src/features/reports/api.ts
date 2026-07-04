import api from "@/api/axios";

export interface BuildingOccupancyReportItem {
  building_id: string;
  building_name: string;
  rooms_count: number;
  capacity: number;
  occupied: number;
  vacant: number;
  occupancy_percentage: number;
}

export interface OccupancyReport {
  total_buildings: number;
  total_rooms: number;
  total_capacity: number;
  total_occupied: number;
  total_vacant: number;
  overall_occupancy_percentage: number;
  items: BuildingOccupancyReportItem[];
}

export interface MonthlyFinancialReportItem {
  month: number;
  month_name: string;
  expected: number;
  collected: number;
  pending: number;
  collection_percentage: number;
}

export interface FinancialReport {
  year: number;
  total_expected: number;
  total_collected: number;
  total_pending: number;
  overall_collection_percentage: number;
  items: MonthlyFinancialReportItem[];
}

export interface PendingDueReportItem {
  payment_id: string;
  lease_id: string;
  tenant_id: string;
  room_id: string;
  building_id: string;
  tenant_name: string;
  tenant_phone: string;
  emergency_contact: string;
  emergency_phone: string;

  building_name: string;
  room_number: string;
  month: number;
  year: number;
  amount_due: number;
  amount_paid: number;
  amount_pending: number;
  status: string;
}

export interface PendingDuesReport {
  total_pending_accounts: number;
  total_pending_amount: number;
  items: PendingDueReportItem[];
}

export async function getOccupancyReport(): Promise<OccupancyReport> {
  const { data } = await api.get<OccupancyReport>("/reports/occupancy");
  return data;
}

export async function getFinancialReport(year: number): Promise<FinancialReport> {
  const { data } = await api.get<FinancialReport>("/reports/financials", {
    params: { year },
  });
  return data;
}

export async function getPendingDuesReport(): Promise<PendingDuesReport> {
  const { data } = await api.get<PendingDuesReport>("/reports/pending-dues");
  return data;
}

async function triggerCSVDownload(endpoint: string, filename: string) {
  const { data } = await api.get(endpoint, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadOccupancyCSV() {
  await triggerCSVDownload("/reports/export/occupancy", "occupancy_report.csv");
}

export async function downloadPaymentsCSV() {
  await triggerCSVDownload("/reports/export/payments", "payments_report.csv");
}

export async function downloadPendingDuesCSV() {
  await triggerCSVDownload("/reports/export/pending-dues", "pending_dues_report.csv");
}
