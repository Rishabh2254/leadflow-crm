import type {
  AddDiscussionInput,
  CreateLeadInput,
  DiscussionPayload,
  LeadFilters,
  LeadListItem,
  LeadWriteResponse,
  UpdateLeadInput,
} from "@/types/api";

import { apiRequest } from "@/lib/api/client";

function buildLeadQueryString(filters?: LeadFilters) {
  if (!filters) {
    return "";
  }

  const params = new URLSearchParams();
  if (filters.status) {
    params.set("status", filters.status);
  }
  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function getLeads(filters?: LeadFilters) {
  return apiRequest<LeadListItem[]>(`/api/leads${buildLeadQueryString(filters)}`);
}

export function createLead(input: CreateLeadInput) {
  return apiRequest<LeadWriteResponse>("/api/leads", {
    method: "POST",
    body: input,
  });
}

export function updateLead(id: number, input: UpdateLeadInput) {
  return apiRequest<LeadWriteResponse>(`/api/leads/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function addDiscussion(input: AddDiscussionInput) {
  return apiRequest<{
    discussion: DiscussionPayload;
    lead: Pick<LeadWriteResponse, "id" | "followUpAt" | "updatedAt">;
  }>(
    "/api/discussions",
    {
      method: "POST",
      body: input,
    },
  );
}
