"use client";

import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatFollowUpSummary, isFollowUpDueSoon } from "@/lib/dashboard/lead-format";
import type { LeadListItem } from "@/types/api";

type FollowUpsSectionProps = {
  leads: LeadListItem[];
  onSelectLead: (lead: LeadListItem) => void;
};

export function FollowUpsSection({ leads, onSelectLead }: FollowUpsSectionProps) {
  const upcoming = leads
    .filter((lead) => lead.followUpAt && isFollowUpDueSoon(lead))
    .sort((a, b) => {
      const ta = new Date(a.followUpAt!).getTime();
      const tb = new Date(b.followUpAt!).getTime();
      return ta - tb;
    })
    .slice(0, 5);

  if (upcoming.length === 0) {
    return (
      <Card className="rounded-xl border-border/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Follow-ups</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          No overdue or same-day follow-ups. You&apos;re clear.
        </p>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border-border/60 p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Follow-ups</h2>
          <Badge variant="secondary" className="text-xs">
            {upcoming.length}
          </Badge>
        </div>
      </div>
      <div className="space-y-3">
        {upcoming.map((lead) => (
          <button
            key={lead.id}
            type="button"
            onClick={() => onSelectLead(lead)}
            className="flex w-full items-center justify-between gap-3 rounded-lg bg-muted/50 p-3 text-left transition-colors hover:bg-muted"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{lead.name}</p>
              <p className="truncate text-xs text-muted-foreground">{lead.company ?? "—"}</p>
            </div>
            <div className="shrink-0 text-xs text-muted-foreground">
              {formatFollowUpSummary(lead.followUpAt)}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
