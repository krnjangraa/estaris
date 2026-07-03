import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { getCurrentAdmin } from "@/features/auth/auth";

export default function Header() {
  const admin = getCurrentAdmin();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <h2 className="font-semibold text-xl">
        Dashboard
      </h2>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-medium">
            {admin?.name}
          </p>

          <p className="text-sm text-muted-foreground">
            {admin?.email}
          </p>
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
  );
}