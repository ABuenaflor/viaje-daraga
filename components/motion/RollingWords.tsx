"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { motionTokens } from "@/lib/motion";

/** Cycles words with a vertical roll (Skiper "rolling text" feel). */
export function RollingWords({ words, interval = 2400, className }: { words: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [reduce, interval, words.length]);

  return (
    <span className={className} aria-label={words.join(", ")}>
      <span aria-hidden className="relative inline-grid overflow-hidden align-bottom">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={words[i]}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: motionTokens.dur.md, ease: motionTokens.ease.out }}
            className="col-start-1 row-start-1 whitespace-nowrap"
          >
            {words[i]}
          </m.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
