"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, {
  Layer,
  Marker,
  NavigationControl,
  Source,
  type MapLayerMouseEvent,
  type MapRef,
} from "react-map-gl/maplibre";
import { setWorkerUrl, type ExpressionSpecification, type GeoJSONSource, type Map as MLMap } from "maplibre-gl";
import type { PlaceLite } from "@/lib/data";
import { categoryMeta } from "@/lib/categories";
import { circlePolygon, type LatLng } from "@/lib/geo";

// The bundled module can't resolve MapLibre's worker relative to itself; serve it
// from /public (copied by scripts/copy-maplibre-worker.mjs on predev/prebuild).
setWorkerUrl(new URL("/maplibre/maplibre-gl-worker.mjs", window.location.origin).href);

export const MAP_STYLE ="https://tiles.openfreemap.org/styles/positron";
const FONT = ["Noto Sans Bold"];

export type { RouteStop } from "@/lib/data";
import type { RouteStop } from "@/lib/data";

export type MapCanvasProps = {
  places: PlaceLite[];
  summit: LatLng;
  center: LatLng;
  pdzKm: number;
  extendedKm?: number | null;
  showPdz?: boolean;
  selectedId?: string | null;
  hoveredId?: string | null;
  onSelect?: (id: string | null) => void;
  onHover?: (id: string | null) => void;
  route?: RouteStop[] | null;
  user?: LatLng | null;
  zoom?: number;
  pitch?: number;
  interactive?: boolean;
  cluster?: boolean;
  label: string;
  /** Fit camera to the visible features on load. */
  fit?: boolean;
  /** Require Ctrl/two-finger gestures so embedded maps don't hijack page scroll. */
  cooperative?: boolean;
};

const colorExpr = [
  "match",
  ["get", "category"],
  ...Object.entries(categoryMeta).flatMap(([k, v]) => [k, v.color]),
  "#1B1917",
] as unknown as ExpressionSpecification;

function makeHatch(): ImageData {
  const s = 12;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  ctx.strokeStyle = "rgba(185, 28, 28, 0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, s);
  ctx.lineTo(s, 0);
  ctx.moveTo(-s / 2, s / 2);
  ctx.lineTo(s / 2, -s / 2);
  ctx.moveTo(s / 2, s + s / 2);
  ctx.lineTo(s + s / 2, s / 2);
  ctx.stroke();
  return ctx.getImageData(0, 0, s, s);
}

function makeDashedRing(): ImageData {
  const s = 30;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.setLineDash([4, 3]);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "#1B1917";
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, 11, 0, Math.PI * 2);
  ctx.stroke();
  return ctx.getImageData(0, 0, s, s);
}

export default function MapCanvas({
  places,
  summit,
  center,
  pdzKm,
  extendedKm,
  showPdz = true,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  route,
  user,
  zoom = 12,
  pitch = 0,
  interactive = true,
  cluster = true,
  label,
  fit = false,
  cooperative = false,
}: MapCanvasProps) {
  const mapRef = useRef<MapRef>(null);
  const [ready, setReady] = useState(false);

  const data = useMemo<GeoJSON.FeatureCollection<GeoJSON.Point>>(
    () => ({
      type: "FeatureCollection",
      features: places
        .filter((p) => p.coords)
        .map((p) => ({
          type: "Feature",
          id: p.id,
          properties: {
            id: p.id,
            name: p.name,
            category: p.category,
            approx: !p.coordsVerified,
          },
          geometry: { type: "Point", coordinates: [p.coords!.lng, p.coords!.lat] },
        })),
    }),
    [places],
  );

  const pdz = useMemo(() => circlePolygon(summit, pdzKm), [summit, pdzKm]);
  const ext = useMemo(() => (extendedKm ? circlePolygon(summit, extendedKm) : null), [summit, extendedKm]);

  const routeLine = useMemo<GeoJSON.Feature<GeoJSON.LineString> | null>(
    () =>
      route && route.length > 1
        ? {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: route.map((s) => [s.coords.lng, s.coords.lat]) },
          }
        : null,
    [route],
  );

  const onLoad = useCallback(
    (e: { target: MLMap }) => {
      const map = e.target;
      if (!map.hasImage("pdz-hatch")) map.addImage("pdz-hatch", makeHatch(), { pixelRatio: 2 });
      if (!map.hasImage("approx-ring")) map.addImage("approx-ring", makeDashedRing(), { pixelRatio: 2 });
      setReady(true);
      if (fit) {
        const pts = [...data.features.map((f) => f.geometry.coordinates), ...(route ?? []).map((s) => [s.coords.lng, s.coords.lat])];
        if (pts.length > 1) {
          const lngs = pts.map((p) => p[0]);
          const lats = pts.map((p) => p[1]);
          map.fitBounds(
            [
              [Math.min(...lngs), Math.min(...lats)],
              [Math.max(...lngs), Math.max(...lats)],
            ],
            { padding: 60, maxZoom: 15, duration: 0 },
          );
        }
      }
    },
    [fit, data, route],
  );

  // Fly to the selected place.
  useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    const p = places.find((x) => x.id === selectedId);
    if (p?.coords) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      mapRef.current.flyTo({
        center: [p.coords.lng, p.coords.lat],
        zoom: Math.max(mapRef.current.getZoom(), 14.5),
        duration: reduce ? 0 : 1200,
        essential: false,
      });
    }
  }, [selectedId, places]);

  const onClick = useCallback(
    async (e: MapLayerMouseEvent) => {
      const f = e.features?.[0];
      if (!f) {
        onSelect?.(null);
        return;
      }
      if (f.properties?.cluster) {
        const src = mapRef.current?.getSource("places") as GeoJSONSource | undefined;
        if (!src) return;
        const z = await src.getClusterExpansionZoom(f.properties.cluster_id);
        const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates;
        mapRef.current?.easeTo({ center: [lng, lat], zoom: z + 0.5 });
        return;
      }
      onSelect?.(String(f.properties?.id));
    },
    [onSelect],
  );

  const onMouseMove = useCallback(
    (e: MapLayerMouseEvent) => {
      const f = e.features?.[0];
      const canvas = mapRef.current?.getCanvas();
      if (canvas) canvas.style.cursor = f ? "pointer" : "";
      onHover?.(f && !f.properties?.cluster ? String(f.properties?.id) : null);
    },
    [onHover],
  );

  const highlight = selectedId ?? hoveredId ?? "";

  return (
    <Map
      ref={mapRef}
      mapStyle={MAP_STYLE}
      initialViewState={{ latitude: center.lat, longitude: center.lng, zoom, pitch, bearing: 0 }}
      style={{ width: "100%", height: "100%" }}
      onLoad={onLoad}
      interactive={interactive}
      interactiveLayerIds={ready ? ["clusters", "points", "points-approx"] : []}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={() => onHover?.(null)}
      attributionControl={{ compact: true }}
      cooperativeGestures={cooperative}
      aria-label={label}
      maxPitch={60}
    >
      {interactive && <NavigationControl position="top-right" visualizePitch />}

      {ready && showPdz && (
        <>
          {ext && (
            <Source id="ext" type="geojson" data={ext}>
              <Layer id="ext-line" type="line" paint={{ "line-color": "#C4410C", "line-width": 1.5, "line-dasharray": [2, 2] }} />
            </Source>
          )}
          <Source id="pdz" type="geojson" data={pdz}>
            <Layer id="pdz-fill" type="fill" paint={{ "fill-pattern": "pdz-hatch", "fill-opacity": 0.9 }} />
            <Layer id="pdz-line" type="line" paint={{ "line-color": "#B91C1C", "line-width": 2, "line-dasharray": [3, 2] }} />
            <Layer
              id="pdz-label"
              type="symbol"
              layout={{
                "symbol-placement": "line",
                "text-field": `${pdzKm}-km Permanent Danger Zone · No entry`,
                "text-font": FONT,
                "text-size": 12,
                "symbol-spacing": 320,
              }}
              paint={{ "text-color": "#8f1414", "text-halo-color": "#fff", "text-halo-width": 1.5 }}
            />
          </Source>
          <Source
            id="summit"
            type="geojson"
            data={{ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [summit.lng, summit.lat] } }}
          >
            <Layer id="summit-dot" type="circle" paint={{ "circle-radius": 4, "circle-color": "#B91C1C", "circle-stroke-color": "#fff", "circle-stroke-width": 2 }} />
            <Layer
              id="summit-label"
              type="symbol"
              layout={{ "text-field": "Mayon summit · 2,463 m", "text-font": FONT, "text-size": 12, "text-offset": [0, 1.2], "text-anchor": "top" }}
              paint={{ "text-color": "#1B1917", "text-halo-color": "#fff", "text-halo-width": 1.5 }}
            />
          </Source>
        </>
      )}

      {ready && routeLine && (
        <Source id="route" type="geojson" data={routeLine}>
          <Layer id="route-casing" type="line" layout={{ "line-cap": "round", "line-join": "round" }} paint={{ "line-color": "#fff", "line-width": 7 }} />
          <Layer id="route-line" type="line" layout={{ "line-cap": "round", "line-join": "round" }} paint={{ "line-color": "#C4410C", "line-width": 3.5 }} />
        </Source>
      )}

      {ready && (
        <Source id="places" type="geojson" data={data} cluster={cluster} clusterRadius={44} clusterMaxZoom={14} promoteId="id">
          <Layer
            id="clusters"
            type="circle"
            filter={["has", "point_count"]}
            paint={{
              "circle-color": "#1B1917",
              "circle-radius": ["step", ["get", "point_count"], 16, 5, 20, 10, 26],
              "circle-stroke-color": "#F8F8F7",
              "circle-stroke-width": 3,
            }}
          />
          <Layer
            id="cluster-count"
            type="symbol"
            filter={["has", "point_count"]}
            layout={{ "text-field": ["get", "point_count_abbreviated"], "text-font": FONT, "text-size": 13 }}
            paint={{ "text-color": "#F8F8F7" }}
          />
          <Layer
            id="points-halo"
            type="circle"
            filter={["all", ["!", ["has", "point_count"]], ["==", ["get", "id"], highlight]]}
            paint={{ "circle-radius": 20, "circle-color": colorExpr, "circle-opacity": 0.2 }}
          />
          <Layer
            id="points"
            type="circle"
            filter={["all", ["!", ["has", "point_count"]], ["!", ["get", "approx"]]]}
            paint={{
              "circle-radius": ["case", ["==", ["get", "id"], highlight], 10, 8],
              "circle-color": colorExpr,
              "circle-stroke-color": "#fff",
              "circle-stroke-width": 2.5,
            }}
          />
          <Layer
            id="points-approx"
            type="symbol"
            filter={["all", ["!", ["has", "point_count"]], ["get", "approx"]]}
            layout={{ "icon-image": "approx-ring", "icon-allow-overlap": true, "icon-size": ["case", ["==", ["get", "id"], highlight], 1.25, 1] }}
          />
          <Layer
            id="points-approx-dot"
            type="circle"
            filter={["all", ["!", ["has", "point_count"]], ["get", "approx"]]}
            paint={{ "circle-radius": 3.5, "circle-color": colorExpr }}
          />
          <Layer
            id="point-labels"
            type="symbol"
            minzoom={13}
            filter={["!", ["has", "point_count"]]}
            layout={{
              "text-field": ["get", "name"],
              "text-font": FONT,
              "text-size": 12,
              "text-offset": [0, 1.3],
              "text-anchor": "top",
              "text-max-width": 10,
              "text-optional": true,
            }}
            paint={{ "text-color": "#1B1917", "text-halo-color": "#F8F8F7", "text-halo-width": 1.5 }}
          />
        </Source>
      )}

      {ready && route?.map((s) => (
        <Marker key={`${s.n}-${s.label}`} longitude={s.coords.lng} latitude={s.coords.lat} anchor="center">
          <span
            className="grid size-7 place-items-center rounded-full bg-ember text-xs font-semibold text-white shadow-lift ring-2 ring-white"
            title={s.label}
          >
            {s.n}
          </span>
        </Marker>
      ))}

      {user && (
        <Marker longitude={user.lng} latitude={user.lat} anchor="center">
          <span className="relative flex size-4" title="You are here">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-500 opacity-60" />
            <span className="relative inline-flex size-4 rounded-full bg-sky-600 ring-2 ring-white" />
          </span>
        </Marker>
      )}
    </Map>
  );
}
