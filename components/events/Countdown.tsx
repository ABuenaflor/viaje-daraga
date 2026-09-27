"use client";

import { useEffect, useState } from "react";

// Manila is UTC+8 with no DST — a fixed offset keeps date libraries out of the client bundle.
const startOf = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00+08:00`).getTime();

/** Live countdown, shown only when the start is under 30 days away. */
export function Countdown({ start, className }: { start: string; className?: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clock only exists on the client
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return null;
  const ms = startOf(start) - now;
  if (ms <= 0 || ms > 30 * 86_400_000) return null;
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return (
    <span className={className} role="timer">
      Starts in {d}d {h}h {m}m
    </span>
  );
}
