"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * Illustrated poster: Mayon with a cloud ring, the Cagsawa belfry, rice terraces.
 * Layers drift apart on scroll (static when reduced motion is on).
 * Doubles as the Spline fallback poster.
 */
export function HeroArt() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const ySky = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);
  const yMayon = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const yClouds = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const yFields = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 30]);
  const yBelfry = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -20]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden" aria-hidden>
      <m.svg style={{ y: ySky }} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F8F8F7" />
            <stop offset=".55" stopColor="#F6E9DA" />
            <stop offset="1" stopColor="#F1D6BC" />
          </linearGradient>
          <radialGradient id="sun" cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#FFF6E8" />
            <stop offset="1" stopColor="#FFF6E8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#sky)" />
        <circle cx="1240" cy="330" r="220" fill="url(#sun)" />
      </m.svg>

      <m.svg style={{ y: yMayon }} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id="cone" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7C8A99" />
            <stop offset=".5" stopColor="#5D6A78" />
            <stop offset="1" stopColor="#8697A6" />
          </linearGradient>
          <linearGradient id="coneFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#F1D6BC" stopOpacity=".85" />
          </linearGradient>
        </defs>
        {/* Mayon's near-perfect cone */}
        <path d="M430 900 C700 700 880 420 1020 250 Q1050 222 1080 250 C1220 420 1400 700 1670 900 Z" fill="url(#cone)" />
        {/* gullies */}
        <path d="M1050 262 L1010 520 M1050 262 L1070 560 M1050 262 L1130 480" stroke="#4E5965" strokeOpacity=".35" strokeWidth="3" fill="none" />
        {/* plume */}
        <path d="M1046 244 C1030 200 1060 180 1048 140 C1040 110 1070 96 1062 70" stroke="#fff" strokeOpacity=".7" strokeWidth="10" strokeLinecap="round" fill="none" />
        <rect x="0" y="500" width="1600" height="400" fill="url(#coneFade)" />
      </m.svg>

      <m.svg style={{ y: yClouds }} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full">
        <g className="motion-safe:animate-[drift_40s_ease-in-out_infinite_alternate]" fill="#fff">
          <ellipse cx="900" cy="440" rx="190" ry="26" opacity=".85" />
          <ellipse cx="1180" cy="430" rx="220" ry="30" opacity=".8" />
          <ellipse cx="1040" cy="455" rx="160" ry="20" opacity=".9" />
          <ellipse cx="420" cy="300" rx="140" ry="16" opacity=".6" />
        </g>
      </m.svg>

      <m.svg style={{ y: yFields }} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full">
        {/* rice terraces */}
        <path d="M0 700 Q400 640 800 690 T1600 670 V900 H0 Z" fill="#9DB57A" />
        <path d="M0 740 Q420 690 840 736 T1600 720 V900 H0 Z" fill="#7FA05A" />
        <path d="M0 790 Q400 750 820 786 T1600 770 V900 H0 Z" fill="#628A42" />
        <path d="M0 720 Q420 676 840 716 T1600 700" stroke="#EAF0D8" strokeOpacity=".6" strokeWidth="2" fill="none" />
        <path d="M0 766 Q420 724 840 762 T1600 746" stroke="#EAF0D8" strokeOpacity=".5" strokeWidth="2" fill="none" />
      </m.svg>

      <m.svg style={{ y: yBelfry }} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full">
        {/* Cagsawa belfry silhouette */}
        <g transform="translate(250 430)" fill="#3A302A">
          <path d="M-10 470 L-4 210 L136 210 L142 470 Z" />
          <path d="M8 212 L14 110 L118 110 L124 212 Z" />
          <path d="M26 112 L30 38 L102 38 L106 112 Z" />
          <path d="M36 40 Q66 -8 96 40 Z" />
          {/* ruined crown + vegetation */}
          <path d="M40 18 q6 -14 14 -4 q8 -16 16 0 q10 -12 16 4 Z" fill="#4E7A30" />
          {/* arched openings */}
          <g fill="#F1D6BC" opacity=".9">
            <path d="M46 180 V148 Q66 120 86 148 V180 Z" />
            <path d="M54 96 V74 Q66 58 78 74 V96 Z" />
            <path d="M22 330 V286 Q38 262 54 286 V330 Z" opacity=".55" />
            <path d="M80 330 V286 Q96 262 112 286 V330 Z" opacity=".55" />
          </g>
          {/* cornices */}
          <rect x="-12" y="204" width="156" height="8" rx="2" />
          <rect x="6" y="104" width="120" height="7" rx="2" />
          <rect x="24" y="33" width="84" height="6" rx="2" />
        </g>
        <path d="M0 860 Q300 820 620 850 T1600 840 V900 H0 Z" fill="#4A6B34" />
      </m.svg>

      <div className="absolute inset-0 bg-gradient-to-b from-paper/70 via-paper/10 to-transparent" />
    </div>
  );
}
