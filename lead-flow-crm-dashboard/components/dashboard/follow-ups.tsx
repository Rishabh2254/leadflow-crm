"use client";

import { CalendarDays, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Lead } from "./lead-card";

interface FollowUpsProps {
  leads: Lead[];
}

export function FollowUps({ leads }: FollowUpsProps) {
  const followUpLeads = leads.filter((lead) => lead.hasFollowUp).slice(0, 4);

  if (followUpLeads.length === 0) {
    return (
      <Card className="p-6 rounded-xl border-border/60">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Today&apos;s Follow-ups</h2>
        </div>
        <p className="text-sm text-muted-foreground">No follow-ups scheduled for today.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 rounded-xl border-border/60">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Today&apos;s Follow-ups</h2>
          <Badge variant="secondary" className="text-xs">
            {followUpLeads.length}
          </Badge>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium">
          View all
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3">
        {followUpLeads.map((lead) => (
          <div
            key={lead.id}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{lead.name}</p>
              <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
            </div>
            <div className="text-xs text-muted-foreground shrink-0">
              {lead.followUpDate || "Today"}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
