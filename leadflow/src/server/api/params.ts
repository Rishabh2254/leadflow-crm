import { ApiError } from "@/server/api/errors";

export function parseNumericId(raw: string, label = "id") {
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new ApiError(400, `Invalid ${label}`);
  }
  return value;
}
