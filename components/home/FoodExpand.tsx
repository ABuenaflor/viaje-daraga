"use client";

import { m } from "motion/react";
import { Flame } from "lucide-react";
import { useState } from "react";
import type { Dish } from "@/data/schema";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

const tints = ["#B91C1C", "#C4410C", "#4E7A30", "#6B4423", "#8A4B2A", "#2F5D7C"];

/** Hover/focus-expand panels (Skiper "hover expand"). Stacks vertically on small screens. */
export function FoodExpand({ dishes }: { dishes: Dish[] }) {
  const [open, setOpen] = useState(0);
  return (
    <ul className="flex flex-col gap-2 md:h-[420px] md:flex-row">
      {dishes.map((d, i) => {
        const isOpen = open === i;
        return (
          <m.li
            key={d.id}
            layout
            transition={{ duration: motionTokens.dur.md, ease: motionTokens.ease.out }}
            className={cn(
              "relative overflow-hidden rounded-2xl text-paper",
              isOpen ? "md:flex-[4]" : "md:flex-1",
            )}
            style={{ backgroundColor: tints[i % tints.length] }}
            onMouseEnter={() => setOpen(i)}
          >
            <button
              type="button"
              onFocus={() => setOpen(i)}
              onClick={() => setOpen(i)}
              aria-expanded={isOpen}
              className="flex size-full flex-col justify-end p-5 text-left"
            >
              <svg viewBox="0 0 200 200" className="pointer-events-none absolute -top-10 -right-10 size-56 opacity-15" aria-hidden>
                <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="14" />
                <circle cx="100" cy="100" r="46" fill="currentColor" />
              </svg>
              <span className="flex items-center gap-2">
                <span className={cn("font-display text-2xl leading-tight", !isOpen && "md:[writing-mode:vertical-rl] md:rotate-180")}>
                  {d.name}
                </span>
              </span>
              <m.span
                initial={false}
                animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
                className="block overflow-hidden"
              >
                <span className="mt-2 block max-w-sm text-sm text-paper/85">{d.description}</span>
                {d.spiceLevel ? (
                  <span className="mt-3 flex items-center gap-0.5" aria-label={`Spice level ${d.spiceLevel} of 3`}>
                    {Array.from({ length: 3 }).map((_, k) => (
                      <Flame key={k} aria-hidden className={cn("size-4", k < d.spiceLevel! ? "text-paper" : "text-paper/30")} />
                    ))}
                  </span>
                ) : null}
              </m.span>
            </button>
          </m.li>
        );
      })}
    </ul>
  );
}
