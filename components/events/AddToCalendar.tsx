"use client";

import { CalendarPlus } from "lucide-react";
import { buildIcs } from "@/lib/ics";
import { cn } from "@/lib/utils";

export function AddToCalendar({
  slug,
  title,
  start,
  end,
  venue,
  summary,
  projected,
  className,
}: {
  slug: string;
  title: string;
  start: string;
  end?: string | null;
  venue: string;
  summary: string;
  projected: boolean;
  className?: string;
}) {
  const download = () => {
    const url = `${window.location.origin}/events/${slug}`;
    const ics = buildIcs({
      uid: `${slug}-${start}`,
      title,
      start,
      end,
      location: `${venue}, Daraga, Albay`,
      description: `${summary}${projected ? "\n\nDates are expected from the yearly pattern — confirm with the Daraga Tourism Office." : ""}\n${url}`,
      url,
    });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${slug}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <button type="button" onClick={download} className={cn("btn-ghost", className)}>
      <CalendarPlus aria-hidden className="size-4" /> Add to calendar
    </button>
  );
}
