"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { LeadStatus } from "@/generated/prisma/enums";

import {
  addDiscussion as addDiscussionRequest,
  createLead as createLeadRequest,
  getLeads,
  updateLead as updateLeadRequest,
} from "@/lib/api/leads";
import { queryKeys } from "@/lib/query/keys";
import type {
  AddDiscussionInput,
  CreateLeadInput,
  LeadFilters,
  LeadListItem,
  LeadWriteResponse,
  UpdateLeadInput,
} from "@/types/api";

type LeadsCacheEntry = [QueryKey, LeadListItem[] | undefined];
type OptimisticContext = { snapshots: LeadsCacheEntry[] };

function toLeadListItem(lead: LeadWriteResponse): LeadListItem {
  return {
    ...lead,
    latestDiscussion: null,
    discussionCount: 0,
  };
}

function applyLeadPatch(list: LeadListItem[] | undefined, updated: LeadWriteResponse) {
  if (!list) {
    return list;
  }

  return list.map((item) =>
    item.id === updated.id
      ? {
          ...item,
          ...updated,
        }
      : item,
  );
}

function snapshotLeadQueries(queryClient: QueryClient): LeadsCacheEntry[] {
  return queryClient.getQueriesData<LeadListItem[]>({
    queryKey: queryKeys.leads.all,
  });
}

function restoreLeadQueries(queryClient: QueryClient, snapshots: LeadsCacheEntry[]) {
  for (const [key, data] of snapshots) {
    queryClient.setQueryData(key, data);
  }
}

export function useLeads(filters?: LeadFilters) {
  return useQuery({
    queryKey: queryKeys.leads.list(filters),
    queryFn: () => getLeads(filters),
  });
}

export function useCreateLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLeadInput) => createLeadRequest(input),
    onMutate: async (input): Promise<OptimisticContext> => {
      await queryClient.cancelQueries({ queryKey: queryKeys.leads.all });
      const snapshots = snapshotLeadQueries(queryClient);

      const optimisticLead: LeadListItem = {
        id: -Date.now(),
        name: input.name.trim(),
        company: input.company ?? null,
        phone: input.phone ?? null,
        status: LeadStatus.NEW,
        followUpAt: input.followUpAt ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        latestDiscussion: null,
        discussionCount: 0,
      };

      queryClient.setQueriesData<LeadListItem[]>({ queryKey: queryKeys.leads.all }, (current) => [
        optimisticLead,
        ...(current ?? []),
      ]);

      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      if (context) {
        restoreLeadQueries(queryClient, context.snapshots);
      }
    },
    onSuccess: (createdLead) => {
      queryClient.setQueriesData<LeadListItem[]>({ queryKey: queryKeys.leads.all }, (current) => {
        if (!current) {
          return [toLeadListItem(createdLead)];
        }
        const withoutOptimistic = current.filter((lead) => lead.id > 0);
        return [toLeadListItem(createdLead), ...withoutOptimistic];
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
    },
  });
}

export function useUpdateLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateLeadInput }) => updateLeadRequest(id, input),
    onMutate: async ({ id, input }): Promise<OptimisticContext> => {
      await queryClient.cancelQueries({ queryKey: queryKeys.leads.all });
      const snapshots = snapshotLeadQueries(queryClient);

      queryClient.setQueriesData<LeadListItem[]>({ queryKey: queryKeys.leads.all }, (current) =>
        current?.map((lead) =>
          lead.id === id
            ? {
                ...lead,
                status: input.status ?? lead.status,
                followUpAt: input.followUpAt ?? lead.followUpAt,
                updatedAt: new Date().toISOString(),
              }
            : lead,
        ),
      );

      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      if (context) {
        restoreLeadQueries(queryClient, context.snapshots);
      }
    },
    onSuccess: (updatedLead) => {
      queryClient.setQueriesData<LeadListItem[]>({ queryKey: queryKeys.leads.all }, (current) =>
        applyLeadPatch(current, updatedLead),
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
    },
  });
}

export function useAddDiscussionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddDiscussionInput) => addDiscussionRequest(input),
    onMutate: async (input): Promise<OptimisticContext> => {
      await queryClient.cancelQueries({ queryKey: queryKeys.leads.all });
      const snapshots = snapshotLeadQueries(queryClient);

      const optimisticCreatedAt = new Date().toISOString();

      queryClient.setQueriesData<LeadListItem[]>({ queryKey: queryKeys.leads.all }, (current) =>
        current?.map((lead) =>
          lead.id === Number(input.leadId)
            ? {
                ...lead,
                followUpAt: input.followUpAt ?? null,
                discussionCount: lead.discussionCount + 1,
                latestDiscussion: {
                  id: -Date.now(),
                  note: input.note,
                  createdAt: optimisticCreatedAt,
                  followUpAt: input.followUpAt ?? null,
                },
                updatedAt: optimisticCreatedAt,
              }
            : lead,
        ),
      );

      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      if (context) {
        restoreLeadQueries(queryClient, context.snapshots);
      }
    },
    onSuccess: (result, input) => {
      queryClient.setQueriesData<LeadListItem[]>({ queryKey: queryKeys.leads.all }, (current) =>
        current?.map((lead) =>
          lead.id === Number(input.leadId)
            ? {
                ...lead,
                followUpAt: result.lead.followUpAt,
                updatedAt: result.lead.updatedAt,
                latestDiscussion: {
                  id: result.discussion.id,
                  note: result.discussion.note,
                  createdAt: result.discussion.createdAt,
                  followUpAt: result.discussion.followUpAt,
                },
                discussionCount:
                  lead.latestDiscussion?.id && lead.latestDiscussion.id < 0
                    ? lead.discussionCount
                    : lead.discussionCount + 1,
              }
            : lead,
        ),
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
    },
  });
}
