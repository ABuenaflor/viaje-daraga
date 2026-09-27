"use client";

import { m } from "motion/react";
import { motionTokens } from "@/lib/motion";

/** Soft page transition: 250 ms cross-fade + 8px lift. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.dur.sm, ease: motionTokens.ease.out }}
    >
      {children}
    </m.div>
  );
}
