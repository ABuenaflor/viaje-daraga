import type { Metadata } from "next";
import { ArrowUpRight, Phone, TriangleAlert } from "lucide-react";
import { advisory, contacts, places, site, toLite } from "@/lib/data";
import { fmt } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/site/PageHeader";
import { LazyMap } from "@/components/map/LazyMap";
import { PlaceCard } from "@/components/cards/PlaceCard";

export const metadata: Metadata = {
  title: "Mayon advisory",
  description: "Current Mayon Volcano alert level, the Permanent Danger Zone, what it means for visitors to Daraga, and emergency numbers.",
  alternates: { canonical: "/advisory" },
};

// PHIVOLCS volcano alert levels (revised scheme).
const levels = [
  { n: 0, name: "Normal", tone: "bg-emerald-500" },
  { n: 1, name: "Low-level unrest", tone: "bg-yellow-400" },
  { n: 2, name: "Increasing unrest", tone: "bg-amber-500" },
  { n: 3, name: "Increased tendency toward hazardous eruption", tone: "bg-orange-600" },
  { n: 4, name: "Hazardous eruption imminent", tone: "bg-red-600" },
  { n: 5, name: "Hazardous eruption in progress", tone: "bg-red-800" },
];

const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;

export default function AdvisoryPage() {
  const current = levels[advisory.mayonAlertLevel];
  const emergency = contacts.filter((c) => c.group === "emergency");
  const affected = places.filter((p) => p.nearPdz && p.id !== "mayon-volcano").map(toLite);

  return (
    <>
      <PageHeader
        eyebrow="Safety"
        title={<>Mayon <span className="italic">advisory</span></>}
        lead="Mayon is an active volcano. Viewing it is safe from Daraga — entering its Permanent Danger Zone is not."
      />

      <section className="container-site grid gap-6 lg:grid-cols-12">
        <div className="card p-6 md:p-8 lg:col-span-7">
          <div className="flex items-center gap-4">
            <span className={cn("grid size-20 shrink-0 place-items-center rounded-2xl font-display text-5xl text-white", current.tone)}>
              {advisory.mayonAlertLevel}
            </span>
            <div>
              <p className="eyebrow">Current alert level</p>
              <p className="display text-3xl">{current.name}</p>
              <p className="text-sm text-ash-ink">As of {fmt(advisory.updatedAt)} · {advisory.source}</p>
            </div>
          </div>
          <p className="mt-6 text-lg leading-relaxed">{advisory.summary}</p>
          {advisory.needsVerification && (
            <p className="mt-4 flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              This level is taken from recent reports and hasn&apos;t been re-checked today. Always confirm with PHIVOLCS before you
              travel.
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={advisory.sourceUrl} target="_blank" rel="noreferrer" className="btn-primary">
              Check PHIVOLCS / HazardHunter <ArrowUpRight aria-hidden className="size-4" />
            </a>
            <a href="https://www.pagasa.dost.gov.ph" target="_blank" rel="noreferrer" className="btn-ghost">
              Weather (PAGASA) <ArrowUpRight aria-hidden className="size-4" />
            </a>
          </div>

          <ol className="mt-8 space-y-1.5" aria-label="PHIVOLCS alert levels">
            {levels.map((l) => (
              <li
                key={l.n}
                aria-current={l.n === advisory.mayonAlertLevel ? "true" : undefined}
                className={cn("flex items-center gap-3 rounded-xl px-3 py-2 text-sm", l.n === advisory.mayonAlertLevel ? "bg-abaca-soft font-medium ring-1 ring-ink" : "text-ash-ink")}
              >
                <span className={cn("size-3 rounded-full", l.tone)} aria-hidden />
                <span className="w-4 tabular-nums">{l.n}</span> {l.name}
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <div className="card overflow-hidden">
            <LazyMap
              className="h-80"
              label="Map of the Mayon Permanent Danger Zone"
              places={places.filter((p) => p.coords && p.category !== "day-trip").map(toLite)}
              summit={site.mayonSummit}
              center={{ lat: 13.2, lng: 123.69 }}
              zoom={10.6}
              pdzKm={advisory.pdzKm}
              extendedKm={advisory.extendedZoneKm}
              cooperative
            />
            <p className="p-4 text-sm text-ash-ink">
              Hatched red: the {advisory.pdzKm}-km Permanent Danger Zone around the summit.
              {advisory.extendedZoneKm ? ` Dashed orange: the ${advisory.extendedZoneKm}-km extended zone.` : ""}
            </p>
          </div>
          <div className="card p-6">
            <h2 className="eyebrow">Emergency numbers</h2>
            <ul className="mt-3 divide-y divide-line">
              {emergency.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span>{c.name}</span>
                  <a href={tel(c.phones[0])} className="inline-flex items-center gap-1.5 font-medium tabular-nums">
                    <Phone aria-hidden className="size-3.5" /> {c.phones[0]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-site pt-16" aria-labelledby="what">
        <h2 id="what" className="display text-4xl">What it means for your trip</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Never enter the PDZ", `No one may enter the ${advisory.pdzKm}-km Permanent Danger Zone, whatever the alert level.`],
            ["ATV trails may close", "Trail availability depends on the alert level, LGU advisories and lahar conditions. Operators will tell you what's open."],
            ["Watch the rivers", "Heavy rain can send lahar down river channels. Stay out of them during and after downpours."],
          ].map(([t, d]) => (
            <li key={t} className="rounded-2xl bg-abaca-soft p-6">
              <p className="font-display text-2xl">{t}</p>
              <p className="mt-2 text-sm text-ink/80">{d}</p>
            </li>
          ))}
        </ul>
        {affected.length > 0 && (
          <>
            <h3 className="mt-14 mb-5 text-lg font-semibold">Places near the danger zone</h3>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {affected.map((p) => (
                <li key={p.id}>
                  <PlaceCard place={p} compact />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}
