"use client";

import { AnimatePresence, m } from "motion/react";
import { Heart, Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type Fuse from "fuse.js";
import type { Category } from "@/data/schema";
import type { PlaceLite } from "@/lib/data";
import { categoryMeta, prettyTag } from "@/lib/categories";
import { motionTokens } from "@/lib/motion";
import { PlaceCard } from "@/components/cards/PlaceCard";
import { useFavourites } from "@/components/cards/FavoriteButton";

export function ExploreGrid({
  places,
  categories,
  tags,
  syncUrl = true,
  emptyHint,
}: {
  places: PlaceLite[];
  categories?: Category[];
  tags: string[];
  syncUrl?: boolean;
  emptyHint?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [cat, setCat] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [q, setQ] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [fuse, setFuse] = useState<Fuse<PlaceLite> | null>(null);
  const favs = useFavourites();

  useEffect(() => {
    if (!q || fuse) return;
    import("fuse.js").then(({ default: F }) =>
      setFuse(new F(places, { keys: ["name", "tags", "short", "barangay", "category"], threshold: 0.36, ignoreLocation: true })),
    );
  }, [q, fuse, places]);

  // Apply ?cat=&tag=&q= after mount so the page itself stays statically rendered.
  useEffect(() => {
    if (!syncUrl) return;
    const sp = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL
    setCat(sp.get("cat") ?? "");
    setTag(sp.get("tag") ?? "");
    setQ(sp.get("q") ?? "");
    setHydrated(true);
  }, [syncUrl]);

  useEffect(() => {
    if (!syncUrl || !hydrated) return;
    const sp = new URLSearchParams();
    if (cat) sp.set("cat", cat);
    if (tag) sp.set("tag", tag);
    if (q) sp.set("q", q);
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [cat, tag, q, syncUrl, hydrated, router, pathname]);

  const results = useMemo(() => {
    let list = places;
    if (q.trim()) list = fuse ? fuse.search(q).map((r) => r.item) : list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (cat) list = list.filter((p) => p.category === cat);
    if (tag) list = list.filter((p) => p.tags.includes(tag));
    if (savedOnly) list = list.filter((p) => favs.includes(p.id));
    return list;
  }, [places, q, fuse, cat, tag, savedOnly, favs]);

  const reset = () => {
    setCat("");
    setTag("");
    setQ("");
    setSavedOnly(false);
  };

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 mb-8 border-b border-line bg-paper/85 px-4 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-3xl sm:border sm:px-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex min-w-60 flex-1 items-center gap-2 rounded-full border border-line bg-white px-3">
              <Search aria-hidden className="size-4 text-ash" />
              <span className="sr-only">Search</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, vibe or barangay"
                className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-ash-ink"
              />
            </label>
            <button type="button" className="chip" aria-pressed={savedOnly} onClick={() => setSavedOnly((v) => !v)}>
              <Heart aria-hidden className="size-3.5" /> Saved ({favs.length})
            </button>
            {(cat || tag || q || savedOnly) && (
              <button type="button" className="chip" onClick={reset}>
                <X aria-hidden className="size-3.5" /> Clear
              </button>
            )}
          </div>
          {categories && categories.length > 1 && (
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Category">
              <button type="button" className="chip shrink-0" aria-pressed={!cat} onClick={() => setCat("")}>
                All
              </button>
              {categories.map((c) => {
                const Icon = categoryMeta[c].icon;
                return (
                  <button key={c} type="button" className="chip shrink-0" aria-pressed={cat === c} onClick={() => setCat(cat === c ? "" : c)}>
                    <Icon aria-hidden className="size-3.5" /> {categoryMeta[c].plural}
                  </button>
                );
              })}
            </div>
          )}
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Tags">
            {tags.map((t) => (
              <button key={t} type="button" className="chip shrink-0 !py-1 !text-xs" aria-pressed={tag === t} onClick={() => setTag(tag === t ? "" : t)}>
                {prettyTag(t)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm text-ash-ink" aria-live="polite">
        {results.length} {results.length === 1 ? "place" : "places"}
      </p>

      {results.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-display text-3xl">Nothing matches — yet.</p>
          <p className="mt-2 text-ash-ink">{emptyHint ?? "Try a different filter, or ask the tourism office for tips."}</p>
          <button type="button" className="btn-dark mt-6" onClick={reset}>
            Clear filters
          </button>
        </div>
      ) : (
        <m.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {results.map((p) => (
              <m.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: motionTokens.dur.md, ease: motionTokens.ease.out }}
              >
                <PlaceCard place={p} />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      )}
    </div>
  );
}
