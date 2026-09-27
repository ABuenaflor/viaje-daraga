export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect width="32" height="32" rx="9" fill={light ? "#F8F8F7" : "#1B1917"} />
        <path d="M5 24 L14.2 9.5 Q16 7.2 17.8 9.5 L27 24 Z" fill="#C4410C" />
        <path d="M13.3 11 Q16 9.6 18.7 11 L16 7.8 Z" fill={light ? "#1B1917" : "#F8F8F7"} opacity=".9" />
        <path d="M5 24 H27" stroke={light ? "#1B1917" : "#F8F8F7"} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className={`font-display text-xl leading-none ${light ? "text-paper" : "text-ink"}`}>
        Viaje <span className="italic">Daraga</span>
      </span>
    </span>
  );
}
