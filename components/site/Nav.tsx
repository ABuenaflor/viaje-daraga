"use client";

import { AnimatePresence, m } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { SearchIndex } from "@/lib/data";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion";
import { CommandMenu } from "./CommandMenu";
import { Logo } from "./Logo";

const links = [
  { href: "/explore", key: "explore" },
  { href: "/map", key: "map" },
  { href: "/eat", key: "eat" },
  { href: "/cafes", key: "cafes" },
  { href: "/stay", key: "stay" },
  { href: "/events", key: "events" },
  { href: "/plan", key: "plan" },
  { href: "/heritage/1814", key: "heritage" },
] as const;

export type NavLabels = Record<"explore" | "map" | "eat" | "cafes" | "stay" | "events" | "plan" | "heritage" | "about" | "search" | "menu" | "close" | "skip", string>;

/** Labels arrive pre-translated from the server so no i18n runtime ships to the client. */
export function Nav({ index, labels }: { index: SearchIndex; labels: NavLabels }) {
  const t = (k: keyof NavLabels) => labels[k];
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet on navigation.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- respond to route change
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t("skip")}
      </a>
      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,box-shadow] duration-300",
          scrolled || mobileOpen
            ? "bg-paper/80 shadow-[0_1px_0_var(--line)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-transparent",
        )}
      >
        <nav aria-label="Main" className="container-site flex h-16 items-center gap-4">
          <Link href="/" className="shrink-0" aria-label="Viaje Daraga — home">
            <Logo />
          </Link>

          <ul className="mx-auto hidden items-center gap-0.5 lg:flex" onMouseLeave={() => setHovered(null)}>
            {links.map((l) => (
              <li key={l.href} className="relative" onMouseEnter={() => setHovered(l.href)}>
                {hovered === l.href && (
                  <m.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-full bg-ink/[0.06]"
                    transition={motionTokens.ease.spring}
                  />
                )}
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn(
                    "relative block rounded-full px-3 py-1.5 text-sm transition-colors",
                    isActive(l.href) ? "font-medium text-ink" : "text-ash-ink hover:text-ink",
                  )}
                >
                  {t(l.key)}
                  {isActive(l.href) && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-px bg-ember" aria-hidden />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 items-center gap-2 rounded-full border border-line bg-white/70 pr-2 pl-3 text-sm text-ash-ink hover:border-ash"
            >
              <Search aria-hidden className="size-4" />
              <span className="hidden sm:inline">{t("search")}</span>
              <kbd className="hidden rounded border border-line px-1 text-[11px] sm:inline">⌘K</kbd>
              <span className="sr-only sm:hidden">{t("search")}</span>
            </button>
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full border border-line bg-white/70 lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X aria-hidden className="size-4" /> : <Menu aria-hidden className="size-4" />}
              <span className="sr-only">{mobileOpen ? t("close") : t("menu")}</span>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <m.div
              id="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: motionTokens.dur.sm, ease: motionTokens.ease.out }}
              className="overflow-hidden border-t border-line lg:hidden"
            >
              <ul className="container-site grid grid-cols-2 gap-2 py-4">
                {[...links, { href: "/about", key: "about" as const }].map((l, i) => (
                  <m.li
                    key={l.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      href={l.href}
                      aria-current={isActive(l.href) ? "page" : undefined}
                      className={cn(
                        "block rounded-2xl border border-line bg-white px-4 py-3 text-sm",
                        isActive(l.href) && "border-ink font-medium",
                      )}
                    >
                      {t(l.key)}
                    </Link>
                  </m.li>
                ))}
              </ul>
            </m.div>
          )}
        </AnimatePresence>
      </header>
      <CommandMenu index={index} open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
