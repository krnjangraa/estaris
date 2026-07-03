import { useState } from "react";
import { Bell } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCurrentAdmin } from "@/features/auth/auth";
import NotificationsPanel from "@/features/notifications/NotificationsPanel";
import { useRentDueNotifications } from "@/features/notifications/hooks";

export default function Header() {
  const admin = getCurrentAdmin();
  const [panelOpen, setPanelOpen] = useState(false);

  const { data: notifications = [] } = useRentDueNotifications();

  // Count tenants that haven't been reminded yet
  const pendingCount = notifications.filter((n) => !n.reminder_sent_at).length;

  return (
    <>
      <header className="h-16 border-b bg-white flex items-center justify-between px-6">
        <h2 className="font-semibold text-xl">Dashboard</h2>

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