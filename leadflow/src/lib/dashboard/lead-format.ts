import {
  endOfDay,
  format,
  formatDistanceToNow,
  isBefore,
  isSameDay,
  startOfDay,
} from "date-fns";

import type { DashboardStatusFilter } from "@/lib/dashboard/lead-status";
import type { LeadListItem } from "@/types/api";

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function leadActivityRelative(lead: LeadListItem) {
  const anchor = lead.latestDiscussion?.createdAt ?? lead.updatedAt;
  return formatDistanceToNow(new Date(anchor), { addSuffix: true });
}

export function formatFollowUpSummary(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  const startToday = startOfDay(new Date());
  if (isBefore(d, startToday)) {
    return `Overdue · ${format(d, "MMM d, h:mm a")}`;
  }
  if (isSameDay(d, new Date())) {
    return `Today, ${format(d, "h:mm a")}`;
  }
  return format(d, "MMM d, h:mm a");
}

export function isFollowUpDueSoon(lead: LeadListItem) {
  if (!lead.followUpAt) return false;
  const d = new Date(lead.followUpAt);
  const now = new Date();
  return isBefore(d, endOfDay(now)) || isSameDay(d, now);
}

export function isFollowUpOverdue(lead: LeadListItem) {
  if (!lead.followUpAt) return false;
  return isBefore(new Date(lead.followUpAt), startOfDay(new Date()));
}

export function filterLeads(
  leads: LeadListItem[],
  filter: { status: DashboardStatusFilter; search: string },
) {
  let list = leads;
  if (filter.status !== "ALL") {
    list = list.filter((l) => l.status === filter.status);
  }
  const q = filter.search.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        (l.company?.toLowerCase().includes(q) ?? false),
    );
  }
  return list;
}
