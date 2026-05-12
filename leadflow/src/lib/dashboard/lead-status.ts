import { LeadStatus } from "@/generated/prisma/enums";

export type DashboardStatusFilter = "ALL" | LeadStatus;

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
  LeadStatus.PROPOSAL_SENT,
  LeadStatus.NEGOTIATION,
  LeadStatus.WON,
  LeadStatus.LOST,
];

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: "New",
  [LeadStatus.CONTACTED]: "Contacted",
  [LeadStatus.QUALIFIED]: "Qualified",
  [LeadStatus.PROPOSAL_SENT]: "Proposal",
  [LeadStatus.NEGOTIATION]: "Negotiation",
  [LeadStatus.WON]: "Won",
  [LeadStatus.LOST]: "Lost",
};

export const LEAD_STATUS_BADGE_CLASS: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  [LeadStatus.CONTACTED]:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  [LeadStatus.QUALIFIED]:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  [LeadStatus.PROPOSAL_SENT]:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800",
  [LeadStatus.NEGOTIATION]:
    "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
  [LeadStatus.WON]:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800",
  [LeadStatus.LOST]: "bg-muted text-muted-foreground border-border",
};

export const FILTER_TABS: { value: DashboardStatusFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  ...LEAD_STATUS_ORDER.map((value) => ({
    value,
    label: LEAD_STATUS_LABEL[value],
  })),
];
