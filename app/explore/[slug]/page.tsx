import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CircleDashed,
  Clock,
  Globe,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Star,
  Sunrise,
  Ticket,
  TriangleAlert,
} from "lucide-react";
import { advisory, getPlace, nearbyPlaces, places, site, toLite } from "@/lib/data";
import { categoryMeta, prettyTag } from "@/lib/categories";
import { directionsUrl, formatKm, searchUrl } from "@/lib/geo";
import { fmt } from "@/lib/dates";
import { hostOf, paragraphs } from "@/lib/utils";
import { PlaceArt } from "@/components/cards/PlaceArt";
import { StatusBadges } from "@/components/cards/Badges";
import { FavoriteButton } from "@/components/cards/FavoriteButton";
import { ShareButton } from "@/components/cards/ShareButton";
import { PlaceCard } from "@/components/cards/PlaceCard";
import { Reveal } from "@/components/motion/Reveal";
import { stagger } from "@/lib/motion";
import { LazyMap } from "@/components/map/LazyMap";

export const dynamicParams = false;

export function generateStaticParams() {
  return places.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/explore/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPlace(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.short,
    alternates: { canonical: `/explore/${p.slug}` },
    openGraph: { title: p.name, description: p.short },
  };
}

const schemaType: Partial<Record<string, string>> = {
  heritage: "LandmarksOrHistoricalBuildings",
  restaurant: "Restaurant",
  cafe: "CafeOrCoffeeShop",
  hotel: "Hotel",
  transport: "Airport",
  service: "GovernmentOffice",
};

function Fact({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-3.5">
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-ash" />
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-medium tracking-wide text-ash-ink uppercase">{label}</dt>
        <dd className="mt-0.5 text-sm">{children}</dd>
      </div>
    </div>
  );
}

const Unknown = () => <span className="text-ash-ink italic">Ask the tourism office</span>;

export default async function PlacePage({ params }: PageProps<"/explore/[slug]">) {
  const { slug } = await params;
  const p = getPlace(slug);
  if (!p) notFound();

  const meta = categoryMeta[p.category];
  const nearby = nearbyPlaces(p);
  const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": p.id === "bicol-airport" ? "Airport" : p.id === "pnr-daraga" ? "TrainStation" : schemaType[p.category] ?? "TouristAttraction",
    name: p.name,
    description: p.short,
    url: `${site.url}/explore/${p.slug}`,
    address: p.address
      ? { "@type": "PostalAddress", streetAddress: p.address, addressLocality: "Daraga", addressRegion: "Albay", addressCountry: "PH" }
      : undefined,
    geo: p.coords && p.coordsVerified ? { "@type": "GeoCoordinates", latitude: p.coords.lat, longitude: p.coords.lng } : undefined,
    telephone: p.contact?.phone,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="container-site pt-8">
        <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm text-ash-ink hover:text-ink">
          <ArrowLeft aria-hidden className="size-4" /> All places
        </Link>
      </div>

      <header className="container-site grid gap-8 pt-6 pb-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="eyebrow">
            <Link href={meta.href} className="hover:text-ink">{meta.label}</Link>
            {p.barangay ? ` · Brgy. ${p.barangay}` : ""}
            {p.priceBand ? ` · ${p.priceBand}` : ""}
          </p>
          <h1 className="display mt-3 text-5xl leading-[1.02] md:text-6xl">{p.name}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ash-ink">{p.short}</p>
          <StatusBadges place={p} withLocation className="mt-5" />
          <div className="mt-6 flex flex-wrap gap-2">
            {p.coords ? (
              <a href={directionsUrl(p.coords)} target="_blank" rel="noreferrer" className="btn-primary">
                <Navigation aria-hidden className="size-4" /> Directions
              </a>
            ) : (
              <a href={searchUrl(`${p.name} ${p.address ?? "Daraga Albay"}`)} target="_blank" rel="noreferrer" className="btn-primary">
                <MapPin aria-hidden className="size-4" /> Search on Google Maps
              </a>
            )}
            <ShareButton title={p.name} path={`/explore/${p.slug}`} />
            <FavoriteButton id={p.id} name={p.name} className="size-11 border border-line shadow-none" />
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-5">
          <figure>
            <PlaceArt id={p.id} category={p.category} className="aspect-[4/3] w-full rounded-3xl" />
            <figcaption className="mt-2 text-xs text-ash-ink">
              {p.images[0]
                ? `${p.images[0].credit}${p.images[0].license ? ` · ${p.images[0].license}` : ""}`
                : "Illustration — photo pending from the LGU or a licensed source."}
            </figcaption>
          </figure>
        </Reveal>
      </header>

      <div className="container-site grid gap-10 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-7">
          {p.safety && (
            <Reveal>
              <div role="note" className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-950">
                <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-red-700" />
                <div className="text-sm leading-relaxed">
                  <p className="font-semibold">Safety</p>
                  <p className="mt-1">{p.safety}</p>
                  {p.nearPdz && (
                    <p className="mt-2">
                      Mayon is at <strong>Alert Level {advisory.mayonAlertLevel}</strong> ({fmt(advisory.updatedAt)}).{" "}
                      <Link href="/advisory" className="underline underline-offset-2">See the advisory</Link>.
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          )}

          {p.verifyNote && (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              <strong>Being verified:</strong> {p.verifyNote}
            </p>
          )}

          <Reveal className="prose-site max-w-none text-lg">
            {paragraphs(p.long).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </Reveal>

          {p.highlights.length > 0 && (
            <Reveal>
              <h2 className="display text-3xl">Highlights</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-2 rounded-2xl bg-white p-4 text-sm ring-1 ring-line">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ember" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {p.tips.length > 0 && (
            <Reveal>
              <h2 className="display text-3xl">Tips</h2>
              <ul className="mt-4 space-y-2">
                {p.tips.map((t) => (
                  <li key={t} className="flex gap-3 text-ink/90">
                    <span className="font-display text-xl leading-none text-ember" aria-hidden>→</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {p.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Tags">
              {p.tags.map((t) => (
                <li key={t}>
                  <Link href={`/explore?tag=${t}`} className="chip !text-xs">{prettyTag(t)}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="space-y-6 lg:col-span-5">
          <Reveal className="card px-5">
            <dl className="divide-y divide-line">
              <Fact icon={Clock} label="Hours">{p.hours ?? <Unknown />}</Fact>
              <Fact icon={Ticket} label="Fees">
                {p.fees?.length ? (
                  <table className="w-full text-sm">
                    <caption className="sr-only">Fees in Philippine pesos</caption>
                    <tbody>
                      {p.fees.map((f) => (
                        <tr key={f.label}>
                          <th scope="row" className="py-0.5 pr-3 text-left font-normal">{f.label}</th>
                          <td className="py-0.5 text-right font-medium tabular-nums">₱{f.php.toLocaleString("en-PH")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : p.feeNote ? null : p.priceBand ? (
                  <span>Price band {p.priceBand}</span>
                ) : (
                  <Unknown />
                )}
                {p.feeNote && <p className="mt-2 text-xs leading-relaxed text-ash-ink">{p.feeNote}</p>}
              </Fact>
              {p.bestTime && <Fact icon={Sunrise} label="Best time">{p.bestTime}</Fact>}
              <Fact icon={MapPin} label="Address">
                {p.address ?? <Unknown />}
                {p.plusCode && <span className="mt-1 block text-xs text-ash-ink">Plus Code {p.plusCode}</span>}
              </Fact>
              {p.rating && (
                <Fact icon={Star} label="Rating snapshot">
                  {p.rating.value}/{p.rating.outOf} on {p.rating.source}
                  <span className="block text-xs text-ash-ink">as of {fmt(p.rating.asOf)}</span>
                </Fact>
              )}
              {p.contact && (
                <Fact icon={Phone} label="Contact">
                  <ul className="space-y-1">
                    {p.contact.phone && (
                      <li><a className="underline underline-offset-2" href={tel(p.contact.phone)}>{p.contact.phone}</a></li>
                    )}
                    {p.contact.email && (
                      <li className="flex items-center gap-1.5 break-all">
                        <Mail aria-hidden className="size-3.5 shrink-0" />
                        <a className="underline underline-offset-2" href={`mailto:${p.contact.email}`}>{p.contact.email}</a>
                      </li>
                    )}
                    {p.contact.website && (
                      <li className="flex items-center gap-1.5">
                        <Globe aria-hidden className="size-3.5 shrink-0" />
                        <a className="underline underline-offset-2" href={p.contact.website} target="_blank" rel="noreferrer">{hostOf(p.contact.website)}</a>
                      </li>
                    )}
                  </ul>
                </Fact>
              )}
            </dl>
          </Reveal>

          <Reveal className="card overflow-hidden">
            {p.coords ? (
              <>
                <LazyMap
                  className="h-72"
                  label={`Map showing ${p.name}`}
                  places={[toLite(p)]}
                  summit={site.mayonSummit}
                  center={p.coords}
                  zoom={p.id === "mayon-volcano" ? 10.5 : 14}
                  pdzKm={advisory.pdzKm}
                  extendedKm={advisory.extendedZoneKm}
                  showPdz={p.nearPdz || p.id === "cagsawa-ruins"}
                  cluster={false}
                  cooperative
                />
                <div className="flex items-center justify-between gap-2 p-4 text-sm">
                  <span className="flex items-center gap-1.5 text-ash-ink">
                    {!p.coordsVerified && <CircleDashed aria-hidden className="size-4" />}
                    {p.coordsVerified ? "Confirmed location" : "Location approximate"}
                  </span>
                  <Link href={`/map?place=${p.id}`} className="inline-flex items-center gap-1 font-medium hover:underline">
                    Open in full map <ArrowUpRight aria-hidden className="size-4" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="p-5 text-sm">
                <p className="font-medium">Not pinned on our map yet</p>
                <p className="mt-1 text-ash-ink">
                  We don&apos;t have a confirmed location for this place. Ask the Daraga Tourism Office for directions, or
                  search Google Maps.
                </p>
              </div>
            )}
          </Reveal>
        </aside>
      </div>

      {nearby.length > 0 && (
        <section className="container-site pt-20" aria-labelledby="nearby">
          <h2 id="nearby" className="display mb-6 text-4xl">{p.coords ? "Nearby" : "You might also like"}</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {nearby.map((n, i) => (
              <Reveal as="li" key={n.id} delay={stagger(i)} className="relative">
                <PlaceCard place={toLite(n)} compact />
                {n.km !== null && (
                  <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium shadow-soft">
                    {formatKm(n.km)}
                  </span>
                )}
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      <footer className="container-site pt-16">
        <div className="border-t border-line pt-6 text-xs text-ash-ink">
          <p>Last checked {fmt(p.lastVerified)}. Details can change — confirm with the business or the tourism office.</p>
          {p.sources.length > 0 && (
            <p className="mt-2">
              Sources:{" "}
              {p.sources.map((s, i) => (
                <span key={s}>
                  <a href={s} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">{hostOf(s)}</a>
                  {i < p.sources.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
          )}
        </div>
      </footer>
    </article>
  );
}
