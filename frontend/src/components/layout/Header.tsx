import { useState } from "react";
import { Bell, Menu } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCurrentAdmin } from "@/features/auth/auth";
import NotificationsPanel from "@/features/notifications/NotificationsPanel";
import { useRentDueNotifications } from "@/features/notifications/hooks";

interface Props {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: Props) {
  const admin = getCurrentAdmin();
  const [panelOpen, setPanelOpen] = useState(false);

  const { data: notifications = [] } = useRentDueNotifications();

  // Count tenants that haven't been reminded yet
  const pendingCount = notifications.filter((n) => !n.reminder_sent_at).length;

  return (
    <>
      <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-slate-700" />
          </Button>
          <h2 className="font-bold text-xl text-slate-800">Dashboard</h2>
        </div>



        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <Button
            id="notification-bell-btn"
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            onClick={() => setPanelOpen(true)}
            aria-label={`${pendingCount} rent reminders pending`}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {pendingCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </Button>

          <div className="text-right">
            <p className="font-medium">{admin?.name}</p>
            <p className="text-sm text-muted-foreground">{admin?.email}</p>
          </div>

          <Avatar>
            <AvatarFallback>
              {admin?.name
                ?.split(" ")
                .map((x) => x[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <NotificationsPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />
    </>
  );
}