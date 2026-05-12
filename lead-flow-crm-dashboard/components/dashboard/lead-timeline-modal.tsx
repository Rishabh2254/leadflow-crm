"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Mail,
  Phone,
  Building2,
  MessageSquare,
  CalendarClock,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  FileText,
} from "lucide-react";
import type { Lead } from "./lead-card";
import type { LeadStatus } from "./status-filter";

interface TimelineEvent {
  id: string;
  type: "note" | "status_change" | "follow_up" | "created";
  content: string;
  timestamp: string;
  user?: string;
  fromStatus?: string;
  toStatus?: string;
}

interface LeadTimelineModalProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateLead: (leadId: string, updates: Partial<Lead>) => void;
  onAddNote: (leadId: string, note: string) => void;
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

function getEventIcon(type: TimelineEvent["type"]) {
  switch (type) {
    case "note":
      return MessageSquare;
    case "status_change":
      return CheckCircle2;
    case "follow_up":
      return CalendarClock;
    case "created":
      return UserPlus;
    default:
      return FileText;
  }
}

// Generate mock timeline based on lead data
function generateTimeline(lead: Lead): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: "1",
      type: "created",
      content: `Lead created from ${lead.status === "new" ? "website inquiry" : "referral"}`,
      timestamp: "1 week ago",
      user: "System",
    },
  ];

  if (lead.status !== "new") {
    events.push({
      id: "2",
      type: "status_change",
      content: "Status updated",
      timestamp: "5 days ago",
      user: "Alex Johnson",
      fromStatus: "new",
      toStatus: "contacted",
    });
  }

  if (["qualified", "proposal", "won", "lost"].includes(lead.status)) {
    events.push({
      id: "3",
      type: "note",
      content: "Initial discovery call completed. Good fit for our enterprise solution.",
      timestamp: "4 days ago",
      user: "Alex Johnson",
    });
    events.push({
      id: "4",
      type: "status_change",
      content: "Status updated",
      timestamp: "3 days ago",
      user: "Alex Johnson",
      fromStatus: "contacted",
      toStatus: "qualified",
    });
  }

  if (["proposal", "won", "lost"].includes(lead.status)) {
    events.push({
      id: "5",
      type: "follow_up",
      content: "Scheduled follow-up call to discuss proposal details",
      timestamp: "2 days ago",
      user: "Alex Johnson",
    });
    events.push({
      id: "6",
      type: "status_change",
      content: "Status updated",
      timestamp: "1 day ago",
      user: "Alex Johnson",
      fromStatus: "qualified",
      toStatus: "proposal",
    });
  }

  events.push({
    id: "latest",
    type: "note",
    content: lead.latestNote,
    timestamp: lead.timeAgo,
    user: "Alex Johnson",
  });

  return events.reverse();
}

export function LeadTimelineModal({
  lead,
  open,
  onOpenChange,
  onUpdateLead,
  onAddNote,
}: LeadTimelineModalProps) {
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!lead) return null;

  const status = statusConfig[lead.status];
  const timeline = generateTimeline(lead);

  const handleStatusChange = (newStatus: string) => {
    onUpdateLead(lead.id, { status: newStatus as Exclude<LeadStatus, "all"> });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setIsSubmitting(true);
    onAddNote(lead.id, newNote);
    setNewNote("");
    setTimeout(() => setIsSubmitting(false), 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {getInitials(lead.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <DialogTitle className="text-xl font-semibold">
                  {lead.name}
                </DialogTitle>
                <Badge
                  variant="outline"
                  className={cn("text-xs font-medium", status.className)}
                >
                  {status.label}
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  <span>{lead.company}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Status Change */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">Status:</span>
            <Select value={lead.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Activity Timeline
            </h3>
            <div className="relative space-y-0">
              {/* Timeline line */}
              <div className="absolute left-4 top-6 bottom-6 w-px bg-border" />
              
              {timeline.map((event, index) => {
                const Icon = getEventIcon(event.type);
                return (
                  <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                    <div
                      className={cn(
                        "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background",
                        event.type === "status_change" && "border-primary bg-primary/5",
                        event.type === "note" && "border-blue-300 bg-blue-50",
                        event.type === "follow_up" && "border-amber-300 bg-amber-50",
                        event.type === "created" && "border-emerald-300 bg-emerald-50"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          event.type === "status_change" && "text-primary",
                          event.type === "note" && "text-blue-600",
                          event.type === "follow_up" && "text-amber-600",
                          event.type === "created" && "text-emerald-600"
                        )}
                      />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-foreground">
                          {event.user}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          {event.timestamp}
                        </span>
                      </div>
                      {event.type === "status_change" ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Changed status from{" "}
                          <span className="font-medium text-foreground">
                            {statusConfig[event.fromStatus as Exclude<LeadStatus, "all">]?.label}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium text-foreground">
                            {statusConfig[event.toStatus as Exclude<LeadStatus, "all">]?.label}
                          </span>
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {event.content}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Add Note */}
        <div className="pt-4 border-t border-border">
          <div className="flex gap-3">
            <Textarea
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
          <div className="flex justify-end mt-3">
            <Button
              onClick={handleAddNote}
              disabled={!newNote.trim() || isSubmitting}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Add Note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
