"use client";

import { m, useAnimationControls } from "motion/react";
import { Heart } from "lucide-react";
import { useCallback, useSyncExternalStore } from "react";
import { cn, safeStorage } from "@/lib/utils";

const KEY = "vd-favourites";
const listeners = new Set<() => void>();

function read(): string[] {
  try {
    return JSON.parse(safeStorage.get("local", KEY) ?? "[]");
  } catch {
    return [];
  }
}
let cache: string[] | null = null;
function snapshot() {
  cache ??= read();
  return cache;
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function toggle(id: string) {
  const cur = snapshot();
  cache = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  safeStorage.set("local", KEY, JSON.stringify(cache));
  listeners.forEach((l) => l());
}
const empty: string[] = [];

export function useFavourites() {
  return useSyncExternalStore(subscribe, snapshot, () => empty);
}

export function FavoriteButton({ id, name, className }: { id: string; name: string; className?: string }) {
  const favs = useFavourites();
  const on = favs.includes(id);
  const controls = useAnimationControls();

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggle(id);
      controls.start({ scale: [1, 1.35, 0.9, 1], transition: { duration: 0.45 } });
    },
    [id, controls],
  );

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from saved` : `Save ${name}`}
      className={cn(
        "grid size-9 place-items-center rounded-full bg-white/85 text-ink shadow-soft backdrop-blur transition-colors hover:bg-white",
        className,
      )}
    >
      <m.span animate={controls} className="grid place-items-center">
        <Heart aria-hidden className={cn("size-4", on && "fill-sili text-sili")} />
      </m.span>
    </button>
  );
}
