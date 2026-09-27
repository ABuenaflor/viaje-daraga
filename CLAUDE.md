@AGENTS.md

# Viaje Daraga — tourism site for Daraga, Albay

Full project brief (design, data sources, build plan): `docs/CONTEXT.md` — read it before large changes.

## Hard rules
- **Mayon safety first.** Alert level lives only in `data/advisory.json`; never hard-code it in components. Places with `nearPdz: true` show a warning badge.
- **No invented facts.** Unknown hours/fees/coords stay `null` and render "Ask the tourism office". Coordinates not confirmed by a human keep `coordsVerified: false` (dashed "approximate" pin).
- **Photos:** only LGU-provided, CC-licensed (with credit + license) or owner-permitted. Until then `PlaceArt` renders an illustration.
- **Reduced motion:** every animation needs a static fallback (`useReducedMotion`, `MotionConfig reducedMotion="user"`, CSS media query).
- **Privacy:** only business or official phone numbers.

## Conventions
- Next.js 16 App Router, everything statically generated. Don't use `useSearchParams` in pages that must stay static — read `window.location.search` after mount (see `ExploreGrid`, `MapExplorer`).
- `lib/data.ts` is `server-only`: it validates all `data/*.json` with zod at build time. Pass slim `PlaceLite` records to client components.
- Motion: use `m.*` components (the app runs `LazyMotion strict`); importing `motion.*` will throw.
- i18n: strings in `messages/*.json`, translated on the server and passed as props (no client i18n runtime). `fil.json` is a draft pending review.
- Styling: Tailwind v4 tokens in `app/globals.css`; shared classes are `@utility` (`btn-*`, `chip`, `card`, `eyebrow`, `display`, `container-site`).
- MapLibre loads lazily via `components/map/LazyMap.tsx`; never import `MapCanvas` directly.

## Commands
- `npm run dev` / `npm run build` / `npm run lint`
- `npm run geocode -- --nominatim [--write]` — propose approximate coords for places missing them.
