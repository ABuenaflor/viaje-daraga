"use client";

import { m, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { motionTokens } from "@/lib/motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; as?: "div" | "li" | "section" };

/** Manus-style fade-up + blur-in, once per element. */
export function Reveal({ delay = 0, as = "div", children, ...rest }: Props) {
  const reduce = useReducedMotion();
  const Comp = m[as] as typeof m.div;
  if (reduce) return <Comp {...rest}>{children}</Comp>;
  return (
    <Comp
      initial={{ opacity: 0, y: motionTokens.reveal.y, filter: `blur(${motionTokens.reveal.blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: motionTokens.dur.lg, ease: motionTokens.ease.out, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
