"use client";

import { useEffect, useState, type ComponentType } from "react";
import { Building2, CalendarClock, MessageSquare, Phone, Send, UserPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LeadStatus } from "@/generated/prisma/enums";
import { format } from "date-fns";
import { formatFollowUpSummary, getInitials } from "@/lib/dashboard/lead-format";
import { LEAD_STATUS_BADGE_CLASS, LEAD_STATUS_LABEL, LEAD_STATUS_ORDER } from "@/lib/dashboard/lead-status";
import { useAddDiscussionMutation, useUpdateLeadMutation } from "@/lib/query/hooks";
import { cn } from "@/lib/utils";
import type { LeadListItem } from "@/types/api";

type LeadDetailModalProps = {
  lead: LeadListItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LeadDetailModal({ lead, open, onOpenChange }: LeadDetailModalProps) {
  const updateLead = useUpdateLeadMutation();
  const addDiscussion = useAddDiscussionMutation();
  const [note, setNote] = useState("");
  const [followUpLocal, setFollowUpLocal] = useState("");

  useEffect(() => {
    if (open && lead?.followUpAt) {
      const d = new Date(lead.followUpAt);
      setFollowUpLocal(format(d, "yyyy-MM-dd'T'HH:mm"));
    } else if (!open) {
      setNote("");
      setFollowUpLocal("");
    }
  }, [open, lead?.followUpAt, lead?.id]);

  const statusClass = LEAD_STATUS_BADGE_CLASS[lead.status];
  const followLabel = formatFollowUpSummary(lead.followUpAt);

  const handleStatusChange = (value: string) => {
    updateLead.mutate({
      id: lead.id,
      input: { status: value as LeadStatus },
    });
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    addDiscussion.mutate(
      {
        leadId: String(lead.id),
        note: note.trim(),
        followUpAt: followUpLocal ? new Date(followUpLocal).toISOString() : undefined,
      },
      {
        onSuccess: () => {
          setNote("");
        },
      },
    );
  };

  const createdLabel = format(new Date(lead.createdAt), "MMM d, yyyy · h:mm a");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-6 pt-6 pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 shrink-0" size="lg">
              <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                {getInitials(lead.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <DialogTitle className="text-xl font-semibold">{lead.name}</DialogTitle>
                <Badge variant="outline" className={cn("text-xs font-medium", statusClass)}>
                  {LEAD_STATUS_LABEL[lead.status]}
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {lead.company ?? "—"}
                </span>
                {lead.phone ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    {lead.phone}
                  </span>
                ) : null}
                {followLabel ? (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="h-4 w-4" />
                    {followLabel}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-foreground">Status</span>
            <Select value={lead.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEAD_STATUS_ORDER.map((s) => (
                  <SelectItem key={s} value={s}>
                    {LEAD_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {updateLead.isError ? (
              <span className="text-xs text-destructive">Could not update status.</span>
            ) : null}
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Activity</h3>
            <div className="relative space-y-0">
              <div className="absolute top-6 bottom-6 left-4 w-px bg-border" />
              <TimelineRow
                icon={UserPlus}
                accent="emerald"
                title="Lead created"
                meta={createdLabel}
                body="Added to LeadFlow."
              />
              {lead.latestDiscussion ? (
                <TimelineRow
                  icon={MessageSquare}
                  accent="blue"
                  title="Latest discussion"
                  meta={format(new Date(lead.latestDiscussion.createdAt), "MMM d, yyyy · h:mm a")}
                  body={lead.latestDiscussion.note}
                />
              ) : null}
            </div>
            {lead.discussionCount > 1 ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Showing latest discussion only ({lead.discussionCount} total). Full history can be
                exposed via a dedicated discussions API when you add it.
              </p>
            ) : null}
          </div>
        </div>

        <div className="border-t border-border px-6 py-4">
          <p className="mb-2 text-sm font-medium text-foreground">Log discussion</p>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What happened on the call or email thread?"
            className="min-h-[88px] resize-none"
          />
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1">
              <label htmlFor="discussion-followup" className="text-xs text-muted-foreground">
                Next follow-up (optional)
              </label>
              <input
                id="discussion-followup"
                type="datetime-local"
                value={followUpLocal}
                onChange={(e) => setFollowUpLocal(e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
              />
            </div>
            <Button
              type="button"
              className="gap-2 sm:shrink-0"
              onClick={handleAddNote}
              disabled={!note.trim() || addDiscussion.isPending}
            >
              <Send className="h-4 w-4" />
              {addDiscussion.isPending ? "Saving…" : "Add note"}
            </Button>
          </div>
          {addDiscussion.isError ? (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {addDiscussion.error instanceof Error
                ? addDiscussion.error.message
                : "Could not add discussion."}
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

type TimelineRowProps = {
  icon: ComponentType<{ className?: string }>;
  accent: "emerald" | "blue" | "amber" | "primary";
  title: string;
  meta: string;
  body: string;
};

function TimelineRow({ icon: Icon, accent, title, meta, body }: TimelineRowProps) {
  const ring =
    accent === "emerald"
      ? "border-emerald-300 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
      : accent === "blue"
        ? "border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400"
        : accent === "amber"
          ? "border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
          : "border-primary bg-primary/5 text-primary";

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      <div
        className={cn(
          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background",
          ring,
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium text-foreground">{title}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{meta}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
