import Link from "next/link";

import { siteConfig } from "@/config/site";
import { dashboardNav } from "@/config/dashboard-nav";
import { cn } from "@/lib/utils";

type DashboardSidebarProps = {
  className?: string;
};

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  return (
    <aside
      className={cn(
        "flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link href="/" className="font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {dashboardNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                item.disabled && "pointer-events-none opacity-50",
              )}
            >
              {Icon ? <Icon className="size-4 shrink-0" aria-hidden /> : null}
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
