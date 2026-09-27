import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Storage can throw (private mode, blocked site data) — never let that break the page. */
export const safeStorage = {
  get(store: "local" | "session", key: string): string | null {
    try {
      return (store === "local" ? localStorage : sessionStorage).getItem(key);
    } catch {
      return null;
    }
  },
  set(store: "local" | "session", key: string, value: string) {
    try {
      (store === "local" ? localStorage : sessionStorage).setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};

export function paragraphs(text: string): string[] {
  return text.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
}

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
