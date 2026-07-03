import { useState } from "react";
import {
  Download,
  Building2,
  CreditCard,
  AlertCircle,
  Phone,
  Copy,
  Calendar,
} from "lucide-react";

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useOccupancyReport,
  useFinancialReport,
  usePendingDuesReport,
  useDownloadOccupancy,
  useDownloadPayments,
  useDownloadPendingDues,
} from "@/features/reports/hooks";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"occupancy" | "financials" | "dues">("occupancy");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Report Queries
  const { data: occReport, isLoading: loadingOcc } = useOccupancyReport();
  const { data: finReport, isLoading: loadingFin } = useFinancialReport(selectedYear);
  const { data: duesReport, isLoading: loadingDues } = usePendingDuesReport();

  // Export Mutations
  const downloadOcc = useDownloadOccupancy();
  const downloadPay = useDownloadPayments();
  const downloadDues = useDownloadPendingDues();

  const downloading =
    downloadOcc.isPending || downloadPay.isPending || downloadDues.isPending;

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  }

  function getStatusStyle(status: string) {
    if (status === "overdue") {
      return "bg-red-100 text-red-800 border-red-200";
    }
    return "bg-amber-100 text-amber-800 border-amber-200";
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Monitor occupancy rates, track payment compliance, and export data sheets.
        </p>
      </div>

      {/* Tabs Selector Navigation */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit border border-slate-200">
        <button
          onClick={() => setActiveTab("occupancy")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "occupancy"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Building2 size={16} />
          Occupancy
        </button>
        <button
          onClick={() => setActiveTab("financials")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "financials"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <CreditCard size={16} />
          Financial Summary
        </button>
        <button
          onClick={() => setActiveTab("dues")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "dues"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <AlertCircle size={16} />
          Pending Dues
        </button>
      </div>

      {/* TAB 1: Occupancy Report */}
      {activeTab === "occupancy" && (
        <div className="space-y-6">
          {loadingOcc || !occReport ? (
            <div className="py-10 text-center text-slate-500">Loading occupancy metrics...</div>
          ) : (
            <>
              {/* Occupancy Highlights Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <span className="text-slate-500 text-xs block font-medium">Buildings</span>
                    <strong className="text-2xl font-bold mt-1 block">{occReport.total_buildings}</strong>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <span className="text-slate-500 text-xs block font-medium">Total Rooms</span>
                    <strong className="text-2xl font-bold mt-1 block">{occReport.total_rooms}</strong>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <span className="text-slate-500 text-xs block font-medium">Total Capacity</span>
                    <strong className="text-2xl font-bold mt-1 block">{occReport.total_capacity} beds</strong>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <span className="text-slate-500 text-xs block font-medium">Occupied Beds</span>
                    <strong className="text-2xl font-bold mt-1 block text-indigo-600">{occReport.total_occupied}</strong>
                  </CardContent>
                </Card>
                <Card className="col-span-2 md:col-span-1">
                  <CardContent className="p-4 text-center">
                    <span className="text-slate-500 text-xs block font-medium">Occupancy Rate</span>
                    <strong className="text-2xl font-bold mt-1 block text-emerald-600">
                      {occReport.overall_occupancy_percentage}%
                    </strong>
                  </CardContent>
                </Card>
              </div>

              {/* Occupancy Breakdown Table */}
              <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
                  <div>
                    <h2 className="font-bold text-slate-800 text-base">Building-wise Occupancy Breakdown</h2>
                    <p className="text-slate-500 text-xs mt-0.5">Details of room counts and bed allocations.</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => downloadOcc.mutate()}
                    disabled={downloading}
                    className="gap-1.5 shadow-sm"
                  >
                    <Download size={14} />
                    Export Occupancy
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Building Name</TableHead>
                      <TableHead>Rooms Registered</TableHead>
                      <TableHead>Total Capacity</TableHead>
                      <TableHead>Occupied Beds</TableHead>
                      <TableHead>Vacant Beds</TableHead>
                      <TableHead>Occupancy Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {occReport.items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                          No buildings recorded.
                        </TableCell>
                      </TableRow>
                    ) : (
                      occReport.items.map((item) => (
                        <TableRow key={item.building_id}>
                          <TableCell className="font-semibold text-slate-800">{item.building_name}</TableCell>
                          <TableCell>{item.rooms_count}</TableCell>
                          <TableCell>{item.capacity} beds</TableCell>
                          <TableCell className="font-medium text-indigo-600">{item.occupied}</TableCell>
                          <TableCell className="text-slate-500">{item.vacant}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-700 min-w-10 text-right">
                                {item.occupancy_percentage}%
                              </span>
                              <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden border">
                                <div 
                                  className="bg-indigo-600 h-full rounded" 
                                  style={{ width: `${item.occupancy_percentage}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: Financial Summary */}
      {activeTab === "financials" && (
        <div className="space-y-6">
          {/* Year selector filter */}
          <div className="flex items-center gap-2.5 bg-white border p-3 rounded-lg w-fit shadow-sm">
            <Calendar size={16} className="text-slate-400" />
            <label className="text-sm font-semibold text-slate-600">Select Financial Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border rounded px-3 py-1.5 bg-white text-sm font-medium focus:outline-indigo-600"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
              <option value={2027}>2027</option>
            </select>
          </div>

          {loadingFin || !finReport ? (
            <div className="py-10 text-center text-slate-500">Loading financial summaries...</div>
          ) : (
            <>
              {/* Financial Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <span className="text-slate-500 text-xs block font-medium">Expected Billing</span>
                    <strong className="text-2xl font-bold mt-1 block">
                      ₹{finReport.total_expected.toLocaleString("en-IN")}
                    </strong>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <span className="text-slate-500 text-xs block font-medium">Collected Collections</span>
                    <strong className="text-2xl font-bold mt-1 block text-emerald-600">
                      ₹{finReport.total_collected.toLocaleString("en-IN")}
                    </strong>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <span className="text-slate-500 text-xs block font-medium">Pending Dues</span>
                    <strong className="text-2xl font-bold mt-1 block text-amber-600">
                      ₹{finReport.total_pending.toLocaleString("en-IN")}
                    </strong>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <span className="text-slate-500 text-xs block font-medium">Overall Collection Rate</span>
                    <strong className="text-2xl font-bold mt-1 block text-indigo-600">
                      {finReport.overall_collection_percentage}%
                    </strong>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly financial breakdown */}
              <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
                  <div>
                    <h2 className="font-bold text-slate-800 text-base">Monthly Billing Performance ({selectedYear})</h2>
                    <p className="text-slate-500 text-xs mt-0.5">Summary ofexpected vs collected payments.</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => downloadPay.mutate()}
                    disabled={downloading}
                    className="gap-1.5 shadow-sm"
                  >
                    <Download size={14} />
                    Export Collections
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Billing Month</TableHead>
                      <TableHead>Expected Amount</TableHead>
                      <TableHead>Collected Amount</TableHead>
                      <TableHead>Pending Dues</TableHead>
                      <TableHead>Collection Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {finReport.items.map((item) => (
                      <TableRow key={item.month}>
                        <TableCell className="font-semibold text-slate-800">{item.month_name}</TableCell>
                        <TableCell>₹{item.expected.toLocaleString("en-IN")}</TableCell>
                        <TableCell className="font-medium text-emerald-600">
                          ₹{item.collected.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className={item.pending > 0 ? "font-medium text-amber-600" : "text-slate-400"}>
                          {item.pending > 0 ? `₹${item.pending.toLocaleString("en-IN")}` : "₹0"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-700 min-w-10 text-right">
                              {item.collection_percentage}%
                            </span>
                            <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden border">
                              <div 
                                className="bg-emerald-500 h-full rounded" 
                                style={{ width: `${item.collection_percentage}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 3: Pending Dues */}
      {activeTab === "dues" && (
        <div className="space-y-6">
          {loadingDues || !duesReport ? (
            <div className="py-10 text-center text-slate-500">Loading pending accounts list...</div>
          ) : (
            <>
              {/* Dues Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <Card className="border-red-200 bg-red-50/20">
                  <CardContent className="p-4 text-center">
                    <span className="text-slate-500 text-xs block font-medium">Pending Dues Accounts</span>
                    <strong className="text-2xl font-bold mt-1 block text-red-600">
                      {duesReport.total_pending_accounts} accounts
                    </strong>
                  </CardContent>
                </Card>
                <Card className="border-amber-200 bg-amber-50/20">
                  <CardContent className="p-4 text-center">
                    <span className="text-slate-500 text-xs block font-medium font-semibold">Total Overdue Amount</span>
                    <strong className="text-2xl font-bold mt-1 block text-amber-600">
                      ₹{duesReport.total_pending_amount.toLocaleString("en-IN")}
                    </strong>
                  </CardContent>
                </Card>
              </div>

              {/* Dues lists */}
              <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
                  <div>
                    <h2 className="font-bold text-slate-800 text-base">Overdue Rent Accounts</h2>
                    <p className="text-slate-500 text-xs mt-0.5">List of active tenants with unresolved billing periods.</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => downloadDues.mutate()}
                    disabled={downloading}
                    className="gap-1.5 shadow-sm"
                  >
                    <Download size={14} />
                    Export Pending Dues
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant Details</TableHead>
                      <TableHead>Building / Room</TableHead>
                      <TableHead>Billing Cycle</TableHead>
                      <TableHead>Expected / Paid</TableHead>
                      <TableHead>Balance Pending</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Contact / Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {duesReport.items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                          Great job! No pending dues recorded.
                        </TableCell>
                      </TableRow>
                    ) : (
                      duesReport.items.map((item) => (
                        <TableRow key={item.payment_id}>
                          <TableCell>
                            <strong className="block text-slate-800 text-sm font-semibold">{item.tenant_name}</strong>
                            <span className="text-xs text-slate-500 font-mono">{item.tenant_phone}</span>
                          </TableCell>
                          <TableCell>
                            <span className="block text-xs font-medium text-slate-600">{item.building_name}</span>
                            <span className="text-[11px] text-slate-500 font-mono">Room: {item.room_number}</span>
                          </TableCell>
                          <TableCell className="font-medium text-slate-800 text-xs">
                            {MONTH_NAMES[item.month]} {item.year}
                          </TableCell>
                          <TableCell className="text-xs text-slate-600">
                            <div>Expected: ₹{item.amount_due.toLocaleString("en-IN")}</div>
                            <div>Paid: ₹{item.amount_paid.toLocaleString("en-IN")}</div>
                          </TableCell>
                          <TableCell className="font-bold text-red-600 text-sm">
                            ₹{item.amount_pending.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold border rounded-full uppercase ${getStatusStyle(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5">
                              {/* Call Emergency */}
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                                title={`Copy Phone Number (${item.tenant_phone})`}
                                onClick={() => copyToClipboard(item.tenant_phone, "Tenant phone")}
                              >
                                <Phone size={14} />
                              </Button>

                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                title={`Copy Emergency: ${item.emergency_contact} (${item.emergency_phone})`}
                                onClick={() => copyToClipboard(item.emergency_phone, "Emergency Contact phone")}
                              >
                                <Copy size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
