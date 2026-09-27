import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPlace, toLite } from "@/lib/data";
import { EruptionIntro, ScrollText, Timeline } from "@/components/heritage/Story1814";
import { PlaceCard } from "@/components/cards/PlaceCard";
import { Reveal } from "@/components/motion/Reveal";
import { stagger } from "@/lib/motion";

export const metadata: Metadata = {
  title: "1814: the eruption",
  description: "How Mayon's eruption on 1 February 1814 buried Cagsawa and Budiao, and how survivors built modern Daraga on the hill.",
  alternates: { canonical: "/heritage/1814" },
};

const timeline = [
  { year: "1100s", title: "Early settlement", body: "Communities are living in the area by the 12th century." },
  { year: "1587", title: "The Franciscans arrive", body: "The LGU dates the Franciscan mission to 1587, in the late 1500s." },
  { year: "1724", title: "Cagsawa church rebuilt", body: "The Franciscan church complex of Cagsawa is rebuilt — the church whose belfry still stands." },
  { year: "1773", title: "A church on the hill", body: "The Franciscans build a church on a hill at Daraga, then still a visita (chapel-town) of Cagsawa." },
  { year: "1786", title: "Budiao becomes a pueblo", body: "Budiao is established as a town by decree, with its own church." },
  { year: "1814", title: "Mayon erupts", body: "On 1 February, Mayon's eruption buries Cagsawa, Budiao and nearby towns. More than 1,200 people die. Survivors resettle on higher ground at Daraga." },
  { year: "1854", title: "Our Lady of the Gate", body: "Daraga's hilltop church — now the main parish — is consecrated to Nuestra Señora de la Porteria." },
  { year: "1954", title: "A municipality again", body: "After periods of being absorbed into Legazpi, Daraga regains independence as a municipality." },
  { year: "2007", title: "Daraga Church honoured", body: "Daraga Church is declared a National Cultural Treasure." },
  { year: "2012", title: "Cagsawa Festival begins", body: "A month-long February festival celebrating Albayano resilience." },
  { year: "2015", title: "Cagsawa honoured", body: "Cagsawa Ruins are declared a National Cultural Treasure." },
  { year: "2018", title: "Budiao uncovered", body: "UP archaeologists begin excavating Budiao, and the first Mass in over two centuries is held among the ruins." },
  { year: "2026", title: "Three treasures", body: "Cagsawa's National Cultural Treasure marker is unveiled on 1 February; the National Museum cites Daraga's three National Cultural Treasures." },
];

export default function Heritage1814() {
  const sites = ["cagsawa-ruins", "budiao-ruins", "daraga-church"].map((id) => toLite(getPlace(id)!));
  return (
    <div className="-mt-16">
      <EruptionIntro />

      <section className="container-site py-24 md:py-32">
        <ScrollText
          className="display max-w-5xl text-4xl leading-[1.15] md:text-6xl"
          text="Cagsawa was a busy Franciscan town at the foot of Mayon. On the first morning of February 1814, the volcano erupted. Cagsawa, Budiao and nearby towns were buried, and more than twelve hundred people died."
        />
      </section>

      <section className="bg-basalt py-24 text-paper md:py-32">
        <div className="container-site">
          <ScrollText
            className="display max-w-5xl text-4xl leading-[1.15] md:text-6xl"
            text="Those who survived climbed to higher ground — to the hill at Daraga, where a stone church had stood since 1773. It became the town's new heart, and it still is."
          />
          <Reveal className="mt-14 grid gap-6 text-paper/80 md:grid-cols-2">
            <p className="text-lg leading-relaxed">
              Today, Cagsawa&apos;s belfry rises from the rice fields with Mayon behind it — a ruin, but also a reminder that
              people here rebuilt. The Cagsawa Festival opens every 1 February to celebrate that resilience, not the disaster.
            </p>
            <p className="text-lg leading-relaxed">
              Two centuries later, archaeologists are still learning from Budiao, the other town the eruption buried, just
              7.5 km from the crater.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-site py-24" aria-labelledby="timeline">
        <h2 id="timeline" className="display mb-14 text-5xl md:text-6xl">Timeline</h2>
        <Timeline items={timeline} />
      </section>

      <section className="container-site" aria-labelledby="walk">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 id="walk" className="display text-5xl">Walk the story</h2>
          <Link href="/plan/itineraries" className="btn-ghost">
            Plan the route <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
        <ul className="grid gap-5 md:grid-cols-3">
          {sites.map((p, i) => (
            <Reveal as="li" key={p.id} delay={stagger(i)}>
              <PlaceCard place={p} />
            </Reveal>
          ))}
        </ul>
        <p className="mt-8 text-xs text-ash-ink">
          Sources: Wikipedia (Cagsawa Ruins, Daraga Church, Daraga), daraga.gov.ph, Philippine News Agency, Rappler, Inquirer.
          See <Link href="/about#sources" className="underline underline-offset-2">all sources</Link>.
        </p>
      </section>
    </div>
  );
}
