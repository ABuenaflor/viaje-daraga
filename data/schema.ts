import { z } from "zod";

export const categories = [
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
] as const;

export const CategorySchema = z.enum(categories);
export type Category = z.infer<typeof CategorySchema>;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}/, "ISO date expected");

export const CoordsSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const ImageSchema = z.object({
  src: z.string(),
  alt: z.string().min(1),
  credit: z.string().min(1),
  license: z.string().optional(),
});

export const PlaceSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: CategorySchema,
  tags: z.array(z.string()),
  barangay: z.string().nullable(),
  address: z.string().nullable(),
  coords: CoordsSchema.nullable(),
  plusCode: z.string().nullable().optional(),
  coordsVerified: z.boolean(),
  /** Near or inside the Mayon Permanent Danger Zone — shows a warning badge. */
  nearPdz: z.boolean().default(false),
  short: z.string().max(160),
  long: z.string(),
  highlights: z.array(z.string()),
  bestTime: z.string().nullable().optional(),
  hours: z.string().nullable().optional(),
  fees: z.array(z.object({ label: z.string(), php: z.number() })).nullable().optional(),
  feeNote: z.string().nullable().optional(),
  priceBand: z.enum(["₱", "₱₱", "₱₱₱"]).nullable().optional(),
  contact: z
    .object({
      phone: z.string().optional(),
      email: z.string().optional(),
      facebook: z.string().optional(),
      website: z.string().optional(),
    })
    .nullable()
    .optional(),
  rating: z
    .object({
      source: z.string(),
      value: z.number(),
      outOf: z.number(),
      count: z.number().optional(),
      asOf: z.string(),
    })
    .nullable()
    .optional(),
  safety: z.string().nullable().optional(),
  tips: z.array(z.string()).default([]),
  images: z.array(ImageSchema),
  status: z.enum(["open", "temporarily-closed", "verify"]),
  verifyNote: z.string().nullable().optional(),
  sources: z.array(z.string()),
  lastVerified: isoDate,
});
export type Place = z.infer<typeof PlaceSchema>;

export const EventSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  dateRule: z.string(),
  nextStart: isoDate.nullable().optional(),
  nextEnd: isoDate.nullable().optional(),
  /** true when nextStart/nextEnd are projected from the recurrence rule, not announced. */
  projected: z.boolean().default(false),
  venue: z.string(),
  placeId: z.string().optional(),
  summary: z.string(),
  long: z.string().optional(),
  highlights: z.array(z.string()),
  sources: z.array(z.string()),
  status: z.enum(["confirmed", "recurring", "ongoing", "verify"]),
  scope: z.enum(["daraga", "nearby"]).default("daraga"),
});
export type EventItem = z.infer<typeof EventSchema>;

export const DishSchema = z.object({
  id: z.string(),
  name: z.string(),
  localName: z.string().optional(),
  type: z.enum(["dish", "delicacy", "pasalubong", "dessert", "drink"]),
  description: z.string(),
  whereToTry: z.array(z.string()),
  whereNote: z.string().optional(),
  spiceLevel: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).optional(),
});
export type Dish = z.infer<typeof DishSchema>;

export const ItinerarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  days: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      stops: z.array(
        z.object({
          time: z.string().nullable(),
          placeId: z.string().nullable(),
          label: z.string(),
          note: z.string(),
        }),
      ),
    }),
  ),
});
export type Itinerary = z.infer<typeof ItinerarySchema>;

export const AdvisorySchema = z.object({
  mayonAlertLevel: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  pdzKm: z.number(),
  extendedZoneKm: z.number().nullable().optional(),
  summary: z.string(),
  source: z.string(),
  sourceUrl: z.string(),
  updatedAt: isoDate,
  needsVerification: z.boolean().default(false),
});
export type Advisory = z.infer<typeof AdvisorySchema>;

export const ContactSchema = z.object({
  id: z.string(),
  name: z.string(),
  group: z.enum(["tourism", "government", "emergency", "utility"]),
  phones: z.array(z.string()),
  email: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
});
export type Contact = z.infer<typeof ContactSchema>;

export const SiteSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  officialLine: z.string(),
  url: z.string(),
  lguUrl: z.string(),
  mayonSummit: CoordsSchema,
  mapCenter: CoordsSchema,
  /** Public URL of a .splinecode scene. null keeps the static poster hero. */
  splineScene: z.string().nullable(),
  stats: z.array(z.object({ value: z.number(), label: z.string(), prefix: z.string().optional() })),
  phrases: z.array(z.object({ bikol: z.string(), meaning: z.string() })),
  researchedAt: isoDate,
});
export type Site = z.infer<typeof SiteSchema>;
