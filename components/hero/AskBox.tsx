"use client";

import { AnimatePresence, m } from "motion/react";
import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import type Fuse from "fuse.js";
import type { PlaceLite } from "@/lib/data";
import { categoryMeta } from "@/lib/categories";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

const chips = [
  { label: "Heritage walk", href: "/explore?cat=heritage" },
  { label: "Mayon views", href: "/explore?tag=mayon-view" },
  { label: "Food trip", href: "/eat" },
  { label: "Coffee crawl", href: "/cafes" },
  { label: "Night market", href: "/explore/daraga-night-market" },
  { label: "Where to stay", href: "/stay" },
];

/** Manus-style prompt: one big question, an input and suggestion chips. No LLM — Fuse.js over the dataset. */
export function AskBox({ places }: { places: PlaceLite[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [fuse, setFuse] = useState<Fuse<PlaceLite> | null>(null);
  const [active, setActive] = useState(-1);
  const listId = useId();

  useEffect(() => {
    if (!focused || fuse) return;
    import("fuse.js").then(({ default: F }) =>
      setFuse(new F(places, { keys: ["name", "tags", "short", "barangay"], threshold: 0.36, ignoreLocation: true })),
    );
  }, [focused, fuse, places]);

  const hits = useMemo(() => (q.trim() && fuse ? fuse.search(q, { limit: 5 }).map((r) => r.item) : []), [q, fuse]);
  const open = focused && hits.length > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && hits[active]) {
      router.push(`/explore/${hits[active].slug}`);
    } else if (q.trim()) {
      router.push(`/explore?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={submit} role="search" className="relative">
        <div
          className={cn(
            "rounded-[28px] border bg-white/90 p-2 shadow-lift backdrop-blur-xl transition-colors",
            focused ? "border-ash" : "border-line",
          )}
        >
          <label htmlFor="ask" className="sr-only">
            What do you want to experience in Daraga?
          </label>
          <div className="flex items-end gap-2">
            <textarea
              id="ask"
              rows={2}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setActive(-1);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) submit(e);
                if (e.key === "ArrowDown" && open) {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, hits.length - 1));
                }
                if (e.key === "ArrowUp" && open) {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, -1));
                }
              }}
              placeholder="Sunrise with Mayon, then Bicol Express for lunch…"
              className="max-h-40 min-h-14 flex-1 resize-none bg-transparent px-4 py-3 text-base outline-none placeholder:text-ash-ink"
              role="combobox"
              aria-expanded={open}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            />
            <button
              type="submit"
              disabled={!q.trim()}
              className="mr-1 mb-1 grid size-10 shrink-0 place-items-center rounded-full bg-ink text-paper transition-opacity disabled:opacity-30"
              aria-label="Search"
            >
              <ArrowUp aria-hidden className="size-5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <m.ul
              id={listId}
              role="listbox"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: motionTokens.dur.xs }}
              className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-3xl border border-line bg-white p-2 text-left shadow-lift"
            >
              {hits.map((p, i) => {
                const Icon = categoryMeta[p.category].icon;
                return (
                  <li key={p.id} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                    <Link
                      href={`/explore/${p.slug}`}
                      className={cn("flex items-center gap-3 rounded-2xl px-3 py-2", i === active ? "bg-abaca-soft" : "hover:bg-abaca-soft")}
                    >
                      <Icon aria-hidden className="size-4 text-ash-ink" />
                      <span className="text-sm font-medium">{p.name}</span>
                      <span className="ml-auto text-xs text-ash-ink">{categoryMeta[p.category].label}</span>
                    </Link>
                  </li>
                );
              })}
            </m.ul>
          )}
        </AnimatePresence>
      </form>

      <ul className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Suggestions">
        {chips.map((c, i) => (
          <m.li
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * motionTokens.stagger, duration: motionTokens.dur.md, ease: motionTokens.ease.out }}
          >
            <Link href={c.href} className="chip bg-white/80 backdrop-blur">
              {c.label}
            </Link>
          </m.li>
        ))}
      </ul>
    </div>
  );
}
