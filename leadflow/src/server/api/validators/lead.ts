import { LeadStatus } from "@/generated/prisma/enums";
import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .optional()
  .nullable()
  .transform((value) => (value ? value : null));

const optionalDateInput = z
  .preprocess((value) => {
    if (value === undefined || value === null) {
      return null;
    }
    return value;
  }, z.coerce.date().nullable())
  .optional();

export const listLeadsQuerySchema = z.object({
  status: z.nativeEnum(LeadStatus).optional(),
  search: z.string().trim().min(1).max(120).optional(),
});

export const createLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: optionalString,
  phone: z
    .string()
    .trim()
    .min(6)
    .max(24)
    .optional()
    .nullable()
    .transform((value) => (value ? value : null)),
  followUpAt: optionalDateInput,
});

export const updateLeadSchema = z
  .object({
    status: z.nativeEnum(LeadStatus).optional(),
    followUpAt: optionalDateInput,
  })
  .refine((value) => value.status !== undefined || value.followUpAt !== undefined, {
    message: "Provide at least one field to update",
  });
