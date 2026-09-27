import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { events, getEvent, getPlace, site } from "@/lib/data";
import { fmt, fmtRange } from "@/lib/dates";
import { hostOf, paragraphs } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { Countdown } from "@/components/events/Countdown";
import { AddToCalendar } from "@/components/events/AddToCalendar";
import { ShareButton } from "@/components/cards/ShareButton";

export const dynamicParams = false;

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = getEvent(slug);
  if (!e) return {};
  return { title: e.name, description: e.summary, alternates: { canonical: `/events/${e.slug}` } };
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const e = getEvent(slug);
  if (!e) notFound();
  const place = e.placeId ? getPlace(e.placeId) : undefined;

  const jsonLd = e.nextStart
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: e.name,
        description: e.summary,
        startDate: e.nextStart,
        endDate: e.nextEnd ?? e.nextStart,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: e.venue, address: { "@type": "PostalAddress", addressLocality: "Daraga", addressRegion: "Albay", addressCountry: "PH" } },
        url: `${site.url}/events/${e.slug}`,
      }
    : null;

  return (
    <article className="container-site">
      {jsonLd && !e.projected && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}
      <div className="pt-8">
        <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-ash-ink hover:text-ink">
          <ArrowLeft aria-hidden className="size-4" /> All events
        </Link>
      </div>
      <header className="max-w-4xl pt-8 pb-10">
        <Reveal>
          <p className="eyebrow">{e.scope === "nearby" ? "Around Albay" : "Daraga"} · {e.dateRule}</p>
          <h1 className="display mt-3 text-5xl leading-[1.02] md:text-7xl">{e.name}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ash-ink">{e.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden className="size-4 text-ash" />
              {e.nextStart ? fmtRange(e.nextStart, e.nextEnd) : "Dates to be announced"}
              {e.projected && <span className="text-ash-ink">(expected)</span>}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden className="size-4 text-ash" />
              {place ? <Link className="underline underline-offset-2" href={`/explore/${place.slug}`}>{e.venue}</Link> : e.venue}
            </span>
            {e.nextStart && <Countdown start={e.nextStart} className="rounded-full bg-ember px-2.5 py-0.5 text-xs font-medium text-white" />}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {e.nextStart && (
              <AddToCalendar slug={e.slug} title={e.name} start={e.nextStart} end={e.nextEnd} venue={e.venue} summary={e.summary} projected={e.projected} />
            )}
            <ShareButton title={e.name} path={`/events/${e.slug}`} />
          </div>
        </Reveal>
      </header>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="prose-site text-lg lg:col-span-7">
          {e.projected && (
            <p className="!mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 !text-sm text-amber-950">
              These dates follow the yearly pattern and haven&apos;t been officially announced. Check with the Daraga Tourism
              Office or the LGU&apos;s pages closer to the date.
            </p>
          )}
          {e.status === "verify" && (
            <p className="!mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 !text-sm text-amber-950">
              Dates vary each year — confirm with the organisers.
            </p>
          )}
          {paragraphs(e.long ?? e.summary).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <aside className="lg:col-span-5">
          <div className="card p-6">
            <h2 className="display text-2xl">What to expect</h2>
            <ul className="mt-4 space-y-2.5">
              {e.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-sm">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sili" aria-hidden /> {h}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {e.sources.length > 0 && (
        <p className="mt-16 border-t border-line pt-6 text-xs text-ash-ink">
          Sources:{" "}
          {e.sources.map((s, i) => (
            <span key={s}>
              <a className="underline underline-offset-2 hover:text-ink" href={s} target="_blank" rel="noreferrer">{hostOf(s)}</a>
              {i < e.sources.length - 1 ? " · " : ""}
            </span>
          ))}{" "}
          · Researched {fmt(site.researchedAt)}
        </p>
      )}
    </article>
  );
}
