import { format, formatDistanceToNow, type Locale } from "date-fns";

export function formatDate(
  date: Date | number | string,
  pattern: string,
  options?: { locale?: Locale },
) {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, pattern, options);
}

export function formatRelative(date: Date | number | string, options?: { addSuffix?: boolean }) {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, ...options });
}
