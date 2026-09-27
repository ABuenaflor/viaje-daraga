import type { Metadata } from "next";
import { site, upcomingEvents } from "@/lib/data";
import { PageHeader, SectionHeading } from "@/components/site/PageHeader";
import { EventCard } from "@/components/events/EventCard";
import { MonthCalendar } from "@/components/events/MonthCalendar";
import { Reveal } from "@/components/motion/Reveal";
import { stagger } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Events",
  description: "Cagsawa Festival, the Daraga town fiesta, Holy Week, Christmas and the nightly Night Market — Daraga's events calendar.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  const all = upcomingEvents();
  const daraga = all.filter((e) => e.scope === "daraga");
  const nearby = all.filter((e) => e.scope === "nearby");
  const dated = all
    .filter((e) => e.nextStart)
    .map((e) => ({ slug: e.slug, name: e.name, start: e.nextStart!, end: e.nextEnd ?? e.nextStart! }));

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title={<>Resilience, <span className="italic">celebrated</span></>}
        lead="Daraga's year turns on two dates: 1 February, when the Cagsawa Festival remembers 1814, and 8 September, the feast of Our Lady of the Gate."
      >
        <p className="mt-4 max-w-2xl text-sm text-ash-ink">
          Dates marked “expected” follow the yearly pattern and haven&apos;t been announced yet. Confirm with the tourism office
          before you book.
        </p>
      </PageHeader>

      <section className="container-site grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <MonthCalendar events={dated} initialMonth={site.researchedAt.slice(0, 7)} />
        </div>
        <ul className="space-y-4 lg:col-span-5" aria-label="Daraga events">
          {daraga.map((e, i) => (
            <Reveal as="li" key={e.id} delay={stagger(i)}>
              <EventCard event={e} />
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-site pt-20" aria-labelledby="nearby">
        <SectionHeading id="nearby" eyebrow="Around Albay" title={<>Pair your trip with</>} />
        <ul className="grid gap-4 md:grid-cols-2">
          {nearby.map((e) => (
            <li key={e.id}>
              <EventCard event={e} />
            </li>
          ))}
        </ul>
        <div className="mt-10 rounded-3xl bg-abaca-soft p-8">
          <h2 className="display text-3xl">Organising something in Daraga?</h2>
          <p className="mt-2 max-w-xl text-ash-ink">
            Barangays and businesses can submit events to the Daraga Tourism Office. An online submission form is coming
            soon.
          </p>
        </div>
      </section>
    </>
  );
}
