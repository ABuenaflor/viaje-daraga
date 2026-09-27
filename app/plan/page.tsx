import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bus, Plane, TrainFront, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { advisory, contacts, site } from "@/lib/data";
import { fmt } from "@/lib/dates";
import { PageHeader } from "@/components/site/PageHeader";
import { SideNav } from "@/components/plan/SideNav";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Plan your trip",
  description: "Getting to Daraga by air, bus or train, getting around, the best time to visit, Mayon safety, etiquette, phrases and hotlines.",
  alternates: { canonical: "/plan" },
};

const sections = [
  { id: "getting-there", label: "Getting there" },
  { id: "getting-around", label: "Getting around" },
  { id: "best-time", label: "Best time to visit" },
  { id: "safety", label: "Safety & Mayon" },
  { id: "etiquette", label: "Respect & etiquette" },
  { id: "money", label: "Money" },
  { id: "phrases", label: "Handy phrases" },
  { id: "contacts", label: "Contacts" },
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Reveal as="section" id={id} className="scroll-mt-24 border-t border-line pt-10 pb-4" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="display text-4xl">{title}</h2>
      <div className="prose-site mt-5 text-[17px]">{children}</div>
    </Reveal>
  );
}

const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;

export default function PlanPage() {
  return (
    <>
      <PageHeader
        eyebrow="Travel guide"
        title={<>Plan your <span className="italic">Daraga</span> trip</>}
        lead="Everything practical — from the airport with a volcano view to the jeepney back from Legazpi."
      >
        <Link href="/plan/itineraries" className="btn-dark mt-6">
          See ready-made itineraries <ArrowRight aria-hidden className="size-4" />
        </Link>
      </PageHeader>

      <div className="container-site grid gap-12 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <SideNav items={sections} />
        </aside>
        <div className="max-w-3xl lg:col-span-9">
          <Section id="getting-there" title="Getting there">
            <div className="not-prose mb-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Plane, t: "By air", d: "Bicol International Airport (DRP) is in Daraga itself." },
                { icon: Bus, t: "By bus", d: "Overnight from Manila, about 9–10+ hours." },
                { icon: TrainFront, t: "By train", d: "PNR Daraga Station — service is intermittent." },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="rounded-2xl bg-white p-4 ring-1 ring-line">
                  <Icon aria-hidden className="size-5 text-ember" />
                  <p className="mt-2 font-medium">{t}</p>
                  <p className="mt-1 text-sm text-ash-ink">{d}</p>
                </div>
              ))}
            </div>
            <p>
              <strong>By air.</strong>{" "}
              <Link href="/explore/bicol-international-airport" className="underline underline-offset-2">Bicol International Airport</Link>{" "}
              (DRP) opened in October 2021 and is billed as the Philippines&apos; “Most Scenic Gateway” for its Mayon views. Listed routes
              include PAL Express and Cebu Pacific from Manila, and Cebgo from Cebu and Iloilo — check current airline schedules.
              It&apos;s about 15–30 minutes by road to Daraga and Legazpi.
            </p>
            <p>
              <strong>By bus.</strong> Overnight buses leave Manila (Cubao and Pasay) for Legazpi, taking roughly 9–10+ hours. Daraga
              sits on the main road south to Sorsogon, so southbound buses pass through town.
            </p>
            <p>
              <strong>By train.</strong> <Link href="/explore/pnr-daraga-station" className="underline underline-offset-2">PNR Daraga Station</Link>{" "}
              is in the market area on the South Main Line. Service is intermittent — a Guinobatan bridge was damaged by Typhoon Uwan
              in November 2025 — so check PNR advisories first.
            </p>
          </Section>

          <Section id="getting-around" title="Getting around">
            <p><strong>Jeepneys</strong> shuttle between Daraga and Legazpi all day and are the cheapest option. Fares start around ₱10–13 in recent guides — confirm the current minimum fare locally.</p>
            <p><strong>Tricycles</strong> cover short hops, e.g. Caltex Daraga → FarmPlate in Gabawan. Fares are often per person when shared; agree before you ride.</p>
            <p><strong>Vans / UV Express</strong> run to nearby towns. Car, scooter and tricycle rentals are available, and some ATV operators also rent vehicles.</p>
            <p><strong>On foot:</strong> the Daraga Church hill is walkable from the poblacion — take the stairs beside the Municipal Hall.</p>
          </Section>

          <Section id="best-time" title="Best time to visit">
            <p>The <strong>dry season, November to May</strong>, is the most reliable. Typhoon season runs roughly June to November — watch PAGASA forecasts.</p>
            <p>Go <strong>early in the morning</strong> for Mayon: the cone is usually clearest at sunrise and often clouded by early afternoon.</p>
            <p>Come in <strong>February</strong> for the month-long <Link href="/events/cagsawa-festival" className="underline underline-offset-2">Cagsawa Festival</Link>, or in <strong>early September</strong> for the <Link href="/events/daraga-town-fiesta" className="underline underline-offset-2">town fiesta</Link>.</p>
          </Section>

          <Section id="safety" title="Safety & Mayon">
            <div className="not-prose mb-5 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-950">
              <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-red-700" />
              <p className="text-sm leading-relaxed">
                Mayon is at <strong>Alert Level {advisory.mayonAlertLevel}</strong> as of {fmt(advisory.updatedAt)}. Entry to the{" "}
                {advisory.pdzKm}-km Permanent Danger Zone is prohibited.{" "}
                <Link href="/advisory" className="font-medium underline underline-offset-2">Read the advisory</Link>.
              </p>
            </div>
            <p>Obey PHIVOLCS alert levels and never enter the Permanent Danger Zone. River channels carry lahar risk during heavy rain.</p>
            <p>ATV trails open and close with the advisory and lahar conditions — book only with DOT-accredited operators, and expect touts near Cagsawa.</p>
            <p>Heat is real: bring water, a hat and sunscreen for Cagsawa and the ATV trails.</p>
          </Section>

          <Section id="etiquette" title="Respect & etiquette">
            <p>Don&apos;t climb, lean on or carve into the ruins — Cagsawa, Daraga Church and Budiao are National Cultural Treasures.</p>
            <p>At Daraga Church, dress modestly and keep quiet during Mass.</p>
            <p>Ask before photographing people, especially vendors and performers.</p>
          </Section>

          <Section id="money" title="Money">
            <p>Carry cash in small bills — many stalls and tricycles are cash-only. Cagsawa Ruins Park now accepts digital payments and QR passes.</p>
          </Section>

          <Section id="phrases" title="Handy phrases">
            <p className="text-sm text-ash-ink">Locals speak Daragueño (East Miraya Bikol), Central Bikol, Filipino and English. A little Bikol goes a long way.</p>
            <dl className="not-prose mt-4 grid gap-3 sm:grid-cols-2">
              {site.phrases.map((ph) => (
                <div key={ph.bikol} className="rounded-2xl bg-abaca-soft p-4">
                  <dt className="font-display text-2xl" lang="bcl">{ph.bikol}</dt>
                  <dd className="text-sm text-ash-ink">{ph.meaning}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-ash-ink">Spellings pending review by a local speaker.</p>
          </Section>

          <Section id="contacts" title="Contacts">
            <ul className="not-prose divide-y divide-line rounded-2xl bg-white ring-1 ring-line">
              {contacts.map((c) => (
                <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3.5">
                  <span>
                    <span className="font-medium">{c.name}</span>
                    {c.note && <span className="ml-2 text-xs text-ash-ink">{c.note}</span>}
                  </span>
                  <span className="flex flex-wrap gap-x-3 text-sm tabular-nums">
                    {c.phones.map((p) => (
                      <a key={p} href={tel(p)} className="underline decoration-line underline-offset-4 hover:decoration-ink">{p}</a>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </>
  );
}
