"use client";

import { cn } from "@/lib/utils";

export type LeadStatus = "all" | "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";

interface StatusFilterProps {
  activeStatus: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
  counts: Record<LeadStatus, number>;
}

const statuses: { value: LeadStatus; label: string }[] = [
  { value: "all", label: "All Leads" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export function StatusFilter({ activeStatus, onStatusChange, counts }: StatusFilterProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg overflow-x-auto">
      {statuses.map((status) => (
        <button
          key={status.value}
          onClick={() => onStatusChange(status.value)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap",
            activeStatus === status.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {status.label}
          <span className={cn(
            "ml-1.5 text-xs",
            activeStatus === status.value ? "text-muted-foreground" : "text-muted-foreground/70"
          )}>
            {counts[status.value]}
          </span>
        </button>
      ))}
    </div>
  );
}
