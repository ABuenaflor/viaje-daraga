import type { MetadataRoute } from "next";
import { events, places, site } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/explore",
    "/map",
    "/eat",
    "/cafes",
    "/stay",
    "/events",
    "/plan",
    "/plan/itineraries",
    "/heritage/1814",
    "/about",
    "/advisory",
  ];
  return [
    ...staticRoutes.map((r) => ({ url: `${site.url}${r}`, changeFrequency: "weekly" as const, priority: r === "" ? 1 : 0.8 })),
    ...places.map((p) => ({ url: `${site.url}/explore/${p.slug}`, lastModified: p.lastVerified, priority: 0.6 })),
    ...events.map((e) => ({ url: `${site.url}/events/${e.slug}`, priority: 0.6 })),
  ];
}
