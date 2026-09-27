import { addDays, format } from "date-fns";

/** Build an all-day iCalendar event. `end` is inclusive (YYYY-MM-DD). */
export function buildIcs({
  uid,
  title,
  start,
  end,
  location,
  description,
  url,
}: {
  uid: string;
  title: string;
  start: string;
  end?: string | null;
  location: string;
  description: string;
  url: string;
}): string {
  const d = (iso: string) => iso.slice(0, 10).replace(/-/g, "");
  // DTEND is exclusive for all-day events.
  const endExclusive = format(addDays(new Date(`${(end ?? start).slice(0, 10)}T12:00:00`), 1), "yyyyMMdd");
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Viaje Daraga//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}@viajedaraga`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${d(start)}`,
    `DTEND;VALUE=DATE:${endExclusive}`,
    `SUMMARY:${esc(title)}`,
    `LOCATION:${esc(location)}`,
    `DESCRIPTION:${esc(description)}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
