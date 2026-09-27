import type { Metadata } from "next";
import { advisory, events, itineraryRoutes, places, site, toLite } from "@/lib/data";
import { MapExplorer } from "@/components/map/MapExplorer";

export const metadata: Metadata = {
  title: "Map",
  description: "Interactive map of Daraga, Albay — heritage, food, cafés, stays and the Mayon Permanent Danger Zone.",
  alternates: { canonical: "/map" },
};

export default function MapPage() {
  return (
    <MapExplorer
      places={places.map(toLite)}
      summit={site.mayonSummit}
      center={site.mapCenter}
      pdzKm={advisory.pdzKm}
      extendedKm={advisory.extendedZoneKm ?? null}
      itineraries={itineraryRoutes()}
      eventPlaceIds={[...new Set(events.map((e) => e.placeId).filter((x): x is string => !!x))]}
    />
  );
}
