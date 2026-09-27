import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { getLocale, getTranslations } from "next-intl/server";
import { advisory, contacts, searchIndex, site } from "@/lib/data";
import { fmt } from "@/lib/dates";
import { Providers } from "@/components/site/Providers";
import { Nav, type NavLabels } from "@/components/site/Nav";
import { AdvisoryPill, type AdvisoryLabels } from "@/components/site/AdvisoryPill";
import { Footer } from "@/components/site/Footer";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description:
    "The visitor guide to Daraga, Albay: Cagsawa Ruins, Daraga Church, Mayon views, Bicolano food, cafés, stays, events and a live Mayon safety advisory.",
  openGraph: { type: "website", siteName: site.name, locale: "en_PH" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#F8F8F7",
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const mdrrmo = contacts.find((c) => c.id === "mdrrmo")?.phones[0] ?? null;
  const tNav = await getTranslations("nav");
  const tAdv = await getTranslations("advisory");
  const navKeys = ["explore", "map", "eat", "cafes", "stay", "events", "plan", "heritage", "about", "search", "menu", "close", "skip"] as const;
  const navLabels = Object.fromEntries(navKeys.map((k) => [k, tNav(k)])) as NavLabels;
  const advisoryLabels: AdvisoryLabels = {
    level: tAdv("level", { level: advisory.mayonAlertLevel }),
    noEntry: tAdv("noEntry", { km: advisory.pdzKm }),
    updated: tAdv("updated", { date: fmt(advisory.updatedAt) }),
    details: tAdv("details"),
    source: tAdv("source", { source: advisory.source }),
    collapse: tAdv("collapse"),
    expand: tAdv("expand"),
    verify: tAdv("verify"),
  };
  return (
    <html lang={locale === "fil" ? "fil" : "en"} className={`${inter.variable} ${serif.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
          <Providers>
          <Nav index={searchIndex()} labels={navLabels} />
          <AdvisoryPill advisory={advisory} mdrrmo={mdrrmo} labels={advisoryLabels} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
    </body>
    </html>
  );
}
