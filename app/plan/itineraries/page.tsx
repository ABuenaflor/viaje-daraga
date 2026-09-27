import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Map as MapIcon } from "lucide-react";
import { advisory, getPlace, itineraries, site, toLite } from "@/lib/data";
import { PageHeader } from "@/components/site/PageHeader";
import { ItineraryReplay, type ReplayItinerary } from "@/components/plan/ItineraryReplay";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Itineraries",
  description: "1-, 2- and 3-day Daraga itineraries — Cagsawa at dawn, Bicolano lunch, church-hill sunset, night market and day trips.",
  alternates: { canonical: "/plan/itineraries" },
};

export default function ItinerariesPage() {
  const data: ReplayItinerary[] = itineraries.map((it) => ({
    slug: it.slug,
    title: it.title,
    summary: it.summary,
    days: it.days.map((d) => ({
      day: d.day,
      title: d.title,
      stops: d.stops.map((s) => {
        const p = s.placeId ? getPlace(s.placeId) : undefined;
        return { time: s.time, label: s.label, note: s.note, place: p ? toLite(p) : null };
      }),
    })),
  }));

  return (
    <>
      <div className="container-site pt-8">
        <Link href="/plan" className="inline-flex items-center gap-1.5 text-sm text-ash-ink hover:text-ink">
          <ArrowLeft aria-hidden className="size-4" /> Travel guide
        </Link>
      </div>
      <PageHeader
        eyebrow="Itineraries"
        title={<>Press play on <span className="italic">Daraga</span></>}
        lead="Three ready-made plans. Hit play to watch each day unfold on the map, or scrub to any stop. Times are suggestions — adventure stops depend on the Mayon advisory."
        className="!pt-8"
      />
      <div className="container-site space-y-20">
        {data.map((it) => (
          <section key={it.slug} id={it.slug} className="scroll-mt-24" aria-labelledby={`${it.slug}-h`}>
            <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id={`${it.slug}-h`} className="display text-4xl md:text-5xl">{it.title}</h2>
                <p className="mt-2 max-w-2xl text-ash-ink">{it.summary}</p>
              </div>
              <Link href={`/map?itinerary=${it.slug}`} className="btn-ghost">
                <MapIcon aria-hidden className="size-4" /> Open on full map
              </Link>
            </Reveal>
            <ItineraryReplay itinerary={it} summit={site.mayonSummit} pdzKm={advisory.pdzKm} />
          </section>
        ))}
      </div>
    </>
  );
}
