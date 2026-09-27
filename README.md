# Viaje Daraga

The visitor-facing tourism companion to [daraga.gov.ph](https://daraga.gov.ph): where to go, eat and stay in Daraga, Albay, with an interactive map, an events calendar, itineraries and a Mayon Volcano safety advisory on every page.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static build — fails loudly if any data file is invalid
```

## Editing content (no code needed)

Everything visitors see comes from `data/`:

| File | What it holds |
|---|---|
| `advisory.json` | **Mayon alert level**, PDZ radius, summary, date. Update this whenever PHIVOLCS changes the level. |
| `places.json` | Attractions, restaurants, cafés, hotels, services |
| `events.json` | Festivals and recurring events |
| `dishes.json` | Food and pasalubong |
| `itineraries.json` | 1-, 2- and 3-day plans |
| `contacts.json` | Official hotlines |
| `site.json` | Site name, stats, phrases, optional Spline scene URL |

Rules of thumb:
- Unknown? Use `null` — the site shows "Ask the tourism office".
- After confirming a location on the ground, set `coordsVerified` to `true`.
- Set `status` to `"verify"` for anything unconfirmed and explain in `verifyNote`.
- Update `lastVerified` (YYYY-MM-DD) whenever you check a listing.

## Before launch
- [ ] Confirm the Mayon alert level in `data/advisory.json` with PHIVOLCS and set `needsVerification` to `false`.
- [ ] Review every listing marked "Unconfirmed" with the tourism office.
- [ ] Drop pins for places without coordinates (28 of 36 have none yet; 3 more are approximate and need confirming).
- [ ] Replace illustrations with licensed photos (`images` array: `src`, `alt`, `credit`, `license`).
- [ ] Set the real domain in `data/site.json` (`url`).
- [ ] Have a Filipino speaker review `messages/fil.json` and the Bikol phrases.
- [ ] Optional: add a Spline scene URL in `data/site.json` → `splineScene`.
