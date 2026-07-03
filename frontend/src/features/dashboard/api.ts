import api from "@/api/axios";

export interface OccupancyStats {
  total_capacity: number;
  occupied_slots: number;
  vacant_slots: number;
  occupancy_percentage: number;
}

export interface FinancialStats {
  total_expected: number;
  total_collected: number;
  total_pending: number;
  collection_percentage: number;
}

export interface BuildingOccupancyItem {
  building_id: string;
  building_name: string;
  capacity: number;
  occupied: number;
  vacant: number;
  occupancy_percentage: number;
}

export interface RecentActivityItem {
  id: string;
  type: "payment" | "tenant" | "lease";
  title: string;
  description: string;
  timestamp: string;
}

export interface DashboardStats {
  total_buildings: number;
  total_rooms: number;
  occupancy: OccupancyStats;
  financials: FinancialStats;
  building_occupancy: BuildingOccupancyItem[];
  recent_activity: RecentActivityItem[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>("/dashboard/stats");
  return data;
}
