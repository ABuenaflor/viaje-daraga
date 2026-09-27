// MapLibre v6 loads its web worker from a URL relative to its own module
// (new URL("./maplibre-gl-worker.mjs", import.meta.url)). Once bundled, that
// file doesn't exist, so we serve the worker (and the shared chunk it imports)
// from /public and point MapLibre at it with setWorkerUrl().
import { copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const from = fileURLToPath(new URL("../node_modules/maplibre-gl/dist/", import.meta.url));
const to = fileURLToPath(new URL("../public/maplibre/", import.meta.url));
mkdirSync(to, { recursive: true });
for (const f of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) copyFileSync(from + f, to + f);
console.log("Copied MapLibre worker to public/maplibre/");
