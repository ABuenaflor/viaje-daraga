"use client";

import { m } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion";

/** Sticky section index that tracks the section in view (Skiper "side scroll navigation"). */
export function SideNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-24">
      <p className="eyebrow mb-3">On this page</p>
      <ul className="relative space-y-0.5 border-l border-line">
        {items.map((i) => (
          <li key={i.id} className="relative">
            {active === i.id && (
              <m.span layoutId="sidenav-bar" className="absolute top-0 -left-px h-full w-0.5 bg-ember" transition={motionTokens.ease.spring} />
            )}
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "location" : undefined}
              className={cn("block py-1.5 pl-4 text-sm transition-colors", active === i.id ? "font-medium text-ink" : "text-ash-ink hover:text-ink")}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
