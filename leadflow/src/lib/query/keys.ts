import type { LeadFilters } from "@/types/api";

export const queryKeys = {
  leads: {
    all: ["leads"] as const,
    list: (filters?: LeadFilters) => [...queryKeys.leads.all, "list", filters ?? {}] as const,
  },
} as const;
