import "server-only";
import { z } from "zod";
import placesJson from "@/data/places.json";
import eventsJson from "@/data/events.json";
import dishesJson from "@/data/dishes.json";
import itinerariesJson from "@/data/itineraries.json";
import advisoryJson from "@/data/advisory.json";
import contactsJson from "@/data/contacts.json";
import siteJson from "@/data/site.json";
import {
  AdvisorySchema,
  ContactSchema,
  DishSchema,
  EventSchema,
  ItinerarySchema,
  PlaceSchema,
  SiteSchema,
  type Category,
  type Place,
} from "@/data/schema";
import { distanceKm } from "@/lib/geo";

// Parsing at module load means a malformed JSON edit fails `next build` loudly.
function parse<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid data in ${file}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const places = parse(z.array(PlaceSchema), placesJson, "data/places.json");
export const events = parse(z.array(EventSchema), eventsJson, "data/events.json");
export const dishes = parse(z.array(DishSchema), dishesJson, "data/dishes.json");
export const itineraries = parse(z.array(ItinerarySchema), itinerariesJson, "data/itineraries.json");
export const advisory = parse(AdvisorySchema, advisoryJson, "data/advisory.json");
export const contacts = parse(z.array(ContactSchema), contactsJson, "data/contacts.json");
export const site = parse(SiteSchema, siteJson, "data/site.json");

// Referential integrity: every id referenced from another file must exist.
const placeIds = new Set(places.map((p) => p.id));
for (const d of dishes) {
  for (const id of d.whereToTry) {
    if (!placeIds.has(id)) throw new Error(`dishes.json: ${d.id} references unknown place "${id}"`);
  }
}
for (const it of itineraries) {
  for (const day of it.days) {
    for (const s of day.stops) {
      if (s.placeId && !placeIds.has(s.placeId)) {
        throw new Error(`itineraries.json: ${it.id} references unknown place "${s.placeId}"`);
      }
    }
  }
}
for (const e of events) {
  if (e.placeId && !placeIds.has(e.placeId)) {
    throw new Error(`events.json: ${e.id} references unknown place "${e.placeId}"`);
  }
}

export function getPlace(idOrSlug: string): Place | undefined {
  return places.find((p) => p.slug === idOrSlug || p.id === idOrSlug);
}

export function placesIn(...cats: Category[]): Place[] {
  return places.filter((p) => cats.includes(p.category));
}

export function nearbyPlaces(place: Place, limit = 4): (Place & { km: number | null })[] {
  const others = places.filter((p) => p.id !== place.id && p.category !== "day-trip");
  if (place.coords) {
    const withCoords = others
      .filter((p) => p.coords)
      .map((p) => ({ ...p, km: distanceKm(place.coords!, p.coords!) }))
      .sort((a, b) => a.km - b.km);
    if (withCoords.length >= limit) return withCoords.slice(0, limit);
  }
  // Fall back to same barangay, then same category.
  const sameBrgy = others.filter((p) => place.barangay && p.barangay === place.barangay);
  const sameCat = others.filter((p) => p.category === place.category && !sameBrgy.includes(p));
  return [...sameBrgy, ...sameCat].slice(0, limit).map((p) => ({ ...p, km: null }));
}

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

/** Dated events sorted by next start, then undated ones. */
export function upcomingEvents() {
  return [...events].sort((a, b) => {
    if (a.nextStart && b.nextStart) return a.nextStart.localeCompare(b.nextStart);
    if (a.nextStart) return -1;
    if (b.nextStart) return 1;
    return 0;
  });
}

export function getItinerary(slug: string) {
  return itineraries.find((i) => i.slug === slug || i.id === slug);
}

/** Slim records for client-side search and map — keeps the client payload small. */
export type PlaceLite = Pick<
  Place,
  | "id"
  | "slug"
  | "name"
  | "category"
  | "tags"
  | "barangay"
  | "coords"
  | "coordsVerified"
  | "nearPdz"
  | "short"
  | "priceBand"
  | "hours"
  | "status"
>;

export function toLite(p: Place): PlaceLite {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    tags: p.tags,
    barangay: p.barangay,
    coords: p.coords,
    coordsVerified: p.coordsVerified,
    nearPdz: p.nearPdz,
    short: p.short,
    priceBand: p.priceBand ?? null,
    hours: p.hours ?? null,
    status: p.status,
  };
}

export function searchIndex() {
  return {
    places: places.map(toLite),
    dishes: dishes.map((d) => ({ id: d.id, name: d.name, description: d.description, type: d.type })),
    events: events.map((e) => ({ id: e.id, slug: e.slug, name: e.name, summary: e.summary, dateRule: e.dateRule })),
  };
}
export type SearchIndex = ReturnType<typeof searchIndex>;

export type RouteStop = { n: number; coords: { lat: number; lng: number }; label: string };
export type ItineraryRoute = { slug: string; title: string; days: { day: number; title: string; stops: RouteStop[] }[] };

/** Itineraries resolved to numbered map stops (stops without coordinates are skipped, numbering kept). */
export function itineraryRoutes(): ItineraryRoute[] {
  return itineraries.map((it) => ({
    slug: it.slug,
    title: it.title,
    days: it.days.map((d) => {
      const stops: RouteStop[] = [];
      d.stops.forEach((s, i) => {
        const p = s.placeId ? getPlace(s.placeId) : undefined;
        if (!p?.coords) return;
        const prev = stops.at(-1);
        // Collapse consecutive stops at the same spot (e.g. church → sunset on the church hill).
        if (prev && prev.coords.lat === p.coords.lat && prev.coords.lng === p.coords.lng) return;
        stops.push({ n: i + 1, coords: p.coords, label: s.label });
      });
      return { day: d.day, title: d.title, stops };
    }),
  }));
}
