import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72),
  name: z.string().trim().min(2).max(80).optional().nullable(),
});

export type SignupInput = z.infer<typeof signupSchema>;

