"use client";

import { AnimatePresence, m } from "motion/react";
import { ArrowUpRight, ChevronDown, Phone, TriangleAlert, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { Advisory } from "@/data/schema";
import { cn, safeStorage } from "@/lib/utils";
import { motionTokens } from "@/lib/motion";

const levelTone: Record<number, string> = {
  0: "bg-emerald-500",
  1: "bg-yellow-400",
  2: "bg-amber-500",
  3: "bg-orange-600",
  4: "bg-red-600",
  5: "bg-red-800",
};

const KEY = "vd-advisory-collapsed";

export type AdvisoryLabels = Record<"level" | "noEntry" | "updated" | "details" | "source" | "collapse" | "expand" | "verify", string>;

/**
 * Dynamic-Island style Mayon advisory. Always present; "dismiss" only shrinks it
 * to a compact dot for the rest of the session.
 */
export function AdvisoryPill({
  advisory,
  mdrrmo,
  labels,
}: {
  advisory: Advisory;
  mdrrmo: string | null;
  labels: AdvisoryLabels;
}) {
  const t = (k: keyof AdvisoryLabels) => labels[k]; // already interpolated on the server
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const panelId = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is only readable after hydration
    setCompact(safeStorage.get("session", KEY) === "1");
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const collapse = () => {
    setOpen(false);
    setCompact(true);
    safeStorage.set("session", KEY, "1");
  };

  const level = advisory.mayonAlertLevel;
  const dot = (
    <span className="relative flex size-2.5 shrink-0">
      {level >= 2 && (
        <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-60", levelTone[level])} />
      )}
      <span className={cn("relative inline-flex size-2.5 rounded-full", levelTone[level])} />
    </span>
  );

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-4 lg:top-[76px] lg:bottom-auto"
    >
      <m.div
        layout
        transition={motionTokens.ease.spring}
        className={cn(
          "pointer-events-auto overflow-hidden bg-basalt text-paper shadow-lift ring-1 ring-white/10",
          open ? "w-full max-w-md rounded-3xl" : "rounded-full",
        )}
        role="region"
        aria-label="Mayon Volcano advisory"
      >
        <m.button
          layout="position"
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className={cn(
            "flex w-full items-center gap-2.5 text-left text-sm",
            compact && !open ? "px-3 py-2" : "px-4 py-2.5",
          )}
        >
          {dot}
          {compact && !open ? (
            <span className="font-medium">
              Mayon · <span className="sr-only">Alert Level </span>
              {level}
            </span>
          ) : (
            <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
              <span className="font-semibold">{t("level")}</span>
              <span className="truncate text-paper/75">{t("noEntry")}</span>
            </span>
          )}
          <ChevronDown
            aria-hidden
            className={cn("ml-auto size-4 shrink-0 text-paper/60 transition-transform", open && "rotate-180")}
          />
          <span className="sr-only">{open ? t("collapse") : t("expand")}</span>
        </m.button>

        <AnimatePresence initial={false}>
          {open && (
            <m.div
              id={panelId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: motionTokens.dur.sm, ease: motionTokens.ease.out }}
            >
              <div className="space-y-3 px-4 pt-1 pb-4 text-sm">
                <div className="flex items-start gap-2 rounded-2xl bg-white/5 p-3">
                  <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-400" />
                  <p className="text-paper/90">{advisory.summary}</p>
                </div>
                {advisory.extendedZoneKm ? (
                  <p className="text-paper/80">
                    Extended danger zone in effect: {advisory.extendedZoneKm} km.
                  </p>
                ) : null}
                <p className="text-xs text-paper/60">
                  {t("updated")} · {advisory.source}
                  {advisory.needsVerification ? ` — ${t("verify")}` : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/advisory"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1 rounded-full bg-paper px-3 py-1.5 font-medium text-ink"
                  >
                    {t("details")}
                  </Link>
                  <a
                    href={advisory.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5"
                  >
                    {t("source")} <ArrowUpRight aria-hidden className="size-3.5" />
                  </a>
                  {mdrrmo && (
                    <a
                      href={`tel:${mdrrmo.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5"
                    >
                      <Phone aria-hidden className="size-3.5" /> MDRRMO
                    </a>
                  )}
                  {!compact && (
                    <button
                      type="button"
                      onClick={collapse}
                      className="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-paper/70 hover:text-paper"
                    >
                      <X aria-hidden className="size-3.5" /> Minimise
                    </button>
                  )}
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </div>
  );
}
