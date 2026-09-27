/**
 * Fill in missing coordinates in data/places.json.
 *
 *   node scripts/geocode.ts              # dry run: prints proposals
 *   node scripts/geocode.ts --write      # writes proposals to places.json
 *   node scripts/geocode.ts --nominatim  # also query OSM Nominatim for addresses (1 req/s)
 *
 * Order: Plus Code (decoded locally, recovered relative to Daraga) → Nominatim.
 * Every proposal is written with coordsVerified:false so a human confirms it —
 * the site renders those as "approximate" pins.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const FILE = fileURLToPath(new URL("../data/places.json", import.meta.url));
const DARAGA = { lat: 13.1489, lng: 123.7126 };
// Rough bounding box of Daraga + neighbours; anything outside is rejected.
const BOUNDS = { minLat: 13.0, maxLat: 13.3, minLng: 123.55, maxLng: 123.85 };

const args = new Set(process.argv.slice(2));
const WRITE = args.has("--write");
const USE_NOMINATIM = args.has("--nominatim");

// ---- Open Location Code (Plus Code) — decode + recoverNearest -------------
const ALPHABET = "23456789CFGHJMPQRVWX";
const PAIR_RES = [20, 1, 0.05, 0.0025, 0.000125];

function decodeFull(code: string): { lat: number; lng: number } {
  const clean = code.replace("+", "").replace(/0+$/, "").toUpperCase();
  let lat = -90;
  let lng = -180;
  let latRes = 0;
  let lngRes = 0;
  for (let i = 0; i < Math.min(clean.length, 10); i += 2) {
    const res = PAIR_RES[i / 2];
    lat += ALPHABET.indexOf(clean[i]) * res;
    lng += ALPHABET.indexOf(clean[i + 1]) * res;
    latRes = lngRes = res;
  }
  // Grid refinement (11th+ characters): 5 cols × 4 rows.
  for (let i = 10; i < clean.length; i++) {
    const idx = ALPHABET.indexOf(clean[i]);
    latRes /= 5;
    lngRes /= 4;
    lat += Math.floor(idx / 4) * latRes;
    lng += (idx % 4) * lngRes;
  }
  return { lat: lat + latRes / 2, lng: lng + lngRes / 2 };
}

function recoverNearest(shortCode: string, ref: { lat: number; lng: number }): string {
  const code = shortCode.toUpperCase();
  const sep = code.indexOf("+");
  if (sep === 8) return code; // already full
  const padding = 8 - sep;
  const res = Math.pow(20, 2 - padding / 2);
  const round = (v: number) => Math.floor(v / res) * res;
  // Encode the reference location to get the missing prefix.
  const refCode = encode(round(ref.lat) + res / 2, round(ref.lng) + res / 2);
  const candidate = refCode.slice(0, padding) + code;
  const c = decodeFull(candidate);
  let { lat, lng } = c;
  const half = res / 2;
  if (ref.lat + half < lat && lat - res >= -90) lat -= res;
  else if (ref.lat - half > lat && lat + res <= 90) lat += res;
  if (ref.lng + half < lng) lng -= res;
  else if (ref.lng - half > lng) lng += res;
  return encode(lat, lng, candidate.replace("+", "").length);
}

function encode(lat: number, lng: number, len = 10): string {
  let la = lat + 90;
  let ln = lng + 180;
  let out = "";
  for (let i = 0; i < 5; i++) {
    const res = PAIR_RES[i];
    const a = Math.floor(la / res);
    const b = Math.floor(ln / res);
    la -= a * res;
    ln -= b * res;
    out += ALPHABET[a] + ALPHABET[b];
  }
  let latRes = PAIR_RES[4];
  let lngRes = PAIR_RES[4];
  for (let i = 10; i < len; i++) {
    latRes /= 5;
    lngRes /= 4;
    const r = Math.floor(la / latRes);
    const c = Math.floor(ln / lngRes);
    la -= r * latRes;
    ln -= c * lngRes;
    out += ALPHABET[r * 4 + c];
  }
  return out.slice(0, 8) + "+" + out.slice(8, len);
}

function fromPlusCode(plusCode: string): { lat: number; lng: number } | null {
  const token = plusCode.trim().split(/\s+/)[0];
  if (!/^[23456789CFGHJMPQRVWX]{2,8}\+[23456789CFGHJMPQRVWX]*$/i.test(token)) return null;
  const full = recoverNearest(token, DARAGA);
  return decodeFull(full);
}

// ---- Nominatim -------------------------------------------------------------
async function fromNominatim(query: string): Promise<{ lat: number; lng: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ph&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": "ViajeDaraga-geocoder/0.1 (tourism site build script)" } });
  if (!res.ok) return null;
  const data = (await res.json()) as { lat: string; lon: string }[];
  if (!data[0]) return null;
  return { lat: Number(data[0].lat), lng: Number(data[0].lon) };
}

const inBounds = (c: { lat: number; lng: number }) =>
  c.lat >= BOUNDS.minLat && c.lat <= BOUNDS.maxLat && c.lng >= BOUNDS.minLng && c.lng <= BOUNDS.maxLng;

type PlaceRow = {
  id: string;
  name: string;
  address: string | null;
  plusCode?: string | null;
  coords: { lat: number; lng: number } | null;
  coordsVerified: boolean;
};

const places = JSON.parse(readFileSync(FILE, "utf8")) as PlaceRow[];
let changed = 0;

for (const p of places) {
  if (p.coords) continue;
  let found: { lat: number; lng: number } | null = null;
  let via = "";
  if (p.plusCode) {
    found = fromPlusCode(p.plusCode);
    via = "plus code";
  }
  if (!found && USE_NOMINATIM && p.address) {
    await new Promise((r) => setTimeout(r, 1100)); // Nominatim usage policy: ≤ 1 req/s
    found = await fromNominatim(`${p.name}, ${p.address}`);
    if (!found) {
      await new Promise((r) => setTimeout(r, 1100));
      found = await fromNominatim(p.address);
    }
    via = "nominatim";
  }
  if (found && inBounds(found)) {
    const rounded = { lat: +found.lat.toFixed(5), lng: +found.lng.toFixed(5) };
    console.log(`✓ ${p.id.padEnd(24)} ${rounded.lat}, ${rounded.lng}  (${via})`);
    p.coords = rounded;
    p.coordsVerified = false;
    changed++;
  } else {
    console.log(`· ${p.id.padEnd(24)} no result`);
  }
}

if (WRITE && changed) {
  writeFileSync(FILE, JSON.stringify(places, null, 2) + "\n");
  console.log(`\nWrote ${changed} approximate coordinate(s) — confirm them, then set coordsVerified:true.`);
} else {
  console.log(`\n${changed} proposal(s). Re-run with --write to save.`);
}
