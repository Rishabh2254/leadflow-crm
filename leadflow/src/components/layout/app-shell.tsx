import type { ReactNode } from "react";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { MobileSidebarToggle } from "@/components/layout/mobile-sidebar-toggle";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh w-full bg-background">
      <DashboardSidebar className="sticky top-0 hidden h-dvh shrink-0 md:flex" />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileSidebarToggle>
          <DashboardSidebar className="h-full border-0" />
        </MobileSidebarToggle>
        <main className="flex min-h-0 flex-1 flex-col overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
