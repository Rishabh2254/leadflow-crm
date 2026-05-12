import { z } from "zod";

export const createDiscussionSchema = z.object({
  leadId: z.string().trim().min(1, "leadId is required"),
  note: z.string().trim().min(3, "Note is too short").max(5000, "Note is too long"),
  followUpAt: z
    .preprocess((value) => {
      if (value === undefined || value === null || value === "") {
        return undefined;
      }
      return value;
    }, z.coerce.date())
    .optional(),
});

export type CreateDiscussionInput = z.infer<typeof createDiscussionSchema>;
