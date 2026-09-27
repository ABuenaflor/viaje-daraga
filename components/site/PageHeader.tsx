import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("container-site pt-12 pb-10 md:pt-20 md:pb-14", className)}>
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display mt-3 max-w-4xl text-5xl leading-[1.02] md:text-7xl">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ash-ink">{lead}</p>}
        {children}
      </Reveal>
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  action?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <Reveal className={cn("mb-8 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id} className="display mt-2 text-4xl md:text-5xl">{title}</h2>
      </div>
      {action}
    </Reveal>
  );
}
