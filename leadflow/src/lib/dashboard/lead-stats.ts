import { LeadStatus } from "@/generated/prisma/enums";
import type { LeadListItem } from "@/types/api";

import { isFollowUpOverdue, isFollowUpDueSoon } from "@/lib/dashboard/lead-format";
import type { DashboardStatusFilter } from "@/lib/dashboard/lead-status";

const ACTIVE_PIPELINE = new Set<LeadStatus>([
  LeadStatus.QUALIFIED,
  LeadStatus.PROPOSAL_SENT,
  LeadStatus.NEGOTIATION,
]);

export function countByStatus(leads: LeadListItem[]) {
  const counts: Record<DashboardStatusFilter, number> = {
    ALL: leads.length,
    [LeadStatus.NEW]: 0,
    [LeadStatus.CONTACTED]: 0,
    [LeadStatus.QUALIFIED]: 0,
    [LeadStatus.PROPOSAL_SENT]: 0,
    [LeadStatus.NEGOTIATION]: 0,
    [LeadStatus.WON]: 0,
    [LeadStatus.LOST]: 0,
  };
  for (const lead of leads) {
    counts[lead.status]++;
  }
  return counts;
}

export function computeDashboardStats(leads: LeadListItem[]) {
  const won = leads.filter((l) => l.status === LeadStatus.WON).length;
  const pipeline = leads.filter((l) => ACTIVE_PIPELINE.has(l.status)).length;
  const negotiation = leads.filter((l) => l.status === LeadStatus.NEGOTIATION).length;
  const dueSoon = leads.filter((l) => l.followUpAt && isFollowUpDueSoon(l));
  const overdue = dueSoon.filter((l) => isFollowUpOverdue(l));

  return {
    total: leads.length,
    won,
    pipeline,
    negotiation,
    followUpsDue: dueSoon.length,
    overdueCount: overdue.length,
  };
}
