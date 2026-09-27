"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { todayManila } from "@/lib/dates";
import { cn } from "@/lib/utils";

type CalEvent = { slug: string; name: string; start: string; end: string };

const tones = ["bg-ember text-white", "bg-sili text-white", "bg-rice text-white", "bg-basalt text-paper"];

/** Month grid of dated events. Days are compared as Manila calendar dates (YYYY-MM-DD strings). */
export function MonthCalendar({ events, initialMonth }: { events: CalEvent[]; initialMonth: string }) {
  const [month, setMonth] = useState(() => new Date(`${initialMonth}-01T12:00:00`));
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    const t = todayManila();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- today is only known on the client
    setToday(t);
    setMonth(new Date(`${t.slice(0, 7)}-01T12:00:00`));
  }, []);

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(month), { weekStartsOn: 0 }),
        end: endOfWeek(endOfMonth(month), { weekStartsOn: 0 }),
      }),
    [month],
  );

  const colour = (slug: string) => tones[events.findIndex((e) => e.slug === slug) % tones.length];
  const on = (iso: string) => events.filter((e) => e.start <= iso && iso <= e.end);
  const inMonth = events.filter((e) => {
    const m = format(month, "yyyy-MM");
    return e.start.slice(0, 7) <= m && m <= e.end.slice(0, 7);
  });

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="display text-3xl" aria-live="polite">{format(month, "MMMM yyyy")}</h2>
        <div className="flex gap-1">
          <button type="button" className="grid size-9 place-items-center rounded-full border border-line hover:bg-abaca-soft" onClick={() => setMonth((m) => addMonths(m, -1))} aria-label="Previous month">
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <button type="button" className="grid size-9 place-items-center rounded-full border border-line hover:bg-abaca-soft" onClick={() => setMonth((m) => addMonths(m, 1))} aria-label="Next month">
            <ChevronRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-line text-center text-xs font-medium text-ash-ink" aria-hidden>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7" role="grid" aria-label={`Events in ${format(month, "MMMM yyyy")}`}>
        {days.map((day) => {
          const iso = format(day, "yyyy-MM-dd");
          const evs = on(iso);
          const outside = !isSameMonth(day, month);
          return (
            <div
              key={iso}
              role="gridcell"
              aria-label={`${format(day, "EEEE d MMMM")}${evs.length ? `: ${evs.map((e) => e.name).join(", ")}` : ""}`}
              className={cn("min-h-16 border-r border-b border-line p-1.5 text-xs md:min-h-24", outside && "bg-paper/60 text-ash")}
            >
              <span className={cn("inline-grid size-6 place-items-center rounded-full", iso === today && "bg-ink font-semibold text-paper")}>
                {format(day, "d")}
              </span>
              <div className="mt-1 hidden space-y-1 md:block">
                {evs.slice(0, 2).map((e) => (
                  <Link key={e.slug} href={`/events/${e.slug}`} className={cn("block truncate rounded px-1.5 py-0.5 text-[11px]", colour(e.slug))}>
                    {e.name}
                  </Link>
                ))}
              </div>
              <div className="mt-1 flex gap-0.5 md:hidden" aria-hidden>
                {evs.map((e) => (
                  <span key={e.slug} className={cn("size-1.5 rounded-full", colour(e.slug).split(" ")[0])} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-5 py-4 text-sm">
        {inMonth.length ? (
          <ul className="flex flex-wrap gap-2">
            {inMonth.map((e) => (
              <li key={e.slug}>
                <Link href={`/events/${e.slug}`} className="chip">
                  <span className={cn("size-2 rounded-full", colour(e.slug).split(" ")[0])} aria-hidden /> {e.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ash-ink">No dated festivals this month — the Night Market still runs every night.</p>
        )}
      </div>
    </div>
  );
}
