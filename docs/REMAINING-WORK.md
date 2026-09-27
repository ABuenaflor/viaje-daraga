# Viaje Daraga — Remaining Work & Owner Checklist

*Status as of 27 September 2026. Phase 1 (the visitor website) is feature-complete; this lists what's left to launch and what the project owner, the LGU and partners need to provide.*

---

## 1. Where the project stands

**Built and working**

- All pages: Home, Explore, place pages (36), Map, Eat, Cafés & tambayan, Stay, Events and event pages (7), Plan, Itineraries, 1814 heritage story, About, Mayon advisory, 404.
- Content lives in `data/*.json` and is checked on every build.
- Interactive map with the Mayon Permanent Danger Zone, clustering, "near me", directions and itinerary routes.
- Mayon advisory pill on every page, driven by `data/advisory.json`.
- Every listing shows its sources and a "last checked" date. Missing facts show "Ask the tourism office" rather than guesses.
- Search, favourites, share, "Add to calendar", sitemap, robots.txt and search-engine structured data.
- Production build, type-check and lint all pass.

---

## 2. Missing from the build (developer to-do)

| # | Item | Notes |
|---|---|---|
| 1 | Site icon and link-preview images | The favicon is still the Next.js default, and pages have no preview image when shared on Facebook or Messenger. The starter files in `public/` should also be removed. |
| 2 | Error page | There's a 404 page, but nothing for unexpected errors. |
| 3 | Filipino version | `messages/fil.json` is a draft. There's no language toggle yet; English only. |
| 4 | Opening word preloader | "Marhay na aldaw → Magayon → Daraga" intro (brief §6.3) not built. |
| 5 | Photo effects | Cursor trail and photo reveal are waiting for real photos. |
| 6 | Page speed | About 245–257 KB of scripts per page vs. the 200 KB target. Fix: replace the animation library with CSS animations. |
| 7 | Accessibility and speed audit | Lighthouse and axe checks haven't been run in a browser yet. |
| 8 | Visitor statistics | Plausible or Umami not set up. |
| 9 | Live weather on `/advisory` | Currently a link to PAGASA only. |
| 10 | Automated tests | None yet. |

**Phase 2 (not started)**

- A content editor so tourism staff can update listings and events without code (Sanity, Payload or Supabase).
- A "Submit an event" form, with approval before publishing.
- Moderation for reviews and ratings.
- Optional AI trip planner behind the "Ask Daraga" box.

---

## 3. What the owner needs to provide

### 3.1 Verified facts from the Daraga Tourism Office *(biggest blocker)*

- [ ] **Current Mayon alert level**, and a named person who updates `data/advisory.json` whenever PHIVOLCS changes it. PHIVOLCS has no public data feed, so this is manual.
- [ ] Cagsawa Ruins Park: new fees (effective 1 Jul 2026) and opening hours.
- [ ] Budiao Archaeological Site: open to walk-in visitors? Exact location?
- [ ] FarmPlate: entrance fee (sources say ₱75–95).
- [ ] Balay Cena Una: still temporarily closed?
- [ ] Hours and addresses for: Antonia's, Jardin del Nuñez, 1st Colonial Grill (Daraga), Sizzling Time, Rose's Kinalas.
- [ ] Hotels still to confirm: Daraga Tourist Inn, Y's Rezidenzia, Casa Lorenzo, Casa Basilisa, The Oriental Legazpi.
- [ ] **Map pins:** 28 of 36 places have no location yet; 3 are approximate and need confirming.
- [ ] 2027 dates for the Cagsawa Festival and the town fiesta.
- [ ] Is `(052) 742-1234 / tourism@daraga.gov.ph` on the LGU events page real or placeholder text?
- [ ] Current airline routes into Bicol International Airport, and PNR train status.
- [ ] Current minimum jeepney fare.

### 3.2 Photos, with permission

- [ ] 1–3 photos per place, plus a strong Mayon/belfry image for the home page.
- [ ] Only LGU-owned, Creative Commons, or owner-approved photos.
- [ ] For each photo: the file, the photographer's credit and the license.

### 3.3 Permissions and approvals

- [ ] LGU endorsement to use the name "Viaje Daraga" and any LGU branding (seal, "Viajeng Progreso").
- [ ] Written permission from page owners before embedding Facebook or TikTok posts (e.g. FarmPlate, #DaragaTV, Mayon SkyDrive).
- [ ] Confirm any ViajeKita partnership before adding booking links.
- [ ] *(Optional)* Skiper UI premium license, only if their exact components are wanted.

### 3.4 Accounts and infrastructure

- [ ] Domain name. Replace `viajedaraga.example` in `data/site.json`.
- [ ] Hosting: GitHub repository plus a Vercel account (free tier is enough for phase 1).
- [ ] Analytics account (Plausible or Umami).
- [ ] *(Phase 2)* Choice of content editor, and which staff get editing access.
- [ ] *(Optional)* MapTiler key for 3D terrain of Mayon.

### 3.5 Language review

- [ ] A Filipino speaker reviews `messages/fil.json`.
- [ ] A local speaker confirms the Bikol phrases: *Marhay na aldaw*, *Dios mabalos*, *Magayon*, *Pira?*

### 3.6 Optional 3D hero

- [ ] A Spline scene (Mayon, belfry, cloud ring) made in-house or commissioned. Paste its URL into `data/site.json` → `splineScene`. Without it, the illustrated hero stays.

### 3.7 Legal, before any forms go live

- [ ] Privacy notice and terms of use.
- [ ] Under the Data Privacy Act (RA 10173), name who is responsible for data from the event-submission form.

---

## 4. Suggested order

1. **Developer:** add the site icon, preview images and error page; clean up `public/`.
2. **Owner:** collect verified facts (§3.1) and photos (§3.2) from the tourism office.
3. **Developer:** load the updates, share a preview link, run the accessibility and speed audit.
4. **Owner + LGU:** sign-off; connect the domain and analytics; launch.
5. **Phase 2:** content editor and event submission form.

---

## 5. How to update content yourself

All content is in `data/`. No coding is needed, but each change must be saved as a commit to GitHub, which then redeploys the site automatically.

- Unknown fact: use `null`. The site shows "Ask the tourism office".
- Confirmed a location on the ground: set `"coordsVerified": true`.
- Unconfirmed listing: set `"status": "verify"` and explain in `"verifyNote"`.
- After checking any listing, update `"lastVerified"` (format `YYYY-MM-DD`).
- If a file has a mistake, the build fails with a message naming the file and field, and the live site stays unchanged.
