"use client";

import { AnimatePresence, m } from "motion/react";
import { ArrowUpRight, CircleDashed, LocateFixed, MapPinOff, Navigation, Route, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Category } from "@/data/schema";
import { categoryMeta } from "@/lib/categories";
import { directionsUrl, distanceKm, formatKm, searchUrl, type LatLng } from "@/lib/geo";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { StatusBadges } from "@/components/cards/Badges";
import { ShareButton } from "@/components/cards/ShareButton";
import { LazyMap } from "./LazyMap";
import type { ItineraryRoute, PlaceLite } from "@/lib/data";

const layerOrder: Category[] = [
  "heritage",
  "nature-adventure",
  "emerging",
  "restaurant",
  "cafe",
  "tambayan",
  "hotel",
  "transport",
  "service",
  "day-trip",
];

export function MapExplorer({
  places,
  summit,
  center,
  pdzKm,
  extendedKm,
  itineraries,
  eventPlaceIds,
}: {
  places: PlaceLite[];
  summit: LatLng;
  center: LatLng;
  pdzKm: number;
  extendedKm: number | null;
  itineraries: ItineraryRoute[];
  eventPlaceIds: string[];
}) {
  const router = useRouter();
  const [active, setActive] = useState<Set<Category>>(() => new Set());
  const [eventsOnly, setEventsOnly] = useState(false);
  const [showPdz, setShowPdz] = useState(true);
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [user, setUser] = useState<LatLng | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [itin, setItin] = useState<string>("");
  const [day, setDay] = useState(1);
  const listRef = useRef<HTMLUListElement>(null);
  const [hydrated, setHydrated] = useState(false);

  // Read ?place=&itinerary=&cat= after mount so /map stays statically rendered.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const c = sp.get("cat") as Category | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL
    if (c && c in categoryMeta) setActive(new Set([c]));
    setSelectedId(sp.get("place"));
    setItin(sp.get("itinerary") ?? "");
    setHydrated(true);
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return places.filter(
      (p) =>
        (active.size === 0 || active.has(p.category)) &&
        (!eventsOnly || eventPlaceIds.includes(p.id)) &&
        (!needle ||
          p.name.toLowerCase().includes(needle) ||
          p.tags.some((t) => t.includes(needle)) ||
          (p.barangay ?? "").toLowerCase().includes(needle)),
    );
  }, [places, active, eventsOnly, eventPlaceIds, q]);

  const pinned = useMemo(() => {
    const list = filtered.filter((p) => p.coords);
    if (user) {
      return list
        .map((p) => ({ p, km: distanceKm(user, p.coords!) }))
        .sort((a, b) => a.km - b.km);
    }
    return list.map((p) => ({ p, km: null as number | null }));
  }, [filtered, user]);
  const unpinned = filtered.filter((p) => !p.coords);

  const selected = places.find((p) => p.id === selectedId) ?? null;
  const itinerary = itineraries.find((i) => i.slug === itin) ?? null;
  const route = itinerary?.days.find((d) => d.day === day)?.stops ?? null;

  // Keep URL shareable without adding history entries.
  useEffect(() => {
    if (!hydrated) return;
    const sp = new URLSearchParams();
    if (selectedId) sp.set("place", selectedId);
    if (itin) sp.set("itinerary", itin);
    const qs = sp.toString();
    router.replace(qs ? `/map?${qs}` : "/map", { scroll: false });
  }, [selectedId, itin, hydrated, router]);

  const toggle = (c: Category) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });

  const locate = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Location isn't available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUser({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGeoError("Couldn't get your location. Check your browser's permission."),
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  const onListKey = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement>) => {
      const items = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>("[data-place]") ?? []);
      const i = items.findIndex((el) => el === document.activeElement);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const next = e.key === "ArrowDown" ? Math.min(i + 1, items.length - 1) : Math.max(i - 1, 0);
        items[next]?.focus();
        setHoveredId(items[next]?.dataset.place ?? null);
      } else if (e.key === "Escape") {
        setSelectedId(null);
      }
    },
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="grid lg:h-[calc(100dvh-4rem)] lg:grid-cols-[400px_1fr]">
      {/* Panel */}
      <aside className="order-2 flex min-h-0 flex-col border-line bg-paper lg:order-1 lg:border-r" aria-label="Places list">
        <div className="space-y-3 border-b border-line p-4">
          <h1 className="display text-3xl">Map of Daraga</h1>
          <label className="flex items-center gap-2 rounded-full border border-line bg-white px-3">
            <Search aria-hidden className="size-4 text-ash" />
            <span className="sr-only">Filter places</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter by name, tag or barangay"
              className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-ash-ink"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} aria-label="Clear filter">
                <X aria-hidden className="size-4 text-ash" />
              </button>
            )}
          </label>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Layers">
            {layerOrder.map((c) => {
              const Icon = categoryMeta[c].icon;
              return (
                <button key={c} type="button" className="chip !py-1 !text-xs" aria-pressed={active.has(c)} onClick={() => toggle(c)}>
                  <Icon aria-hidden className="size-3.5" /> {categoryMeta[c].plural}
                </button>
              );
            })}
            <button type="button" className="chip !py-1 !text-xs" aria-pressed={eventsOnly} onClick={() => setEventsOnly((v) => !v)}>
              Event venues
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button type="button" className="chip !py-1 !text-xs" aria-pressed={showPdz} onClick={() => setShowPdz((v) => !v)}>
              <span className="hatch inline-block size-3 rounded-sm text-red-700 ring-1 ring-red-700" aria-hidden />
              {pdzKm}-km PDZ
            </button>
            <button type="button" className="chip !py-1 !text-xs" onClick={locate} aria-pressed={!!user}>
              <LocateFixed aria-hidden className="size-3.5" /> Near me
            </button>
            <label className="chip !py-1 !text-xs">
              <Route aria-hidden className="size-3.5" />
              <span className="sr-only">Itinerary route</span>
              <select
                value={itin}
                onChange={(e) => {
                  setItin(e.target.value);
                  setDay(1);
                }}
                className="bg-transparent outline-none"
              >
                <option value="">Itinerary route…</option>
                {itineraries.map((i) => (
                  <option key={i.slug} value={i.slug}>{i.title}</option>
                ))}
              </select>
            </label>
            {itinerary && itinerary.days.length > 1 && (
              <div className="flex gap-1" role="group" aria-label="Day">
                {itinerary.days.map((d) => (
                  <button key={d.day} type="button" className="chip !py-1 !text-xs" aria-pressed={day === d.day} onClick={() => setDay(d.day)}>
                    Day {d.day}
                  </button>
                ))}
              </div>
            )}
          </div>
          {geoError && <p className="text-xs text-sili" role="alert">{geoError}</p>}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto" data-lenis-prevent>
          <p className="px-4 pt-3 text-xs text-ash-ink" aria-live="polite">
            {pinned.length} on the map{unpinned.length ? ` · ${unpinned.length} not yet pinned` : ""}
            {user ? " · sorted by distance" : ""}
          </p>
          <ul ref={listRef} onKeyDown={onListKey} className="space-y-1 p-2">
            {pinned.map(({ p, km }) => {
              const Icon = categoryMeta[p.category].icon;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    data-place={p.id}
                    onClick={() => setSelectedId(p.id)}
                    onMouseEnter={() => setHoveredId(p.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(p.id)}
                    aria-current={selectedId === p.id ? "true" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-[background-color,transform]",
                      selectedId === p.id ? "bg-white shadow-soft ring-1 ring-ink" : "hover:bg-white",
                      hoveredId === p.id && selectedId !== p.id && "-translate-y-0.5 bg-white shadow-soft",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-full text-white",
                        !p.coordsVerified && "border-2 border-dashed border-ink bg-white !text-ink",
                      )}
                      style={p.coordsVerified ? { backgroundColor: categoryMeta[p.category].color } : undefined}
                    >
                      <Icon aria-hidden className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{p.name}</span>
                      <span className="block truncate text-xs text-ash-ink">
                        {categoryMeta[p.category].label}
                        {p.barangay ? ` · ${p.barangay}` : ""}
                        {!p.coordsVerified ? " · approximate" : ""}
                      </span>
                    </span>
                    {km !== null && <span className="text-xs text-ash-ink tabular-nums">{formatKm(km)}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
          {unpinned.length > 0 && (
            <div className="border-t border-line p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-medium">
                <MapPinOff aria-hidden className="size-4 text-ash" /> Not yet pinned
              </h2>
              <p className="mt-1 text-xs text-ash-ink">
                We don&apos;t have confirmed locations for these yet — ask the tourism office, or search Google Maps.
              </p>
              <ul className="mt-3 space-y-1">
                {unpinned.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-white">
                    <Link href={`/explore/${p.slug}`} className="min-w-0 truncate hover:underline">
                      {p.name}
                    </Link>
                    <a
                      href={searchUrl(`${p.name} Daraga Albay`)}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-xs text-ash-ink underline underline-offset-2"
                    >
                      Search<span className="sr-only"> {p.name} on Google Maps</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      {/* Map */}
      <div className="relative order-1 h-[60dvh] lg:order-2 lg:h-auto">
        <LazyMap
          eager
          className="size-full"
          label="Interactive map of Daraga attractions"
          places={filtered}
          summit={summit}
          center={center}
          zoom={11.8}
          pitch={20}
          pdzKm={pdzKm}
          extendedKm={extendedKm}
          showPdz={showPdz}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={setSelectedId}
          onHover={setHoveredId}
          route={route}
          user={user}
          cluster={!route}
        />

        <div className="pointer-events-none absolute top-3 left-3 hidden rounded-2xl bg-white/90 p-3 text-xs shadow-soft backdrop-blur sm:block">
          <p className="mb-1.5 font-medium">Legend</p>
          <p className="flex items-center gap-2"><span className="size-3 rounded-full bg-ink ring-2 ring-white" /> Confirmed location</p>
          <p className="mt-1 flex items-center gap-2"><CircleDashed aria-hidden className="size-3.5" /> Approximate location</p>
          <p className="mt-1 flex items-center gap-2"><span className="hatch inline-block size-3 rounded-sm text-red-700 ring-1 ring-red-700" /> Permanent Danger Zone</p>
        </div>

        <AnimatePresence>
          {selected && (
            <m.div
              key={selected.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: motionTokens.dur.sm, ease: motionTokens.ease.out }}
              className="absolute inset-x-3 bottom-20 z-10 sm:right-auto sm:bottom-6 sm:left-6 sm:w-96 lg:bottom-6"
              role="dialog"
              aria-label={selected.name}
            >
              <div className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">
                      {categoryMeta[selected.category].label}
                      {selected.barangay ? ` · ${selected.barangay}` : ""}
                      {selected.priceBand ? ` · ${selected.priceBand}` : ""}
                    </p>
                    <h2 className="mt-1 font-display text-2xl leading-tight">{selected.name}</h2>
                  </div>
                  <button type="button" onClick={() => setSelectedId(null)} aria-label="Close" className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-abaca-soft">
                    <X aria-hidden className="size-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-ash-ink">{selected.short}</p>
                <p className="mt-2 text-xs text-ash-ink">{selected.hours ?? "Hours: ask the tourism office"}</p>
                <StatusBadges place={selected} withLocation className="mt-3" />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/explore/${selected.slug}`} className="btn-dark !px-4 !py-2">
                    Details <ArrowUpRight aria-hidden className="size-4" />
                  </Link>
                  {selected.coords && (
                    <a href={directionsUrl(selected.coords)} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2">
                      <Navigation aria-hidden className="size-4" /> Directions
                    </a>
                  )}
                  <ShareButton title={selected.name} path={`/map?place=${selected.id}`} className="!px-4 !py-2" />
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
