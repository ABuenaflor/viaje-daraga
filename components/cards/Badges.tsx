import { CircleDashed, Clock, TriangleAlert } from "lucide-react";
import type { Place } from "@/data/schema";
import { cn } from "@/lib/utils";

type BadgeFields = Pick<Place, "status" | "nearPdz" | "coordsVerified" | "coords">;

export function StatusBadges({ place, className, withLocation = false }: { place: BadgeFields; className?: string; withLocation?: boolean }) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {place.nearPdz && (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-800 ring-1 ring-red-200">
          <TriangleAlert aria-hidden className="size-3" /> Near Mayon danger zone
        </span>
      )}
      {place.status === "temporarily-closed" && (
        <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-xs font-medium text-paper">
          <Clock aria-hidden className="size-3" /> Temporarily closed
        </span>
      )}
      {place.status === "verify" && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-amber-200">
          Unconfirmed
        </span>
      )}
      {withLocation && place.coords && !place.coordsVerified && (
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs text-ash-ink ring-1 ring-line ring-dashed">
          <CircleDashed aria-hidden className="size-3" /> Location approximate
        </span>
      )}
    </div>
  );
}
