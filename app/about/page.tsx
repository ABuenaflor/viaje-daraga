import type { Metadata } from "next";
import { contacts, site } from "@/lib/data";
import { fmt } from "@/lib/dates";
import { hostOf } from "@/lib/utils";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About Daraga",
  description: "Daraga, Albay: the International Gateway to Bicol and home of Cagsawa Ruins — profile, history, language, patron saint and contacts.",
  alternates: { canonical: "/about" },
};

const facts = [
  { k: "Land area", v: "11,860 ha" },
  { k: "Population", v: "133,893 (PSA 2020)" },
  { k: "Barangays", v: "54 — 28 urban, 26 rural" },
  { k: "Income class", v: "First-class municipality" },
  { k: "Languages", v: "Daragueño (East Miraya Bikol), Central Bikol, Filipino, English" },
  { k: "Patroness", v: "Nuestra Señora de la Porteria — feast on 8 September" },
];

const sources: { group: string; links: string[] }[] = [
  {
    group: "Official & government",
    links: [
      "https://daraga.gov.ph",
      "https://daraga.gov.ph/daraga-profile/",
      "https://daraga.gov.ph/tourism-daraga/",
      "https://daraga.gov.ph/events.html",
      "https://albay.gov.ph/tourist-spot/",
      "https://albay.gov.ph/local-food/",
      "https://hazardhunter.georisk.gov.ph/monitoring/volcano",
      "https://www.pna.gov.ph/articles/1216072",
      "https://www.pna.gov.ph/articles/1217679",
      "https://www.pna.gov.ph/articles/1036315",
      "https://www.pna.gov.ph/articles/1093946",
      "https://www.pna.gov.ph/articles/1272341",
      "https://ph.usembassy.gov/natural-disaster-alert-mayon-volcano-at-alert-level-3/",
    ],
  },
  {
    group: "News",
    links: [
      "https://newsinfo.inquirer.net/2176618/cagsawa-ruins-now-a-national-cultural-treasure",
      "https://tnt.abante.com.ph/2026/09/27/minor-strombolian-activity-naitala-sa-bulkang-mayon-3/news/",
      "https://interaksyon.philstar.com/trends-spotlights/2025/05/19/296577/albay-convenience-store-tourist-spot-mayon-volcano-view/",
      "https://www.rappler.com/philippines/202371-mass-budiao-ruins-first-time-204-years/",
    ],
  },
  {
    group: "Reference & travel",
    links: [
      "https://en.wikipedia.org/wiki/Daraga",
      "https://en.wikipedia.org/wiki/Daraga_Church",
      "https://en.wikipedia.org/wiki/Cagsawa_Ruins",
      "https://en.wikipedia.org/wiki/Bicol_International_Airport",
      "https://en.wikipedia.org/wiki/Mayon",
      "https://cagsawaruins.com/",
      "http://bicolanomythsofgodsandmonsters.blogspot.com/2026/07/bagong-rates-sa-cagsawa-ruins.html",
      "https://viajekita.com/blogs/",
      "https://www.openlenslife.com/atv-ride-green-lava-daraga-albay-mayon-volcano/",
      "https://www.klook.com/en-US/activity/19267-mount-mayon-skydrive-atv-manila/",
      "https://thepinaysolobackpacker.com/legazpi-itinerary/",
    ],
  },
];

const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Daraga"
        title={<>The International <span className="italic">Gateway to Bicol</span></>}
        lead="A first-class, landlocked municipality in south-western Albay — home of Cagsawa Ruins, and the only land route south to Sorsogon."
      />

      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="prose-site text-lg lg:col-span-7">
          <Reveal>
            <p>
              Daraga borders Legazpi City to the north, Sorsogon Province to the south, and Camalig and Jovellar to the west.
              As the only land route southward, it&apos;s a corridor for trade, commerce and tourism — and with Bicol International
              Airport inside its borders, a growing gateway for the whole region.
            </p>
            <p>
              Fertile volcanic soils from Mayon support rice, coconut and vegetables, the town&apos;s primary crops.
            </p>
            <h2 className="display !mt-10 !mb-3 text-3xl">The name</h2>
            <p>
              <em>Daraga</em> means “maiden” or “young unmarried woman” in Bikol languages; other accounts tie the name to a tree
              once abundant on the church hill. Over the centuries the town has also been called Budiao, Cagsawa, Salcedo and
              Locsin.
            </p>
            <h2 className="display !mt-10 !mb-3 text-3xl">A short history</h2>
            <p>
              Settlement here dates to the 12th century. Franciscan missionaries arrived in the late 1500s — the LGU cites 1587.
              Mayon&apos;s eruption on 1 February 1814 buried Cagsawa and nearby towns, and survivors resettled on higher ground at
              Daraga. The town was absorbed into Legazpi at various points and regained independence as a municipality in 1954.
            </p>
            <h2 className="display !mt-10 !mb-3 text-3xl">Living with Mayon</h2>
            <p>
              Albay is often called the “Vatican of Disasters”, and the LGU frames disaster-risk reduction as an investment
              rather than a cost. Programmes such as <em>SATouN Daraga</em> (Strengthened Alliance in Tourism Networks, for
              eco-tourism and cultural heritage), the <em>Viajeng Progreso</em> farmers&apos; market initiative, and Green Daraga /
              Zero Waste shape how the town welcomes visitors.
            </p>
          </Reveal>
        </div>

        <aside className="space-y-6 lg:col-span-5">
          <Reveal className="card p-6">
            <h2 className="eyebrow">At a glance</h2>
            <dl className="mt-3 divide-y divide-line">
              {facts.map((f) => (
                <div key={f.k} className="grid grid-cols-3 gap-3 py-3 text-sm">
                  <dt className="text-ash-ink">{f.k}</dt>
                  <dd className="col-span-2">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal className="rounded-2xl bg-basalt p-6 text-paper">
            <p className="eyebrow !text-paper/60">Official line</p>
            <p className="mt-2 font-display text-2xl italic">“{site.officialLine}”</p>
          </Reveal>
        </aside>
      </div>

      <section id="contacts" className="container-site scroll-mt-24 pt-20" aria-labelledby="contacts-h">
        <h2 id="contacts-h" className="display mb-6 text-4xl">Contacts & hotlines</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((c) => (
            <li key={c.id} className="card p-5">
              <p className="eyebrow">{c.group}</p>
              <p className="mt-1 font-medium">{c.name}</p>
              {c.address && <p className="mt-1 text-sm text-ash-ink">{c.address}</p>}
              <p className="mt-2 flex flex-wrap gap-x-3 text-sm tabular-nums">
                {c.phones.map((p) => (
                  <a key={p} href={tel(p)} className="underline decoration-line underline-offset-4 hover:decoration-ink">{p}</a>
                ))}
              </p>
              {c.email && (
                <a href={`mailto:${c.email}`} className="mt-1 block text-sm break-all underline decoration-line underline-offset-4 hover:decoration-ink">
                  {c.email}
                </a>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ash-ink">Official lines from daraga.gov.ph. Only business and government numbers are listed on this site.</p>
      </section>

      <section id="sources" className="container-site scroll-mt-24 pt-20" aria-labelledby="sources-h">
        <h2 id="sources-h" className="display text-4xl">Sources</h2>
        <p className="mt-2 max-w-2xl text-ash-ink">
          Research compiled {fmt(site.researchedAt)}. Prices, ratings and schedules are snapshots; every listing shows when it was
          last checked, and unconfirmed details are being reviewed with the Daraga Tourism Office.
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {sources.map((g) => (
            <div key={g.group}>
              <h3 className="eyebrow">{g.group}</h3>
              <ul className="mt-3 space-y-1.5 text-sm">
                {g.links.map((l) => (
                  <li key={l}>
                    <a href={l} target="_blank" rel="noreferrer" className="break-all underline decoration-line underline-offset-4 hover:decoration-ink">
                      {hostOf(l)}
                      {new URL(l).pathname.length > 1 ? new URL(l).pathname.replace(/\/$/, "") : ""}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
