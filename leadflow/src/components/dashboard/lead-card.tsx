"use client";

import { CalendarClock, Check, ChevronDown, Clock, MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LeadStatus } from "@/generated/prisma/enums";
import {
  formatFollowUpSummary,
  getInitials,
  isFollowUpDueSoon,
  leadActivityRelative,
} from "@/lib/dashboard/lead-format";
import {
  LEAD_STATUS_BADGE_CLASS,
  LEAD_STATUS_LABEL,
  LEAD_STATUS_ORDER,
} from "@/lib/dashboard/lead-status";
import { useUpdateLeadMutation } from "@/lib/query/hooks";
import { cn } from "@/lib/utils";
import type { LeadListItem } from "@/types/api";

type LeadCardProps = {
  lead: LeadListItem;
  onClick?: () => void;
};

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const updateLead = useUpdateLeadMutation();
  const statusClass = LEAD_STATUS_BADGE_CLASS[lead.status];
  const statusLabel = LEAD_STATUS_LABEL[lead.status];
  const notePreview = lead.latestDiscussion?.note ?? "No discussion logged yet.";
  const showFollowUp = isFollowUpDueSoon(lead);
  const followLabel = formatFollowUpSummary(lead.followUpAt);

  return (
    <Card
      className="cursor-pointer rounded-xl border-border/60 p-4 transition-shadow hover:shadow-md"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-muted text-sm font-medium text-muted-foreground">
              {getInitials(lead.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-medium text-foreground">{lead.name}</h3>
              <Badge variant="outline" className={cn("shrink-0 text-xs font-medium", statusClass)}>
                {statusLabel}
              </Badge>
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {lead.company ?? "—"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {showFollowUp ? (
            <div className="hidden sm:block">
              <div className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-primary">
                <CalendarClock className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Follow-up</span>
              </div>
            </div>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
                onClick={(e) => e.stopPropagation()}
                aria-label="Change status"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-44"
              onClick={(e) => e.stopPropagation()}
            >
              {LEAD_STATUS_ORDER.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={lead.status === status}
                  onCheckedChange={() =>
                    updateLead.mutate({
                      id: lead.id,
                      input: { status: status as LeadStatus },
                    })
                  }
                >
                  <span className="flex flex-1 items-center gap-2">
                    <span className="truncate">{LEAD_STATUS_LABEL[status]}</span>
                  </span>
                  {lead.status === status ? <Check className="ml-auto h-4 w-4" /> : null}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2">
        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="line-clamp-2 text-sm text-muted-foreground">{notePreview}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {leadActivityRelative(lead)}
        </span>
        {followLabel ? <span className="text-muted-foreground/90">{followLabel}</span> : null}
      </div>
    </Card>
  );
}
