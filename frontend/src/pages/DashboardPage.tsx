import { useNavigate } from "react-router-dom";
import {
  Building2,
  Home,
  Users,
  CreditCard,
  FileText,
  ChevronRight,
  Activity,
  ArrowUpRight,
} from "lucide-react";

import { getCurrentAdmin } from "@/features/auth/auth";
import { useDashboardStats } from "@/features/dashboard/hooks";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const admin = getCurrentAdmin();
  const navigate = useNavigate();
  const { data: stats, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
          <p className="text-sm text-slate-500 animate-pulse">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="py-10 text-center text-red-500">
        Failed to load dashboard statistics.
      </div>
    );
  }

  const { occupancy, financials, building_occupancy, recent_activity } = stats;

  function formatRelativeTime(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return dateStr;
    }
  }

  function getActivityColorClass(type: string) {
    switch (type) {
      case "payment":
        return {
          iconClass: "text-emerald-600",
          bgClass: "bg-emerald-50 border-emerald-100",
        };
      case "tenant":
        return {
          iconClass: "text-blue-600",
          bgClass: "bg-blue-50 border-blue-100",
        };
      case "lease":
        return {
          iconClass: "text-violet-600",
          bgClass: "bg-violet-50 border-violet-100",
        };
      default:
        return {
          iconClass: "text-slate-600",
          bgClass: "bg-slate-50 border-slate-100",
        };
    }
  }

  function getActivityIcon(type: string) {
    switch (type) {
      case "payment":
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      case "tenant":
        return <Users className="h-4 w-4 text-blue-600" />;
      case "lease":
        return <FileText className="h-4 w-4 text-violet-600" />;
      default:
        return <Activity className="h-4 w-4 text-slate-600" />;
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {admin?.name || "Demo Owner"} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Here is a quick overview of your PG / Hostel operations today.
          </p>
        </div>
        <div className="bg-white border rounded-lg px-4 py-2 text-sm text-slate-600 shadow-sm flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          System Active: {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => navigate("/buildings")}
          className="group relative bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden border-slate-200"
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-50/55 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <Building2 className="h-6 w-6 text-indigo-600" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-500">Total Buildings</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-slate-900">{stats.total_buildings}</span>
              <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5">Active</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate("/buildings")}
          className="group relative bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden border-slate-200"
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-purple-50/55 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <Home className="h-6 w-6 text-purple-600" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-500">Total Rooms</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-slate-900">{stats.total_rooms}</span>
              <span className="text-xs text-purple-600 bg-purple-50 border border-purple-100 rounded px-1.5 py-0.5">Registered</span>
            </div>
          </div>
        </div>

        <div className="group relative bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border-slate-200">
          <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-50/55 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              {occupancy.occupancy_percentage}%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-500">Occupancy Rate</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-slate-900">{occupancy.occupied_slots}</span>
              <span className="text-sm text-slate-500">/ {occupancy.total_capacity} beds filled</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${occupancy.occupancy_percentage}%` }}
              />
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate("/payments")}
          className="group relative bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden border-slate-200"
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-amber-50/55 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
              <CreditCard className="h-6 w-6 text-amber-600" />
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
              {financials.collection_percentage}%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-500">Collected this Month</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                ₹{financials.total_collected.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-slate-400">
                of ₹{financials.total_expected.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div 
                className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${financials.collection_percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Occupancy by Building</h2>
              <p className="text-sm text-slate-500">Distribution of filled slots and capacities across buildings.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/buildings")} className="text-indigo-600 hover:text-indigo-700 font-semibold gap-1">
              View Buildings <ChevronRight size={16} />
            </Button>
          </div>

          <div className="space-y-6">
            {building_occupancy.length === 0 ? (
              <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-lg border border-dashed">
                No buildings registered. Click "Buildings" in the sidebar to add.
              </div>
            ) : (
              building_occupancy.map((item) => (
                <div key={item.building_id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <strong className="text-slate-800 font-semibold">{item.building_name}</strong>
                    <span className="text-slate-500 font-medium">
                      {item.occupied} / {item.capacity} beds ({item.occupancy_percentage}% occupancy)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden flex border border-slate-200">
                    <div 
                      className="bg-indigo-600 h-full rounded-l transition-all duration-500"
                      style={{ width: `${item.occupancy_percentage}%` }}
                    />
                    {item.vacant > 0 && (
                      <div className="bg-slate-100 h-full flex-1" />
                    )}
                  </div>
                  <div className="flex gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-indigo-600" />
                      Occupied: {item.occupied}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-slate-300" />
                      Vacant: {item.vacant}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6 flex flex-col h-[480px]">
          <div className="border-b pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
              <p className="text-sm text-slate-500">Live operational feed.</p>
            </div>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
            {recent_activity.length === 0 ? (
              <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-lg border border-dashed flex flex-col items-center justify-center h-full">
                No recent activity recorded. Operations will stream here once created.
              </div>
            ) : (
              recent_activity.map((item, idx) => {
                const colors = getActivityColorClass(item.type);
                return (
                  <div key={item.id || idx} className="flex gap-3 relative group">
                    {idx < recent_activity.length - 1 && (
                      <div className="absolute top-8 left-[18px] bottom-[-20px] w-0.5 bg-slate-100" />
                    )}
                    
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center border shrink-0 ${colors.bgClass}`}>
                      {getActivityIcon(item.type)}
                    </div>
                    
                    <div className="space-y-1 mt-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-semibold text-slate-800 leading-none">
                          {item.title}
                        </strong>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {formatRelativeTime(item.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}