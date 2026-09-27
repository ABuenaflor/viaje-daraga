"use client";

import { AnimatePresence, m } from "motion/react";
import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Native share when available, otherwise copy link — morphs to a check on success. */
export function ShareButton({ title, path, className }: { title: string; path: string; className?: string }) {
  const [done, setDone] = useState(false);

  const onClick = async () => {
    const url = new URL(path, window.location.origin).toString();
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      /* user cancelled */
    }
  };

  return (
    <button type="button" onClick={onClick} className={cn("btn-ghost", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={done ? "done" : "idle"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          className="grid place-items-center"
        >
          {done ? <Check aria-hidden className="size-4 text-rice" /> : <Share2 aria-hidden className="size-4" />}
        </m.span>
      </AnimatePresence>
      <span aria-live="polite">{done ? "Shared" : "Share"}</span>
    </button>
  );
}
