import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export const TZ = "Asia/Manila";

/** Parse a YYYY-MM-DD date as midnight in Manila. */
export function manilaDate(iso: string): Date {
  return fromZonedTime(`${iso.slice(0, 10)}T00:00:00`, TZ);
}

export function fmt(iso: string, pattern = "d MMM yyyy"): string {
  return formatInTimeZone(manilaDate(iso), TZ, pattern);
}

export function fmtRange(start: string, end?: string | null): string {
  if (!end || end === start) return fmt(start, "EEE, d MMM yyyy");
  const sameMonth = start.slice(0, 7) === end.slice(0, 7);
  return sameMonth
    ? `${fmt(start, "d")}–${fmt(end, "d MMM yyyy")}`
    : `${fmt(start, "d MMM")} – ${fmt(end, "d MMM yyyy")}`;
}

export function daysUntil(iso: string, now = new Date()): number {
  return Math.ceil((manilaDate(iso).getTime() - now.getTime()) / 86_400_000);
}

/** Today's date in Manila as YYYY-MM-DD. */
export function todayManila(now = new Date()): string {
  return formatInTimeZone(now, TZ, "yyyy-MM-dd");
}
