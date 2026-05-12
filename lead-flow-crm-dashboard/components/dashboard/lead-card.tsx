"use client";

import { Clock, MessageSquare, CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { LeadStatus } from "./status-filter";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  status: Exclude<LeadStatus, "all">;
  latestNote: string;
  timeAgo: string;
  hasFollowUp: boolean;
  followUpDate?: string;
}

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
}

const statusConfig: Record<Exclude<LeadStatus, "all">, { label: string; className: string }> = {
  new: {
    label: "New",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  contacted: {
    label: "Contacted",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  qualified: {
    label: "Qualified",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  proposal: {
    label: "Proposal",
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
  won: {
    label: "Won",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  lost: {
    label: "Lost",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const status = statusConfig[lead.status];

  return (
    <Card 
      className="p-4 hover:shadow-md transition-shadow cursor-pointer border-border/60 rounded-xl"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
              {getInitials(lead.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-foreground truncate">{lead.name}</h3>
              <Badge
                variant="outline"
                className={cn("text-xs font-medium shrink-0", status.className)}
              >
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">{lead.company}</p>
          </div>
        </div>
        {lead.hasFollowUp && (
          <div className="shrink-0">
            <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-md">
              <CalendarClock className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Follow-up</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-3 flex items-start gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground line-clamp-2">{lead.latestNote}</p>
      </div>
      
      <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>{lead.timeAgo}</span>
      </div>
    </Card>
  );
}
