"use client";

import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

/** Pinned opening: belfry, ash cloud and sky separate as you scroll (Skiper parallax feel). */
export function EruptionIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const k = reduce ? 0 : 1;
  const ashY = useTransform(scrollYProgress, [0, 1], ["0%", `${-35 * k}%`]);
  const ashScale = useTransform(scrollYProgress, [0, 1], [1, 1 + 0.6 * k]);
  const ashOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.9, 1]);
  const belfryY = useTransform(scrollYProgress, [0, 1], ["0%", `${12 * k}%`]);
  const skyDark = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 0.85]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", `${-40 * k}%`]);
  // Title fades before the sky darkens so the dark text never sits on a dark background.
  const titleOpacity = useTransform(scrollYProgress, [0, 0.22, 0.38], [1, 1, reduce ? 1 : 0]);

  return (
    <div ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#F1D6BC]">
        <m.div className="absolute inset-0 bg-basalt" style={{ opacity: skyDark }} aria-hidden />
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" aria-hidden>
          <path d="M600 900 C800 700 940 440 1060 280 Q1090 250 1120 280 C1240 440 1380 700 1600 900 Z" fill="#5D5048" />
        </svg>
        <m.svg
          style={{ y: ashY, scale: ashScale, opacity: ashOpacity }}
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 size-full origin-[68%_30%]"
          aria-hidden
        >
          <g fill="#6E625B">
            <circle cx="1090" cy="220" r="120" />
            <circle cx="980" cy="160" r="100" />
            <circle cx="1200" cy="150" r="110" />
            <circle cx="1090" cy="70" r="130" />
            <circle cx="900" cy="60" r="90" />
            <circle cx="1300" cy="40" r="100" />
          </g>
        </m.svg>
        <m.svg style={{ y: belfryY }} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" aria-hidden>
          <g transform="translate(300 400)" fill="#231D19">
            <path d="M-10 500 L-4 240 L136 240 L142 500 Z" />
            <path d="M8 242 L14 140 L118 140 L124 242 Z" />
            <path d="M26 142 L30 68 L102 68 L106 142 Z" />
            <path d="M36 70 Q66 22 96 70 Z" />
          </g>
          <path d="M0 820 Q400 780 800 810 T1600 800 V900 H0 Z" fill="#231D19" />
        </m.svg>
        <m.div style={{ y: titleY, opacity: titleOpacity }} className="relative z-10 container-site flex h-full flex-col justify-center">
          <p className="eyebrow !text-ink/70">Heritage story</p>
          <h1 className="display mt-4 max-w-4xl text-6xl leading-[0.95] text-ink md:text-8xl lg:text-9xl">
            1 February <span className="italic">1814</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink/80">Scroll to walk through the morning that made modern Daraga.</p>
        </m.div>
      </div>
    </div>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <m.span style={{ opacity }}>{children}</m.span>
    </span>
  );
}

/** Word-by-word reveal tied to scroll (Skiper "text scroll animation"). */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  if (reduce) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </span>
    </p>
  );
}

/** Timeline whose spine draws as you scroll (Skiper "SVG follow scroll"). */
export function Timeline({ items }: { items: { year: string; title: string; body: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  return (
    <ol ref={ref} className="relative ml-3 space-y-12 pl-10 md:ml-[calc(25%)]">
      <span className="absolute top-0 bottom-0 left-0 w-px bg-line" aria-hidden />
      <m.span className="absolute top-0 left-0 w-px origin-top bg-ember" style={{ scaleY: scrollYProgress, height: "100%" }} aria-hidden />
      {items.map((it) => (
        <li key={it.year + it.title} className="relative">
          <span className="absolute top-2 -left-10 size-2.5 -translate-x-1/2 rounded-full bg-ember ring-4 ring-paper" aria-hidden />
          <p className="font-display text-4xl text-ember md:absolute md:top-0 md:-left-10 md:w-48 md:-translate-x-[calc(100%+2rem)] md:text-right">{it.year}</p>
          <h3 className="mt-1 text-lg font-semibold md:mt-0">{it.title}</h3>
          <p className="mt-1 max-w-xl text-ash-ink">{it.body}</p>
        </li>
      ))}
    </ol>
  );
}
