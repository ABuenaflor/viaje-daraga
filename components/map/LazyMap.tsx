"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MapCanvasProps } from "./MapCanvas";
import { cn } from "@/lib/utils";

const MapCanvas = dynamic(() => import("./MapCanvas"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

function MapSkeleton() {
  return (
    <div className="grid size-full place-items-center bg-[#eef0ee]">
      <span className="flex items-center gap-2 text-sm text-ash-ink">
        <MapPin aria-hidden className="size-4 animate-bounce" /> Loading map…
      </span>
    </div>
  );
}

/**
 * Loads MapLibre only when the container scrolls near the viewport
 * (or immediately with `eager`), keeping it out of the first-load bundle.
 */
export function LazyMap({ className, eager = false, ...props }: MapCanvasProps & { className?: string; eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(eager);

  useEffect(() => {
    if (show || !ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [show]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {show ? <MapCanvas {...props} /> : <MapSkeleton />}
    </div>
  );
}
