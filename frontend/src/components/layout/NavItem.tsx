import { NavLink } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

interface Props {
  to: string;
  icon: LucideIcon;
  label: string;
}

export default function NavItem({
  to,
  icon: Icon,
  label,
}: Props) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 font-medium ${
          isActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
            : "text-slate-400 hover:text-white hover:bg-slate-800/60"
        }`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>

  );
}