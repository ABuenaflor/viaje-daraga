"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Check, Pause, Play, RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PlaceLite } from "@/lib/data";
import type { LatLng } from "@/lib/geo";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { LazyMap } from "@/components/map/LazyMap";

export type ReplayStop = {
  time: string | null;
  label: string;
  note: string;
  place: PlaceLite | null;
};
export type ReplayItinerary = {
  slug: string;
  title: string;
  summary: string;
  days: { day: number; title: string; stops: ReplayStop[] }[];
};

const STEP_MS = 1800;

/** Manus-style "replay": steps appear like a task log while the route draws on the map. */
export function ItineraryReplay({
  itinerary,
  summit,
  pdzKm,
}: {
  itinerary: ReplayItinerary;
  summit: LatLng;
  pdzKm: number;
}) {
  const reduce = useReducedMotion();
  const [day, setDay] = useState(1);
  const stops = useMemo(() => itinerary.days.find((d) => d.day === day)?.stops ?? [], [itinerary, day]);
  const [step, setStep] = useState(stops.length - 1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (step >= stops.length - 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- stop at the end of the log
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [playing, step, stops.length]);

  const play = () => {
    if (step >= stops.length - 1) setStep(0);
    setPlaying(true);
  };

  const selectDay = (d: number) => {
    setDay(d);
    const n = itinerary.days.find((x) => x.day === d)?.stops.length ?? 1;
    setPlaying(false);
    setStep(n - 1);
  };

  const shown = stops.slice(0, step + 1);
  const route = useMemo(() => {
    const out: { n: number; coords: LatLng; label: string }[] = [];
    shown.forEach((s, i) => {
      const c = s.place?.coords;
      if (!c) return;
      const prev = out.at(-1);
      if (prev && prev.coords.lat === c.lat && prev.coords.lng === c.lng) return;
      out.push({ n: i + 1, coords: c, label: s.label });
    });
    return out;
  }, [shown]);
  const mapPlaces = useMemo(
    () => [...new Map(stops.filter((s) => s.place?.coords).map((s) => [s.place!.id, s.place!])).values()],
    [stops],
  );
  const unmapped = stops.filter((s) => !s.place?.coords).length;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card flex flex-col p-5 md:p-6">
        {itinerary.days.length > 1 && (
          <div className="mb-5 inline-flex self-start rounded-full bg-abaca-soft p-1" role="tablist" aria-label="Day">
            {itinerary.days.map((d) => (
              <button
                key={d.day}
                type="button"
                role="tab"
                aria-selected={day === d.day}
                onClick={() => selectDay(d.day)}
                className="relative rounded-full px-4 py-1.5 text-sm"
              >
                {day === d.day && (
                  <m.span layoutId={`day-pill-${itinerary.slug}`} className="absolute inset-0 rounded-full bg-white shadow-soft" transition={motionTokens.ease.spring} />
                )}
                <span className="relative">Day {d.day}</span>
              </button>
            ))}
          </div>
        )}
        <p className="text-sm font-medium">{itinerary.days.find((d) => d.day === day)?.title}</p>

        <ol className="relative mt-4 space-y-1" aria-live="polite">
          <AnimatePresence initial={false}>
            {shown.map((s, i) => (
              <m.li
                key={`${day}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: motionTokens.dur.md, ease: motionTokens.ease.out }}
                className="relative flex gap-4 pb-4"
              >
                <span className="flex flex-col items-center">
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold",
                      i === step && playing ? "bg-ember text-white" : "bg-ink text-paper",
                    )}
                  >
                    {i < step || !playing ? <Check aria-hidden className="size-3.5" /> : i + 1}
                  </span>
                  {i < shown.length - 1 && <span className="mt-1 w-px flex-1 bg-line" aria-hidden />}
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    {s.time && <span className="text-xs font-semibold text-ash-ink tabular-nums">{s.time}</span>}
                    {s.place ? (
                      <Link href={`/explore/${s.place.slug}`} className="font-medium hover:underline">{s.label}</Link>
                    ) : (
                      <span className="font-medium">{s.label}</span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-ash-ink">{s.note}</span>
                  {s.place?.nearPdz && (
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-800 ring-1 ring-red-200">
                      <TriangleAlert aria-hidden className="size-3" /> Check the Mayon advisory first
                    </span>
                  )}
                </span>
              </m.li>
            ))}
          </AnimatePresence>
        </ol>

        <div className="mt-auto flex items-center gap-3 border-t border-line pt-4">
          <button
            type="button"
            onClick={() => (playing ? setPlaying(false) : play())}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-paper"
            aria-label={playing ? "Pause replay" : "Play replay"}
          >
            {playing ? <Pause aria-hidden className="size-4" /> : step >= stops.length - 1 ? <RotateCcw aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
          </button>
          <label className="flex flex-1 items-center gap-3 text-xs text-ash-ink">
            <span className="sr-only">Scrub through stops</span>
            <input
              type="range"
              min={0}
              max={Math.max(stops.length - 1, 0)}
              value={step}
              onChange={(e) => {
                setPlaying(false);
                setStep(Number(e.target.value));
              }}
              className="flex-1 accent-[var(--ember)]"
            />
            <span className="tabular-nums">{step + 1}/{stops.length}</span>
          </label>
        </div>
      </div>

      <div className="card overflow-hidden">
        <LazyMap
          className="h-80 lg:h-full lg:min-h-[480px]"
          label={`Route map for ${itinerary.title}`}
          places={mapPlaces}
          summit={summit}
          center={mapPlaces[0]?.coords ?? summit}
          zoom={13}
          pdzKm={pdzKm}
          route={route}
          cluster={false}
          fit
          cooperative
        />
        {unmapped > 0 && (
          <p className="border-t border-line px-4 py-2 text-xs text-ash-ink">
            {unmapped} stop{unmapped > 1 ? "s" : ""} not drawn — location not yet confirmed.
          </p>
        )}
      </div>
    </div>
  );
}
