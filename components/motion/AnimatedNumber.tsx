"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Counts up once when scrolled into view. Years render without thousands separators. */
export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(value);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!inView || reduce || started) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kick off the one-time animation
    setStarted(true);
    const from = value > 1000 ? value - 120 : 0;
    const controls = animate(from, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, started, value]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden className="tabular-nums">{n}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
