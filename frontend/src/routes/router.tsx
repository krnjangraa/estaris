import {
  createBrowserRouter,
} from "react-router-dom";
import BuildingsPage from "@/pages/BuildingsPage";
import AppLayout from "@/layouts/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import RoomsPage from "@/pages/RoomsPage";
import ProtectedRoute from "./ProtectedRoute";
import TenantsPage from "@/pages/TenantsPage";
import LeasesPage from "@/pages/LeasesPage";
import PaymentsPage from "@/pages/PaymentsPage";
import GlobalPaymentsPage from "@/pages/GlobalPaymentsPage";
import GlobalRoomsPage from "@/pages/GlobalRoomsPage";
import GlobalTenantsPage from "@/pages/GlobalTenantsPage";
import GlobalLeasesPage from "@/pages/GlobalLeasesPage";
import ReportsPage from "@/pages/ReportsPage";
import TenantInfoPage from "@/pages/TenantInfoPage";


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
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
      path: "rooms/:roomId",
      element: <TenantsPage />,
    },

    {
      path: "tenants/:tenantId",
      element: <TenantInfoPage />,
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
      path: "rooms",
      element: <GlobalRoomsPage />,
    },
    {
      path: "tenants",
      element: <GlobalTenantsPage />,
    },
    {
      path: "leases",
      element: <GlobalLeasesPage />,
    },
    {
      path: "reports",
      element: <ReportsPage />,
    },
  ],
  },
]);