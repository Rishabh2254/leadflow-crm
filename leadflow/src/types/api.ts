import type { LeadStatus } from "@/generated/prisma/enums";

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  message: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type LeadFilters = {
  status?: LeadStatus;
  search?: string;
};

export type LeadListItem = {
  id: number;
  name: string;
  company: string | null;
  phone: string | null;
  status: LeadStatus;
  followUpAt: string | null;
  createdAt: string;
  updatedAt: string;
  latestDiscussion: {
    id: number;
    note: string;
    createdAt: string;
    followUpAt: string | null;
  } | null;
  discussionCount: number;
};

export type LeadWriteResponse = {
  id: number;
  name: string;
  company: string | null;
  phone: string | null;
  status: LeadStatus;
  followUpAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateLeadInput = {
  name: string;
  company?: string | null;
  phone?: string | null;
  followUpAt?: string | null;
};

export type UpdateLeadInput = {
  status?: LeadStatus;
  followUpAt?: string | null;
};

export type AddDiscussionInput = {
  leadId: string;
  note: string;
  followUpAt?: string;
};

export type DiscussionPayload = {
  id: number;
  leadId: number;
  note: string;
  createdAt: string;
  followUpAt: string | null;
};
