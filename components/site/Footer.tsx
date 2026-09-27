import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { contacts, site } from "@/lib/data";
import { Logo } from "./Logo";

const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;

export async function Footer() {
  const t = await getTranslations("footer");
  const tourism = contacts.find((c) => c.id === "tourism");
  const hotlines = contacts.filter((c) => c.group === "emergency");

  return (
    <footer className="mt-24 bg-basalt text-paper/85">
      <div className="container-site grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/70">{t("tagline")}</p>
          <p className="mt-6 font-display text-2xl leading-snug text-paper italic">“{site.officialLine}”</p>
          <a
            href={site.lguUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-1 text-sm text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper"
          >
            {t("official")}: daraga.gov.ph <ArrowUpRight aria-hidden className="size-3.5" />
          </a>
        </div>

        {tourism && (
          <div className="md:col-span-3">
            <h2 className="eyebrow !text-paper/60">Tourism office</h2>
            <address className="mt-4 space-y-1.5 text-sm not-italic">
              <p>{tourism.address}</p>
              {tourism.phones.map((p) => (
                <p key={p}>
                  <a className="hover:text-paper" href={tel(p)}>{p}</a>
                </p>
              ))}
              {tourism.email && (
                <p>
                  <a className="break-all hover:text-paper" href={`mailto:${tourism.email}`}>{tourism.email}</a>
                </p>
              )}
            </address>
          </div>
        )}

        <div className="md:col-span-3">
          <h2 className="eyebrow !text-paper/60">{t("hotlines")}</h2>
          <ul className="mt-4 space-y-1.5 text-sm">
            {hotlines.map((c) => (
              <li key={c.id} className="flex justify-between gap-3">
                <span className="text-paper/70">{c.name.replace("Daraga ", "")}</span>
                <a className="shrink-0 font-medium text-paper tabular-nums" href={tel(c.phones[0])}>{c.phones[0]}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="eyebrow !text-paper/60">Visit</h2>
          <ul className="mt-4 space-y-1.5 text-sm">
            {[
              ["/plan", "Travel guide"],
              ["/plan/itineraries", "Itineraries"],
              ["/advisory", "Mayon advisory"],
              ["/about", "About Daraga"],
              ["/about#sources", "Sources"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link className="hover:text-paper" href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site space-y-2 py-6 text-xs leading-relaxed text-paper/55">
          <p>{t("disclaimer")}</p>
          <p>
            <span className="text-paper/70">{t("credits")}:</span> Map data © OpenStreetMap contributors, tiles by
            OpenFreeMap. Interaction patterns inspired by Skiper UI (skiper-ui.com) and rebuilt with Motion. Icons by
            Lucide (ISC). Place artwork is illustrative — photos will be added from LGU-provided or licensed sources
            with credit.
          </p>
        </div>
      </div>
    </footer>
  );
}
