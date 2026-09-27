import type { Metadata } from "next";
import { places, toLite } from "@/lib/data";
import { categories } from "@/data/schema";
import { PageHeader } from "@/components/site/PageHeader";
import { ExploreGrid } from "@/components/explore/ExploreGrid";

export const metadata: Metadata = {
  title: "Explore",
  description: "Every place to see, eat, sip and stay in Daraga, Albay — filter by vibe, category and barangay.",
  alternates: { canonical: "/explore" },
};

export default function ExplorePage() {
  const counts = new Map<string, number>();
  places.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  const tags = [...counts.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).map(([t]) => t);

  return (
    <>
      <PageHeader
        eyebrow="Explore"
        title={<>Everything worth a <span className="italic">detour</span></>}
        lead="Heritage, Mayon viewpoints, emerging spots, cafés, tambayan and stays — each with sources and the date we last checked."
      />
      <div className="container-site">
          <ExploreGrid
            places={places.map(toLite)}
            categories={categories.filter((c) => places.some((p) => p.category === c))}
            tags={tags}
          />
      </div>
    </>
  );
}
