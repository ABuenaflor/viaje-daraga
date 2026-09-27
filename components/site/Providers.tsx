"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";

// Motion features (animations, gestures, layout) load after hydration, keeping them out of first-load JS.
const loadFeatures = () => import("./motion-features").then((m) => m.default);

/** Lenis smooth scroll — loaded lazily, and skipped for reduced motion and touch devices. */
function useSmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduce.matches || coarse.matches) return;
    let lenis: { destroy: () => void; raf: (t: number) => void } | null = null;
    let frame = 0;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const instance = new Lenis({ lerp: 0.12, anchors: true });
      lenis = instance;
      const loop = (t: number) => {
        instance.raf(t);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    });
    const onChange = () => reduce.matches && lenis?.destroy();
    reduce.addEventListener("change", onChange);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      lenis?.destroy();
      reduce.removeEventListener("change", onChange);
    };
  }, []);
}

export function Providers({ children }: { children: ReactNode }) {
  useSmoothScroll();
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
