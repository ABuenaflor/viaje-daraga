export const motionTokens = {
  ease: {
    out: [0.22, 1, 0.36, 1] as const,
    inOut: [0.65, 0, 0.35, 1] as const,
    spring: { type: "spring", stiffness: 260, damping: 30 } as const,
  },
  dur: { xs: 0.15, sm: 0.25, md: 0.45, lg: 0.8, xl: 1.2 },
  stagger: 0.06,
  reveal: { y: 24, blur: 8 },
};

/** Delay for the i-th item in a staggered reveal (capped so long lists don't lag). */
export function stagger(i: number) {
  return Math.min(i, 8) * motionTokens.stagger;
}
