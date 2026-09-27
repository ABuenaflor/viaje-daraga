"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

type NavigatorExtras = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

/**
 * Renders a Spline scene over the poster only when it's safe to: no reduced
 * motion, no Save-Data, ≥4 GB device memory, ≥768 px viewport. The scene is
 * unmounted while off-screen. `scene` null (the default) keeps the poster.
 */
export function SplineHero({ scene, minWidth = 768 }: { scene: string | null; minWidth?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!scene) return;
    const nav = navigator as NavigatorExtras;
    const ok =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !nav.connection?.saveData &&
      (nav.deviceMemory ?? 8) >= 4 &&
      window.innerWidth >= minWidth;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- capability check needs the browser
    setAllowed(ok);
  }, [scene, minWidth]);

  useEffect(() => {
    if (!allowed || !ref.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(ref.current);
    return () => io.disconnect();
  }, [allowed]);

  if (!scene || !allowed) return null;

  return (
    <div
      ref={ref}
      className="absolute inset-0 transition-opacity duration-700"
      style={{ opacity: loaded ? 1 : 0 }}
      aria-hidden
    >
      {visible && (
        <Suspense fallback={null}>
          <Spline scene={scene} onLoad={() => setLoaded(true)} />
        </Suspense>
      )}
    </div>
  );
}
