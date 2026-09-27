import type { Metadata } from "next";
import Link from "next/link";
import { Flame } from "lucide-react";
import { dishes, getPlace, placesIn, toLite } from "@/lib/data";
import { PageHeader, SectionHeading } from "@/components/site/PageHeader";
import { ExploreGrid } from "@/components/explore/ExploreGrid";
import { Reveal } from "@/components/motion/Reveal";
import { stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Eat",
  description: "Bicol Express, laing, pinangat, sili ice cream, Daraga suman and where to try them in Daraga, Albay.",
  alternates: { canonical: "/eat" },
};

const typeLabel = { dish: "Dish", delicacy: "Delicacy", pasalubong: "Pasalubong", dessert: "Dessert", drink: "Drink" } as const;

function tagsFor(cat: "restaurant" | "tambayan") {
  const set = new Set<string>();
  placesIn(cat).forEach((p) => p.tags.forEach((t) => set.add(t)));
  return [...set];
}

export default function EatPage() {
  const restaurants = placesIn("restaurant", "tambayan").map(toLite);
  const pasalubong = dishes.filter((d) => d.type === "pasalubong");
  const food = dishes.filter((d) => d.type !== "pasalubong");

  return (
    <>
      <PageHeader
        eyebrow="Eat"
        title={<>Gata, sili <span className="italic">& smoke</span></>}
        lead="Bicolano cooking runs on coconut milk and chili. Here's what to order in Daraga — and where."
      />

      <section className="container-site" aria-labelledby="dishes">
        <h2 id="dishes" className="sr-only">Dishes to try</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {food.map((d, i) => (
            <Reveal as="li" key={d.id} delay={stagger(i)} id={d.id} className="card flex scroll-mt-24 flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <p className="eyebrow">{typeLabel[d.type]}</p>
                {d.spiceLevel !== undefined && d.spiceLevel > 0 && (
                  <span className="flex" aria-label={`Spice level ${d.spiceLevel} of 3`}>
                    {Array.from({ length: 3 }).map((_, k) => (
                      <Flame key={k} aria-hidden className={cn("size-4", k < d.spiceLevel! ? "text-sili" : "text-line")} />
                    ))}
                  </span>
                )}
              </div>
              <h3 className="display mt-2 text-3xl">{d.name}</h3>
              {d.localName && <p className="text-sm text-ash-ink italic">{d.localName}</p>}
              <p className="mt-3 text-sm leading-relaxed text-ink/85">{d.description}</p>
              <div className="mt-auto pt-5 text-sm">
                <p className="text-xs font-medium tracking-wide text-ash-ink uppercase">Where to try</p>
                <p className="mt-1">
                  {d.whereToTry.map((id, k) => {
                    const p = getPlace(id)!;
                    return (
                      <span key={id}>
                        <Link href={`/explore/${p.slug}`} className="underline decoration-line underline-offset-4 hover:decoration-ink">
                          {p.name}
                        </Link>
                        {p.status === "temporarily-closed" ? " (temporarily closed)" : ""}
                        {k < d.whereToTry.length - 1 ? " · " : ""}
                      </span>
                    );
                  })}
                  {d.whereNote && <span className="text-ash-ink">{d.whereToTry.length ? " · " : ""}{d.whereNote}</span>}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-site pt-20" aria-labelledby="pasalubong">
        <SectionHeading id="pasalubong" eyebrow="Take-home" title={<>Pasalubong</>} />
        <ul className="grid gap-4 md:grid-cols-2">
          {pasalubong.map((d) => (
            <li key={d.id} id={d.id} className="scroll-mt-24 rounded-3xl bg-abaca p-8">
              <h3 className="display text-3xl">{d.name}</h3>
              <p className="mt-2 max-w-md text-ink/85">{d.description}</p>
              {d.whereNote && <p className="mt-4 text-sm text-ash-ink">{d.whereNote}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="container-site pt-20" aria-labelledby="restaurants">
        <SectionHeading id="restaurants" eyebrow="Tables" title={<>Restaurants <span className="italic">& food stops</span></>} />
        <ExploreGrid places={restaurants} categories={["restaurant", "tambayan"]} tags={[...new Set([...tagsFor("restaurant"), ...tagsFor("tambayan")])]} syncUrl={false} />
      </section>
    </>
  );
}
