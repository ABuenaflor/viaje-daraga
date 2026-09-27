"use client";

import { AnimatePresence, m } from "motion/react";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

/*
 * Page backdrops — a faint, slowly drifting mosaic of flat folk motifs on coloured squares,
 * in the spirit of the "Love the Philippines" tile language. Each section of the site gets its
 * own motif set and palette (Explore → compass, trails, Mayon; Eat → sili, fish, palayok; …).
 * Purely decorative: aria-hidden, pointer-events-none, and static under reduced motion.
 */

type Motif = (a: string, b: string, bg: string) => ReactNode;

const CREAM = "#fff7e8";

// ── Motifs, drawn in a 100×100 cell ─────────────────────────────────────────

const mayon: Motif = (a, b) => (
  <>
    <path d="M6 88C28 72 38 42 45 24h10c7 18 17 48 39 64Z" fill={a} />
    <path d="M45 24h10l3 9c-5-2-11-2-16 0Z" fill={b} />
    <circle cx="55" cy="15" r="5" fill={b} />
    <circle cx="64" cy="9" r="4" fill={b} />
  </>
);

const eruption: Motif = (a, b) => (
  <>
    <path d="M6 90C28 74 38 48 45 32h10c7 16 17 42 39 58Z" fill={a} />
    <circle cx="50" cy="20" r="9" fill={b} />
    <circle cx="38" cy="14" r="7" fill={b} />
    <circle cx="63" cy="13" r="7" fill={b} />
    <path d="M48 34c-2 14-8 24-14 34M53 34c3 12 8 20 13 26" stroke={b} strokeWidth="3.5" fill="none" strokeLinecap="round" />
  </>
);

const belfry: Motif = (a, b) => (
  <>
    <path d="M28 92V46h44v46Z" fill={a} />
    <path d="M35 46V28h30v18Z" fill={a} />
    <path d="M41 28V14l4 4 4-7 4 5 6-3v15Z" fill={a} />
    <path d="M43 92V72a7 7 0 0 1 14 0v20Z" fill={b} />
    <path d="M45 44v-8a5 5 0 0 1 10 0v8Z" fill={b} />
  </>
);

const church: Motif = (a, b) => (
  <>
    <path d="M20 92V52c0-12 8-16 16-18l14-14 14 14c8 2 16 6 16 18v40Z" fill={a} />
    <path d="M48 4h4v14h-4Z M43 8h14v4H43Z" fill={a} />
    <path d="M42 92V72a8 8 0 0 1 16 0v20Z" fill={b} />
    <circle cx="50" cy="46" r="6" fill={b} />
    <circle cx="31" cy="62" r="4" fill={b} />
    <circle cx="69" cy="62" r="4" fill={b} />
  </>
);

const bell: Motif = (a, b) => (
  <>
    <path d="M45 16h10v10H45Z" fill={a} />
    <path d="M28 74c0-30 8-46 22-48 14 2 22 18 22 48l6 6H22Z" fill={a} />
    <circle cx="50" cy="87" r="6" fill={b} />
    <path d="M34 66h32" stroke={b} strokeWidth="3" />
  </>
);

const arch: Motif = (a, b) => (
  <>
    <path d="M16 92V48a34 34 0 0 1 68 0v44H68V50a18 18 0 0 0-36 0v42Z" fill={a} />
    <path d="M16 60h16M68 60h16M16 76h16M68 76h16" stroke={b} strokeWidth="3" />
  </>
);

const compass: Motif = (a, b) => (
  <>
    <circle cx="50" cy="50" r="38" fill="none" stroke={a} strokeWidth="6" />
    <path d="M50 16 59 50 50 84 41 50Z" fill={a} />
    <path d="M16 50 50 42 84 50 50 58Z" fill={b} />
    <circle cx="50" cy="50" r="5" fill={b} />
  </>
);

const compassRose: Motif = (a, b) => (
  <>
    <path d="M76 24 56 50 76 76 50 56 24 76 44 50 24 24 50 44Z" fill={b} />
    <path d="M50 8 57 43 92 50 57 57 50 92 43 57 8 50 43 43Z" fill={a} />
    <circle cx="50" cy="50" r="6" fill={b} />
  </>
);

const pin: Motif = (a, b) => (
  <>
    <path d="M50 90S24 60 24 40a26 26 0 0 1 52 0c0 20-26 50-26 50Z" fill={a} />
    <circle cx="50" cy="40" r="10" fill={b} />
  </>
);

const footprints: Motif = (a) => (
  <>
    <ellipse cx="36" cy="66" rx="9" ry="15" fill={a} />
    <circle cx="29" cy="45" r="3.5" fill={a} />
    <circle cx="36" cy="42" r="3.5" fill={a} />
    <circle cx="43" cy="45" r="3.5" fill={a} />
    <ellipse cx="64" cy="40" rx="9" ry="15" fill={a} />
    <circle cx="57" cy="19" r="3.5" fill={a} />
    <circle cx="64" cy="16" r="3.5" fill={a} />
    <circle cx="71" cy="19" r="3.5" fill={a} />
  </>
);

const binoculars: Motif = (a, b) => (
  <>
    <path d="M22 30h18v26H22Z M60 30h18v26H60Z M40 38h20v10H40Z" fill={a} />
    <circle cx="31" cy="64" r="17" fill={a} />
    <circle cx="69" cy="64" r="17" fill={a} />
    <circle cx="31" cy="64" r="9" fill={b} />
    <circle cx="69" cy="64" r="9" fill={b} />
  </>
);

const trail: Motif = (a, b) => (
  <>
    <path d="M14 86C32 62 72 74 60 46S38 22 78 20" fill="none" stroke={a} strokeWidth="5" strokeDasharray="8 8" strokeLinecap="round" />
    <circle cx="14" cy="86" r="6" fill={a} />
    <path d="M78 8v24" stroke={b} strokeWidth="4" strokeLinecap="round" />
    <path d="M80 8l14 6-14 6Z" fill={b} />
  </>
);

const flag: Motif = (a, b) => (
  <>
    <path d="M26 12h6v78h-6Z" fill={a} />
    <path d="M32 14 80 28 32 44Z" fill={b} />
    <path d="M14 90h32" stroke={a} strokeWidth="5" strokeLinecap="round" />
  </>
);

const sun: Motif = (a, b) => (
  <>
    {Array.from({ length: 12 }, (_, i) => (
      <path key={i} d="M46 22h8l-4-14Z" fill={a} transform={`rotate(${i * 30} 50 50)`} />
    ))}
    <circle cx="50" cy="50" r="20" fill={a} />
    <circle cx="50" cy="50" r="10" fill={b} />
  </>
);

const sunburst: Motif = (a, b) => (
  <>
    {Array.from({ length: 16 }, (_, i) => (
      <path key={i} d="M47 20h6l-3-12Z" fill={i % 2 ? b : a} transform={`rotate(${i * 22.5} 50 50)`} />
    ))}
    <circle cx="50" cy="50" r="24" fill={a} />
    {Array.from({ length: 8 }, (_, i) => (
      <circle key={i} cx="50" cy="33" r="3" fill={b} transform={`rotate(${i * 45} 50 50)`} />
    ))}
    <circle cx="50" cy="50" r="8" fill={b} />
  </>
);

const zigzag: Motif = (a, b) => (
  <>
    {[0, 25, 50, 75].map((y, i) => (
      <path
        key={y}
        d={`M0 ${y + 25}L12.5 ${y}L25 ${y + 25}L37.5 ${y}L50 ${y + 25}L62.5 ${y}L75 ${y + 25}L87.5 ${y}L100 ${y + 25}Z`}
        fill={i % 2 ? b : a}
      />
    ))}
  </>
);

/** Banig weave — the woven-mat X of the reference tiles. */
const banig: Motif = (a, b) => (
  <>
    <path d="M0 0 50 50 0 100Z M100 0 50 50 100 100Z" fill={a} />
    <path d="M50 30 70 50 50 70 30 50Z" fill={b} />
  </>
);

const okir: Motif = (a, b) => (
  <>
    <path d="M50 6 94 50 50 94 6 50Z" fill={a} />
    <path d="M50 22 78 50 50 78 22 50Z" fill={b} />
    <path d="M50 38 62 50 50 62 38 50Z" fill={a} />
  </>
);

const leaf: Motif = (a, b) => (
  <>
    <path d="M10 90C10 40 40 10 90 10c0 50-30 80-80 80Z" fill={a} />
    <path d="M12 88 88 12M34 66l-2-18M34 66l18 2M52 48l-2-18M52 48l18 2" stroke={b} strokeWidth="3" fill="none" strokeLinecap="round" />
  </>
);

const sili: Motif = (a, b) => (
  <>
    <path d="M26 30c14 0 18 10 24 22 8 16 20 28 38 32-22 8-44 0-54-18-6-10-8-22-8-36Z" fill={a} />
    <path d="M27 30c-3-8 1-16 11-18" stroke={b} strokeWidth="5" fill="none" strokeLinecap="round" />
    <ellipse cx="28" cy="31" rx="7" ry="4" fill={b} />
  </>
);

const fish: Motif = (a, b) => (
  <>
    <ellipse cx="44" cy="50" rx="30" ry="17" fill={a} />
    <path d="M68 50 92 32v36Z" fill={a} />
    <circle cx="27" cy="46" r="3.5" fill={b} />
    <path d="M44 38c6 6 6 18 0 24M56 38c6 6 6 18 0 24" stroke={b} strokeWidth="3" fill="none" />
  </>
);

const bowl: Motif = (a, b) => (
  <>
    <path d="M14 52h72c0 20-16 32-36 32S14 72 14 52Z" fill={a} />
    <path d="M38 84h24v6H38Z" fill={a} />
    <path d="M36 44c-6-8 6-12 0-22M50 44c-6-8 6-12 0-22M64 44c-6-8 6-12 0-22" stroke={b} strokeWidth="4" fill="none" strokeLinecap="round" />
  </>
);

const palayok: Motif = (a, b) => (
  <>
    <path d="M24 42h52c12 16 6 42-26 46-32-4-38-30-26-46Z" fill={a} />
    <path d="M20 32h60v10H20Z" fill={b} />
    <path d="M44 22h12v10H44Z" fill={a} />
    <path d="M28 62h44" stroke={b} strokeWidth="3" />
  </>
);

const coconut: Motif = (a, b) => (
  <>
    <circle cx="50" cy="54" r="34" fill={a} />
    <circle cx="50" cy="54" r="24" fill={b} />
    <circle cx="50" cy="54" r="14" fill={a} opacity=".35" />
    <path d="M50 20c4-8 12-12 20-10" stroke={a} strokeWidth="4" fill="none" strokeLinecap="round" />
  </>
);

const pili: Motif = (a, b) => (
  <>
    <path d="M50 10c24 18 24 62 0 80-24-18-24-62 0-80Z" fill={a} />
    <path d="M50 18v64" stroke={b} strokeWidth="3" />
    <circle cx="40" cy="42" r="2.5" fill={b} />
    <circle cx="60" cy="56" r="2.5" fill={b} />
    <circle cx="40" cy="66" r="2.5" fill={b} />
  </>
);

const cup: Motif = (a, b) => (
  <>
    <path d="M20 42h50v20c0 14-10 22-25 22S20 76 20 62Z" fill={a} />
    <path d="M70 48c14 0 14 18 0 18" stroke={a} strokeWidth="6" fill="none" />
    <path d="M12 86h76v6H12Z" fill={b} />
    <path d="M36 34c-5-7 5-10 0-18M52 34c-5-7 5-10 0-18" stroke={b} strokeWidth="4" fill="none" strokeLinecap="round" />
  </>
);

const bean: Motif = (a, b) => (
  <g transform="rotate(30 50 50)">
    <ellipse cx="50" cy="50" rx="22" ry="34" fill={a} />
    <path d="M50 18c-12 18 12 46 0 64" stroke={b} strokeWidth="4" fill="none" strokeLinecap="round" />
  </g>
);

const moon: Motif = (a, b) => (
  <>
    <path d="M60 14a36 36 0 1 0 28 58A30 30 0 1 1 60 14Z" fill={a} />
    <path d="M76 18l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z M84 42l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z" fill={b} />
  </>
);

const stars: Motif = (a, b) => (
  <>
    <path d="M34 16l6 18 18 6-18 6-6 18-6-18-18-6 18-6Z" fill={a} />
    <path d="M70 50l4 12 12 4-12 4-4 12-4-12-12-4 12-4Z" fill={b} />
    <circle cx="74" cy="22" r="4" fill={a} />
    <circle cx="26" cy="80" r="3" fill={b} />
  </>
);

const guitar: Motif = (a, b) => (
  <>
    <path d="M58 42 86 14" stroke={a} strokeWidth="7" strokeLinecap="round" />
    <circle cx="56" cy="46" r="15" fill={a} />
    <circle cx="40" cy="64" r="22" fill={a} />
    <circle cx="46" cy="56" r="6" fill={b} />
    <path d="M86 14l6-4" stroke={b} strokeWidth="5" strokeLinecap="round" />
  </>
);

const kubo: Motif = (a, b) => (
  <>
    <path d="M50 10 94 48H6Z" fill={a} />
    <path d="M20 48h60v28H20Z" fill={b} />
    <path d="M44 56h12v20H44Z M26 56h12v10H26Z M62 56h12v10H62Z" fill={a} />
    <path d="M24 76v14M50 76v14M76 76v14" stroke={a} strokeWidth="5" />
  </>
);

const windowView: Motif = (a, b) => (
  <>
    <path d="M16 14h68v64H16Z" fill="none" stroke={a} strokeWidth="6" />
    <path d="M22 72c10-8 16-22 22-34h10c6 12 12 26 24 34Z" fill={b} />
    <path d="M50 14v64" stroke={a} strokeWidth="4" />
    <path d="M10 82h80v8H10Z" fill={a} />
  </>
);

const key: Motif = (a, b) => (
  <>
    <circle cx="32" cy="36" r="18" fill={a} />
    <circle cx="32" cy="36" r="7" fill={b} />
    <path d="M44 48 82 86M66 70l-8 8M76 80l-8 8" stroke={a} strokeWidth="8" strokeLinecap="round" />
  </>
);

const banderitas: Motif = (a, b) => (
  <>
    <path d="M0 16Q50 40 100 16" stroke={b} strokeWidth="3" fill="none" />
    <path d="M6 19 20 24 12 42Z M28 26 44 29 34 48Z M52 28 68 26 62 46Z M76 24 92 19 88 38Z" fill={a} />
    <path d="M0 60Q50 84 100 60" stroke={b} strokeWidth="3" fill="none" />
    <path d="M6 63 20 68 12 86Z M28 70 44 73 34 92Z M52 72 68 70 62 90Z M76 68 92 63 88 82Z" fill={b} />
  </>
);

const parol: Motif = (a, b) => (
  <>
    <path d="M50 8 60 38 92 38 66 56 76 88 50 68 24 88 34 56 8 38 40 38Z" fill={a} />
    <circle cx="50" cy="50" r="10" fill={b} />
    <path d="M40 76 34 96M50 70v28M60 76l6 20" stroke={b} strokeWidth="3" strokeLinecap="round" />
  </>
);

const mask: Motif = (a, b, bg) => (
  <>
    <path d="M22 20 30 6 40 18 50 2 60 18 70 6 78 20Z" fill={b} />
    <path d="M18 24h64c0 36-12 64-32 68-20-4-32-32-32-68Z" fill={a} />
    <path d="M26 44c6-6 14-6 18 0-4 6-12 6-18 0Z M56 44c4-6 12-6 18 0-6 6-14 6-18 0Z" fill={bg} />
    <path d="M40 72c6 4 14 4 20 0" stroke={b} strokeWidth="4" fill="none" strokeLinecap="round" />
    <circle cx="26" cy="60" r="3" fill={b} />
    <circle cx="74" cy="60" r="3" fill={b} />
  </>
);

const drum: Motif = (a, b) => (
  <>
    <path d="M22 36v40c0 8 56 8 56 0V36Z" fill={a} />
    <ellipse cx="50" cy="36" rx="28" ry="8" fill={b} />
    <path d="M22 44 50 76 78 44" stroke={b} strokeWidth="3" fill="none" />
    <path d="M36 28 18 8M64 28 82 8" stroke={a} strokeWidth="4" strokeLinecap="round" />
  </>
);

const fireworks: Motif = (a, b) => (
  <>
    {Array.from({ length: 12 }, (_, i) => (
      <g key={i} transform={`rotate(${i * 30} 50 50)`}>
        <path d="M50 38V14" stroke={i % 2 ? b : a} strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="8" r="3" fill={i % 2 ? a : b} />
      </g>
    ))}
    <circle cx="50" cy="50" r="6" fill={a} />
  </>
);

const calendar: Motif = (a, b) => (
  <>
    <path d="M14 22h72v66H14Z" fill={a} />
    <path d="M14 22h72v16H14Z" fill={b} />
    <path d="M30 12v18M70 12v18" stroke={a} strokeWidth="6" strokeLinecap="round" />
    {[0, 1, 2, 3].flatMap((c) =>
      [0, 1, 2].map((r) => <circle key={`${c}${r}`} cx={27 + c * 15} cy={52 + r * 13} r="3.5" fill={b} />),
    )}
  </>
);

const clock: Motif = (a, b) => (
  <>
    <circle cx="50" cy="50" r="38" fill={a} />
    <path d="M50 24v26l18 12" stroke={b} strokeWidth="6" fill="none" strokeLinecap="round" />
    {[0, 90, 180, 270].map((d) => (
      <circle key={d} cx="50" cy="18" r="3" fill={b} transform={`rotate(${d} 50 50)`} />
    ))}
  </>
);

const backpack: Motif = (a, b) => (
  <>
    <path d="M38 20a12 12 0 0 1 24 0" stroke={a} strokeWidth="5" fill="none" />
    <path d="M22 40c0-14 12-22 28-22s28 8 28 22v48H22Z" fill={a} />
    <path d="M32 58h36v22H32Z" fill={b} />
    <path d="M32 66h36" stroke={a} strokeWidth="3" />
  </>
);

const ticket: Motif = (a, b, bg) => (
  <>
    <path d="M8 28h84v44H8Z" fill={a} />
    <circle cx="8" cy="50" r="9" fill={bg} />
    <circle cx="92" cy="50" r="9" fill={bg} />
    <path d="M66 30v40" stroke={b} strokeWidth="3" strokeDasharray="5 5" />
    <path d="M24 42h30M24 54h22" stroke={b} strokeWidth="4" strokeLinecap="round" />
  </>
);

const check: Motif = (a, b) => (
  <>
    <circle cx="50" cy="50" r="36" fill={a} />
    <path d="M32 52l12 12 24-26" stroke={b} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const foldedMap: Motif = (a, b) => (
  <>
    <path d="M10 22 36 12 64 22 90 12v66L64 88 36 78 10 88Z" fill={a} />
    <path d="M36 12v66M64 22v66" stroke={b} strokeWidth="3" />
    <path d="M20 66c10-6 18-2 26-12s18-10 30-18" stroke={b} strokeWidth="3" strokeDasharray="5 5" fill="none" />
  </>
);

const contour: Motif = (a) => (
  <>
    {[36, 26, 16, 6].map((r, i) => (
      <ellipse key={r} cx={50 + i * 2} cy={52 - i} rx={r + 8} ry={r} fill="none" stroke={a} strokeWidth="4" />
    ))}
  </>
);

// ── Themes ──────────────────────────────────────────────────────────────────

type Theme = {
  palette: string[];
  motifs: Motif[];
  /** Drift direction per loop, in tile periods (−1, 0 or 1). */
  dx: number;
  dy: number;
  /** Seconds per loop — larger is calmer. */
  duration: number;
  opacity: number;
};

const themes = {
  home: {
    palette: ["#e03131", "#f76707", "#fcc419", "#2f9e44", "#1c7ed6", "#c2255c", "#12b886"],
    motifs: [mayon, belfry, sili, zigzag, cup, banig, fish, sunburst, leaf, church, compass, okir],
    dx: -1, dy: -1, duration: 140, opacity: 0.16,
  },
  explore: {
    // Trail earth, rice-field green, open sky.
    palette: ["#d9480f", "#f59f00", "#4e7a30", "#2f9e8f", "#5c9ecf", "#a8551e"],
    motifs: [compass, mayon, footprints, binoculars, trail, zigzag, pin, flag, sun, banig, leaf],
    dx: -1, dy: 0, duration: 110, opacity: 0.16,
  },
  map: {
    // Cartographer blues and greens.
    palette: ["#1c7ed6", "#0b7285", "#2f9e44", "#5c9ecf", "#f59f00", "#3bc9db"],
    motifs: [compassRose, pin, foldedMap, contour, trail, mayon, okir, banig],
    dx: -1, dy: -1, duration: 150, opacity: 0.15,
  },
  eat: {
    // Sili red, gata cream, laing greens.
    palette: ["#b91c1c", "#e8590c", "#f59f00", "#4e7a30", "#74b816", "#c2255c"],
    motifs: [sili, fish, bowl, leaf, coconut, palayok, pili, zigzag, banig, sun],
    dx: 0, dy: -1, duration: 120, opacity: 0.16,
  },
  cafes: {
    // Roast browns and late-afternoon ember.
    palette: ["#6f4e37", "#a47148", "#d4a373", "#c4410c", "#3d2b1f", "#8c6a4f"],
    motifs: [cup, bean, moon, guitar, pili, stars, banig, okir, zigzag],
    dx: 1, dy: -1, duration: 170, opacity: 0.15,
  },
  stay: {
    // Night-sky indigos with warm lamplight.
    palette: ["#364fc7", "#5f3dc4", "#1864ab", "#f59f00", "#2b2622", "#c08552"],
    motifs: [kubo, moon, windowView, key, stars, banig, leaf, okir],
    dx: 1, dy: 0, duration: 190, opacity: 0.14,
  },
  events: {
    // Fiesta brights.
    palette: ["#e03131", "#f59f00", "#c2255c", "#2f9e44", "#1c7ed6", "#fcc419", "#7048e8"],
    motifs: [banderitas, parol, mask, drum, fireworks, sunburst, zigzag, banig],
    dx: 0, dy: -1, duration: 90, opacity: 0.17,
  },
  plan: {
    palette: ["#c4410c", "#1c7ed6", "#4e7a30", "#f59f00", "#0b7285", "#a8551e"],
    motifs: [calendar, clock, backpack, ticket, check, trail, pin, banig, zigzag],
    dx: -1, dy: 0, duration: 130, opacity: 0.15,
  },
  heritage: {
    // Weathered stone, ash and 1814 ember.
    palette: ["#8a5a44", "#c08552", "#4a3f38", "#6b4f3a", "#b08968", "#c4410c"],
    motifs: [belfry, church, bell, eruption, arch, okir, banig, zigzag],
    dx: 1, dy: 1, duration: 200, opacity: 0.14,
  },
  default: {
    palette: ["#c4410c", "#4e7a30", "#1c7ed6", "#f59f00", "#b91c1c", "#0b7285"],
    motifs: [mayon, banig, zigzag, sunburst, leaf, okir, church, compass],
    dx: -1, dy: 0, duration: 160, opacity: 0.14,
  },
} satisfies Record<string, Theme>;

type ThemeKey = keyof typeof themes;

function themeFor(pathname: string): ThemeKey {
  if (pathname === "/") return "home";
  const seg = pathname.split("/")[1];
  return seg in themes && seg !== "home" && seg !== "default" ? (seg as ThemeKey) : "default";
}

// ── Tile ────────────────────────────────────────────────────────────────────

const CELL = 100;
const COLS = 6;
const ROWS = 4;
const W = CELL * COLS;
const H = CELL * ROWS;

function Tile({ theme }: { theme: Theme }) {
  const { palette, motifs } = theme;
  const n = palette.length;
  const cells: ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    let prev = -1;
    for (let c = 0; c < COLS; c++) {
      let bgIdx = (c * 2 + r * 3 + ((c * r) % 2)) % n;
      if (bgIdx === prev) bgIdx = (bgIdx + 1) % n;
      prev = bgIdx;
      const bg = palette[bgIdx];
      const fg = palette[(bgIdx + Math.ceil(n / 2)) % n];
      const motif = motifs[(c * 5 + r * 7 + c * r) % motifs.length];
      cells.push(
        <g key={`${r}-${c}`} transform={`translate(${c * CELL} ${r * CELL})`}>
          <rect width={CELL} height={CELL} fill={bg} />
          <g transform="translate(9 9) scale(.82)">{motif(fg, CREAM, bg)}</g>
        </g>,
      );
    }
  }
  return <>{cells}</>;
}

export function PageBackdrop() {
  const pathname = usePathname();
  const key = themeFor(pathname);
  const theme: Theme = themes[key];

  const panStyle = {
    left: -W,
    top: -H,
    width: `calc(100% + ${2 * W}px)`,
    height: `calc(100% + ${2 * H}px)`,
    "--pan-x": `${theme.dx * W}px`,
    "--pan-y": `${theme.dy * H}px`,
    "--pan-dur": `${theme.duration}s`,
  } as CSSProperties;

  return (
    <div aria-hidden className="page-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <AnimatePresence initial={false}>
        <m.div
          key={key}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: theme.opacity }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <svg className="backdrop-pan absolute will-change-transform" style={panStyle}>
            <defs>
              <pattern id={`backdrop-${key}`} width={W} height={H} patternUnits="userSpaceOnUse">
                <Tile theme={theme} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#backdrop-${key})`} />
          </svg>
        </m.div>
      </AnimatePresence>
    </div>
  );
}
