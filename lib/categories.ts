import {
  Bed,
  Bus,
  Church,
  Coffee,
  Compass,
  Info,
  Mountain,
  Sparkles,
  Store,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/data/schema";

export const categoryMeta: Record<
  Category,
  { label: string; plural: string; icon: LucideIcon; color: string; href: string }
> = {
  heritage: { label: "Heritage", plural: "Heritage", icon: Church, color: "#8A4B2A", href: "/explore?cat=heritage" },
  "nature-adventure": { label: "Nature & adventure", plural: "Nature & adventure", icon: Mountain, color: "#4E7A30", href: "/explore?cat=nature-adventure" },
  emerging: { label: "Emerging", plural: "Emerging spots", icon: Sparkles, color: "#7B4BA8", href: "/explore?cat=emerging" },
  restaurant: { label: "Restaurant", plural: "Restaurants", icon: Utensils, color: "#B91C1C", href: "/eat" },
  cafe: { label: "Café", plural: "Cafés", icon: Coffee, color: "#6B4423", href: "/cafes" },
  tambayan: { label: "Tambayan", plural: "Tambayan", icon: Store, color: "#C4410C", href: "/cafes#tambayan" },
  hotel: { label: "Stay", plural: "Hotels & inns", icon: Bed, color: "#2F5D7C", href: "/stay" },
  transport: { label: "Transport", plural: "Transport", icon: Bus, color: "#4A4540", href: "/plan#getting-there" },
  service: { label: "Service", plural: "Services", icon: Info, color: "#4A4540", href: "/about#contacts" },
  "day-trip": { label: "Day trip", plural: "Day trips", icon: Compass, color: "#3F7D74", href: "/explore?cat=day-trip" },
};

export function prettyTag(tag: string): string {
  const special: Record<string, string> = {
    "mayon-view": "Mayon view",
    "national-cultural-treasure": "National Cultural Treasure",
    wifi: "Wi-Fi",
    "3-star": "3-star",
  };
  return special[tag] ?? tag.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}
