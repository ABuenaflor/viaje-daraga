"use client";

import { AnimatePresence, m } from "motion/react";
import { CalendarDays, CornerDownLeft, Search, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type Fuse from "fuse.js";
import type { SearchIndex } from "@/lib/data";
import { categoryMeta } from "@/lib/categories";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Result = { key: string; title: string; subtitle: string; href: string; kind: "place" | "dish" | "event"; icon: React.ElementType };

function toResults(index: SearchIndex): Result[] {
  return [
    ...index.places.map((p) => ({
      key: `p-${p.id}`,
      title: p.name,
      subtitle: `${categoryMeta[p.category].label}${p.barangay ? ` · ${p.barangay}` : ""}`,
      href: `/explore/${p.slug}`,
      kind: "place" as const,
      icon: categoryMeta[p.category].icon,
    })),
    ...index.dishes.map((d) => ({
      key: `d-${d.id}`,
      title: d.name,
      subtitle: d.description,
      href: `/eat#${d.id}`,
      kind: "dish" as const,
      icon: Utensils,
    })),
    ...index.events.map((e) => ({
      key: `e-${e.id}`,
      title: e.name,
      subtitle: e.dateRule,
      href: `/events/${e.slug}`,
      kind: "event" as const,
      icon: CalendarDays,
    })),
  ];
}

export function CommandMenu({
  index,
  open,
  onOpenChange,
}: {
  index: SearchIndex;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [fuse, setFuse] = useState<Fuse<Result> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const all = useMemo(() => toResults(index), [index]);

  // ⌘K / Ctrl+K / "/" to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenChange]);

  // Load Fuse only when the palette is first opened.
  useEffect(() => {
    if (!open || fuse) return;
    import("fuse.js").then(({ default: F }) =>
      setFuse(new F(all, { keys: ["title", { name: "subtitle", weight: 0.4 }], threshold: 0.38, ignoreLocation: true })),
    );
  }, [open, fuse, all]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
  }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) return all.filter((r) => r.kind === "place").slice(0, 8);
    return fuse ? fuse.search(q, { limit: 10 }).map((r) => r.item) : [];
  }, [q, fuse, all]);

  const go = (r: Result) => {
    onOpenChange(false);
    setQ("");
    router.push(r.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      onOpenChange(false);
    } else if (e.key === "Tab") {
      e.preventDefault(); // keep focus in the dialog; arrows move the selection
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/30 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onOpenChange(false)}
        >
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Search Daraga"
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-line bg-paper shadow-lift"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: motionTokens.dur.sm, ease: motionTokens.ease.out }}
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              <Search aria-hidden className="size-5 text-ash" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Search places, food, events…"
                className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-ash-ink"
                role="combobox"
                aria-expanded="true"
                aria-controls="cmdk-list"
                aria-activedescendant={results[active] ? `cmdk-${results[active].key}` : undefined}
                aria-autocomplete="list"
              />
              <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 text-xs text-ash-ink sm:block">Esc</kbd>
            </div>
            <ul id="cmdk-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-ash-ink">No matches — try “church”, “coffee” or “sili”.</li>
              )}
              {results.map((r, i) => {
                const Icon = r.icon;
                return (
                  <li
                    key={r.key}
                    id={`cmdk-${r.key}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5",
                      i === active && "bg-abaca-soft",
                    )}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-ink ring-1 ring-line">
                      <Icon aria-hidden className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{r.title}</span>
                      <span className="block truncate text-xs text-ash-ink">{r.subtitle}</span>
                    </span>
                    {i === active && <CornerDownLeft aria-hidden className="size-4 text-ash" />}
                  </li>
                );
              })}
            </ul>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
