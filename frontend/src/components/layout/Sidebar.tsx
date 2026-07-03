import {
  Building2,
  CreditCard,
  FileText,
  Home,
  Receipt,
  Users,
} from "lucide-react";

import NavItem from "./NavItem";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">
        Estaris
      </h1>

      <nav className="space-y-2">
        <NavItem
          to="/"
          icon={Home}
          label="Dashboard"
        />

        <NavItem
          to="/buildings"
          icon={Building2}
          label="Buildings"
        />

        <NavItem
          to="/rooms"
          icon={Home}
          label="Rooms"
        />

        <NavItem
          to="/tenants"
          icon={Users}
          label="Tenants"
        />

        <NavItem
          to="/leases"
          icon={FileText}
          label="Leases"
        />

        <NavItem
          to="/payments"
          icon={CreditCard}
          label="Payments"
        />

        <NavItem
          to="/reports"
          icon={Receipt}
          label="Reports"
        />
      </nav>
    </aside>
  );
}