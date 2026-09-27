import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { EventItem } from "@/data/schema";
import { fmt, fmtRange } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { Countdown } from "./Countdown";

export function EventCard({ event, className }: { event: EventItem; className?: string }) {
  return (
    <article className={cn("group card relative flex h-full flex-col overflow-hidden p-6 transition-shadow hover:shadow-lift", className)}>
      <div className="flex items-start gap-4">
        {event.nextStart ? (
          <div className="grid w-16 shrink-0 place-items-center rounded-2xl bg-abaca-soft py-2 text-center">
            <span className="text-xs font-semibold tracking-wider text-sili uppercase">{fmt(event.nextStart, "MMM")}</span>
            <span className="font-display text-3xl leading-none">{fmt(event.nextStart, "d")}</span>
          </div>
        ) : (
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-abaca-soft">
            <CalendarDays aria-hidden className="size-6 text-ash-ink" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-display text-2xl leading-tight">
            <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0">
              {event.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-ash-ink">
            {event.nextStart ? fmtRange(event.nextStart, event.nextEnd) : event.dateRule}
            {event.projected && <span className="ml-1 text-xs">(expected)</span>}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink/85">{event.summary}</p>
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-4 text-xs text-ash-ink">
        <span className="inline-flex items-center gap-1">
          <MapPin aria-hidden className="size-3.5" /> {event.venue}
        </span>
        {event.status === "verify" && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-900 ring-1 ring-amber-200">Dates unconfirmed</span>
        )}
        {event.status === "ongoing" && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-900 ring-1 ring-emerald-200">Nightly</span>
        )}
        {event.nextStart && (
          <Countdown start={event.nextStart} className="rounded-full bg-ember px-2 py-0.5 font-medium text-white" />
        )}
      </div>
    </article>
  );
}
