"use client";

import { cn } from "@/lib/utils";
import type { DashboardStatusFilter } from "@/lib/dashboard/lead-status";
import { FILTER_TABS } from "@/lib/dashboard/lead-status";

type StatusFilterProps = {
  activeStatus: DashboardStatusFilter;
  onStatusChange: (status: DashboardStatusFilter) => void;
  counts: Record<DashboardStatusFilter, number>;
};

export function StatusFilter({ activeStatus, onStatusChange, counts }: StatusFilterProps) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-lg bg-muted/50 p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onStatusChange(tab.value)}
          className={cn(
            "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
            activeStatus === tab.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
          <span
            className={cn(
              "ml-1.5 text-xs text-muted-foreground",
              activeStatus === tab.value && "opacity-90",
            )}
          >
            {counts[tab.value]}
          </span>
        </button>
      ))}
    </div>
  );
}
