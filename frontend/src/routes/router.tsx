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
  ],
  },
]);