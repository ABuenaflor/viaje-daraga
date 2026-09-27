import type { Metadata } from "next";
import { placesIn, toLite } from "@/lib/data";
import { PageHeader } from "@/components/site/PageHeader";
import { ExploreGrid } from "@/components/explore/ExploreGrid";

export const metadata: Metadata = {
  title: "Stay",
  description: "Well-reviewed hotels and inns in Daraga, Albay — near the church, near Cagsawa, with Mayon views, and on a budget.",
  alternates: { canonical: "/stay" },
};

export default function StayPage() {
  const hotels = placesIn("hotel");
  const tags = [...new Set(hotels.flatMap((p) => p.tags))];
  return (
    <>
      <PageHeader
        eyebrow="Stay"
        title={<>Wake up <span className="italic">to Mayon</span></>}
        lead="Good-review picks, from budget inns to rooftop Mayon views — plus a hilltop option in nearby Legazpi."
      />
      <section className="container-site" aria-label="Hotels and inns">
        <ExploreGrid places={hotels.map(toLite)} tags={tags} syncUrl={false} />
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ash-ink">
          Ratings are snapshots from the listed source on the date shown — check current reviews and prices on the
          hotel&apos;s own site or your booking app. We don&apos;t take commissions, and listings marked “Unconfirmed” are still
          being checked with the tourism office.
        </p>
      </section>
    </>
  );
}
