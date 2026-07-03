import {
  createBrowserRouter,
} from "react-router-dom";
import BuildingsPage from "@/pages/BuildingsPage";
import AppLayout from "@/layouts/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import RoomsPage from "@/pages/RoomsPage";
import ProtectedRoute from "./ProtectedRoute";
import TenantsPage from "@/pages/TenantsPage";
import LeasesPage from "@/pages/LeasesPage";
import PaymentsPage from "@/pages/PaymentsPage";
import GlobalPaymentsPage from "@/pages/GlobalPaymentsPage";
import ReportsPage from "@/pages/ReportsPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),

  children: [
    {
      index: true,
      element: <DashboardPage />,
    },
    {
      path: "buildings",
      element: <BuildingsPage />,
    },
    {
      path: "buildings/:buildingId/rooms",
      element: <RoomsPage />,
    },
    {
      path: "rooms/:roomId/tenants",
      element: <TenantsPage />,
    },
    {
      path: "tenants/:tenantId/leases",
      element: <LeasesPage />,
    },
    {
      path: "leases/:leaseId/payments",
      element: <PaymentsPage />,
    },
    {
      path: "payments",
      element: <GlobalPaymentsPage />,
    },
    {
      path: "reports",
      element: <ReportsPage />,
    },
  ],
  },
]);