import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPlace, placesIn, toLite } from "@/lib/data";
import { PageHeader, SectionHeading } from "@/components/site/PageHeader";
import { ExploreGrid } from "@/components/explore/ExploreGrid";
import { Reveal } from "@/components/motion/Reveal";
import { stagger } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Cafés & tambayan",
  description: "Coffee shops, study cafés and local hangouts in Daraga, Albay — from a vintage abaca-factory café to the night market.",
  alternates: { canonical: "/cafes" },
};

// §10.6 — hangouts, including places that live in other categories.
const tambayan = [
  { id: "daraga-church", why: "Sunrise and sunset on the hill — Mayon on one side, Albay Gulf on the other." },
  { id: "night-market", why: "A nightly street-food crawl, 7 PM until dawn." },
  { id: "food-park", why: "Many stalls in one place — easy group dinners." },
  { id: "farmplate", why: "Lights, bonfire and live music after dark." },
  { id: "cagsawa-ruins", why: "A daytime picnic in the shadow of the belfry." },
];

export default function CafesPage() {
  const cafes = placesIn("cafe").map(toLite);
  const tags = [...new Set(placesIn("cafe").flatMap((p) => p.tags))];

  return (
    <>
      <PageHeader
        eyebrow="Cafés & tambayan"
        title={<>Slow afternoons, <span className="italic">late nights</span></>}
        lead="Study-friendly cafés, Mayon-view coffee and the places locals actually hang out."
      />
      <section className="container-site" aria-label="Cafés">
        <ExploreGrid places={cafes} tags={tags} syncUrl={false} />
        <p className="mt-6 text-sm text-ash-ink">
          Also mentioned in directories and still being verified: Pritti Place Café, Sef&apos;s Place and Tumbled Beans Cafe &
          Laundromat.
        </p>
      </section>

      <section id="tambayan" className="container-site scroll-mt-24 pt-20" aria-labelledby="tambayan-h">
        <SectionHeading id="tambayan-h" eyebrow="Tambayan" title={<>Where Daraga <span className="italic">hangs out</span></>} />
        <ol className="divide-y divide-line border-y border-line">
          {tambayan.map((t, i) => {
            const p = getPlace(t.id)!;
            return (
              <Reveal as="li" key={t.id} delay={stagger(i)}>
                <Link href={`/explore/${p.slug}`} className="group grid items-baseline gap-2 py-6 md:grid-cols-12">
                  <span className="font-display text-2xl text-ash md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-3xl transition-colors group-hover:text-ember md:col-span-5">{p.name.split(" — ")[0]}</span>
                  <span className="text-ash-ink md:col-span-5">{t.why}</span>
                  <ArrowUpRight aria-hidden className="hidden size-5 justify-self-end transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:col-span-1 md:block" />
                </Link>
              </Reveal>
            );
          })}
        </ol>
      </section>
    </>
  );
}
