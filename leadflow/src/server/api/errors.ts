import { ZodError } from "zod";

import { fail } from "@/server/api/response";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export function handleRouteError(error: unknown) {
  if (error instanceof ApiError) {
    return fail(error.message, error.status);
  }

  if (error instanceof ZodError) {
    return fail(error.issues[0]?.message ?? "Validation failed", 422);
  }

  console.error("Unhandled API error:", error);
  return fail("Internal server error", 500);
}
