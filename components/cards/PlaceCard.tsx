import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import type { PlaceLite } from "@/lib/data";
import { categoryMeta } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { PlaceArt } from "./PlaceArt";
import { StatusBadges } from "./Badges";
import { FavoriteButton } from "./FavoriteButton";

export function PlaceCard({ place, className, compact = false }: { place: PlaceLite; className?: string; compact?: boolean }) {
  const meta = categoryMeta[place.category];
  return (
    <article
      className={cn(
        "group card relative flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative">
        <PlaceArt
          id={place.id}
          category={place.category}
          className={cn("w-full transition-transform duration-700 group-hover:scale-[1.03]", compact ? "aspect-[16/9]" : "aspect-[4/3]")}
        />
        <FavoriteButton id={place.id} name={place.name} className="absolute top-3 right-3 z-10" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="eyebrow">{meta.label}{place.priceBand ? ` · ${place.priceBand}` : ""}</p>
        <h3 className="font-display text-2xl leading-tight">
          <Link href={`/explore/${place.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {place.name}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-ash-ink">{place.short}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-ash-ink">
          {place.barangay && (
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden className="size-3.5" /> {place.barangay}
            </span>
          )}
          {place.hours && (
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden className="size-3.5" /> {place.hours}
            </span>
          )}
        </div>
        <StatusBadges place={place} />
      </div>
    </article>
  );
}
