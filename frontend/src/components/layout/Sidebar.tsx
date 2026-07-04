import { useNavigate } from "react-router-dom";
import {
  Building2,
  CreditCard,
  DoorOpen,
  FileText,
  Home,
  LogOut,
  Receipt,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/auth";
import NavItem from "./NavItem";

interface Props {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: Props) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-100 h-screen p-5 flex flex-col justify-between shadow-xl">
      <div>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
              E
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Estaris
            </span>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>


        <nav className="space-y-1.5">
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
            icon={DoorOpen}
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
      </div>

      <Button
        id="logout-btn"
        variant="ghost"
        className="w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-all duration-200 py-6"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </aside>

  );
}