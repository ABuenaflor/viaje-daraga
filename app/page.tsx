import Link from "next/link";
import { ArrowRight, ArrowUpRight, Map as MapIcon, Route } from "lucide-react";
import { advisory, dishes, getPlace, itineraries, places, site, toLite, upcomingEvents } from "@/lib/data";
import { HeroArt } from "@/components/hero/HeroArt";
import { SplineHero } from "@/components/hero/SplineHero";
import { AskBox } from "@/components/hero/AskBox";
import { RollingWords } from "@/components/motion/RollingWords";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { Reveal } from "@/components/motion/Reveal";
import { stagger } from "@/lib/motion";
import { AttractionStack } from "@/components/home/AttractionStack";
import { FoodExpand } from "@/components/home/FoodExpand";
import { EventCard } from "@/components/events/EventCard";
import { PlaceCard } from "@/components/cards/PlaceCard";
import { SectionHeading } from "@/components/site/PageHeader";
import { LazyMap } from "@/components/map/LazyMap";

export default function Home() {
  const stackIds: [string, string][] = [
    ["cagsawa-ruins", "National Cultural Treasure · 2015"],
    ["daraga-church", "National Cultural Treasure · 2007"],
    ["budiao-ruins", "National Cultural Treasure · archaeology"],
    ["mayon-atv", "Adventure · advisory permitting"],
  ];
  const stack = stackIds.map(([id, kicker]) => ({ ...getPlace(id)!, kicker }));
  const emerging = places.filter((p) => ["farmplate", "night-market", "cafe-fabrika", "tierra-cafe"].includes(p.id)).map(toLite);
  const featuredDishes = dishes.filter((d) => ["bicol-express", "laing", "sili-ice-cream", "pinangat", "daraga-suman", "kinalas"].includes(d.id));
  const events = upcomingEvents().filter((e) => e.scope === "daraga").slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-16 flex min-h-[100svh] flex-col items-center overflow-hidden pt-32 pb-40 md:pt-36">
        <HeroArt />
        <SplineHero scene={site.splineScene} />
        <div className="relative z-10 flex w-full flex-col items-center px-4 text-center">
          <Reveal>
            <p className="eyebrow">
              <RollingWords words={["Marhay na aldaw", "Magayon", "Daraga, Albay"]} />
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="display mt-4 max-w-4xl text-5xl leading-[1.02] sm:text-6xl md:text-7xl lg:text-8xl">
              What do you want to experience in <span className="italic">Daraga?</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 flex w-full justify-center">
            <AskBox places={places.map(toLite)} />
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Daraga in numbers" className="border-y border-line bg-white">
        <dl className="container-site grid grid-cols-2 divide-line py-10 md:grid-cols-4 md:divide-x">
          {site.stats.map((s, i) => (
            <Reveal key={s.label} delay={stagger(i)} className="flex flex-col-reverse px-4 py-3 md:px-8">
              <dt className="text-sm text-ash-ink">{s.label}</dt>
              <dd className="font-display text-5xl md:text-6xl">
                <AnimatedNumber value={s.value} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Top attractions */}
      <section className="container-site pt-24" aria-labelledby="treasures">
        <SectionHeading
          id="treasures"
          eyebrow="Three National Cultural Treasures & a volcano"
          title={<>Where Mayon <span className="italic">meets memory</span></>}
          action={
            <Link href="/explore" className="btn-ghost">
              All places <ArrowRight aria-hidden className="size-4" />
            </Link>
          }
        />
        <AttractionStack items={stack} />
      </section>

      {/* 1814 teaser */}
      <section className="mt-12 bg-basalt text-paper">
        <div className="container-site grid items-center gap-10 py-20 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow !text-paper/60">1 February 1814</p>
            <h2 className="display mt-3 text-5xl md:text-6xl">
              The morning Mayon <span className="italic">buried a town.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-paper/80">
              More than 1,200 people died when Mayon erupted over Cagsawa, Budiao and nearby towns. Survivors rebuilt on
              higher ground — at Daraga. Read the story, then stand where it happened.
            </p>
            <Link href="/heritage/1814" className="btn mt-6 bg-paper text-ink hover:bg-abaca">
              Read the story <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Food */}
      <section className="container-site pt-24" aria-labelledby="food">
        <SectionHeading
          id="food"
          eyebrow="Sili, gata & pili"
          title={<>A food trip <span className="italic">with heat</span></>}
          action={
            <Link href="/eat" className="btn-ghost">
              What to eat <ArrowRight aria-hidden className="size-4" />
            </Link>
          }
        />
        <Reveal>
          <FoodExpand dishes={featuredDishes} />
        </Reveal>
      </section>

      {/* Emerging & tambayan */}
      <section className="container-site pt-24" aria-labelledby="emerging">
        <SectionHeading id="emerging" eyebrow="After the ruins" title={<>Tambayan, cafés <span className="italic">& night lights</span></>} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {emerging.map((p, i) => (
            <Reveal as="li" key={p.id} delay={stagger(i)}>
              <PlaceCard place={p} />
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Events */}
      <section className="container-site pt-24" aria-labelledby="events">
        <SectionHeading
          id="events"
          eyebrow="Calendar"
          title={<>Fiestas & <span className="italic">festivals</span></>}
          action={
            <Link href="/events" className="btn-ghost">
              Full calendar <ArrowRight aria-hidden className="size-4" />
            </Link>
          }
        />
        <ul className="grid gap-5 md:grid-cols-3">
          {events.map((e, i) => (
            <Reveal as="li" key={e.id} delay={stagger(i)}>
              <EventCard event={e} />
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Map teaser + itineraries */}
      <section className="container-site grid gap-5 pt-24 lg:grid-cols-5">
        <Reveal className="card overflow-hidden lg:col-span-3">
          <LazyMap
            className="h-80 md:h-[420px]"
            label="Map preview of Daraga"
            places={places.filter((p) => p.coords).map(toLite)}
            summit={site.mayonSummit}
            center={{ lat: 13.18, lng: 123.7 }}
            zoom={11}
            pdzKm={advisory.pdzKm}
            extendedKm={advisory.extendedZoneKm}
            cooperative
          />
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="text-sm text-ash-ink">Every spot on one map — with the Mayon danger zone marked.</p>
            <Link href="/map" className="btn-dark">
              <MapIcon aria-hidden className="size-4" /> Open the map
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="card flex flex-col p-6 lg:col-span-2">
          <p className="eyebrow">Ready-made plans</p>
          <h2 className="display mt-2 text-4xl">Itineraries</h2>
          <ul className="mt-6 divide-y divide-line">
            {itineraries.map((it) => (
              <li key={it.id}>
                <Link href={`/plan/itineraries#${it.slug}`} className="group flex items-center gap-3 py-4">
                  <Route aria-hidden className="size-5 shrink-0 text-ember" />
                  <span className="min-w-0">
                    <span className="block font-medium">{it.title}</span>
                    <span className="block text-sm text-ash-ink">{it.summary}</span>
                  </span>
                  <ArrowUpRight aria-hidden className="ml-auto size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
