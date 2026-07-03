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
        `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
}