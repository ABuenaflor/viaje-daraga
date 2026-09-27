"use client";

import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import type { Place } from "@/data/schema";
import { PlaceArt } from "@/components/cards/PlaceArt";
import { StatusBadges } from "@/components/cards/Badges";

type Item = Pick<Place, "id" | "slug" | "name" | "category" | "short" | "highlights" | "status" | "nearPdz" | "coordsVerified" | "coords"> & {
  kicker: string;
};

function Card({ item, i, total, progress }: { item: Item; i: number; total: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const start = i / total;
  const scale = useTransform(progress, [start, 1], [1, reduce ? 1 : 1 - (total - i) * 0.04]);
  return (
    <div className="sticky top-24 flex h-[78vh] items-start justify-center pt-4" style={{ paddingTop: `${i * 22}px` }}>
      <m.article
        style={{ scale }}
        className="card relative grid w-full origin-top overflow-hidden md:grid-cols-2"
      >
        <PlaceArt id={item.id} category={item.category} className="aspect-[4/3] md:aspect-auto md:h-full" showIcon={false} />
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <p className="eyebrow">{String(i + 1).padStart(2, "0")} · {item.kicker}</p>
          <h3 className="display text-4xl md:text-5xl">{item.name}</h3>
          <p className="text-ash-ink">{item.short}</p>
          <ul className="space-y-1.5 text-sm">
            {item.highlights.slice(0, 3).map((h) => (
              <li key={h} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ember" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
          <StatusBadges place={item} />
          <Link href={`/explore/${item.slug}`} className="btn-dark mt-auto self-start">
            Visit guide <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
      </m.article>
    </div>
  );
}

/** Sticky stacked destination cards (Skiper "card stack scroll" feel). */
export function AttractionStack({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div ref={ref} className="relative">
      {items.map((item, i) => (
        <Card key={item.id} item={item} i={i} total={items.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}
