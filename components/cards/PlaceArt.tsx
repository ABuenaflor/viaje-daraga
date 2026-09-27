import type { Category } from "@/data/schema";
import { categoryMeta } from "@/lib/categories";
import { cn } from "@/lib/utils";

// Illustrative artwork used until licensed photos are supplied (§2.6).
const palettes: Record<Category, [string, string, string]> = {
  heritage: ["#F3D9B8", "#E7A77A", "#8A4B2A"],
  "nature-adventure": ["#DCEBD2", "#9BC287", "#3F6B28"],
  emerging: ["#E8DDF3", "#C4A6E0", "#5E3A86"],
  restaurant: ["#F8D9C9", "#EE9B7E", "#9E2A1E"],
  cafe: ["#EFE2D2", "#CFAE8B", "#5A3A1E"],
  tambayan: ["#FCE3C8", "#F2A66C", "#A8400E"],
  hotel: ["#DCE8F2", "#9CBFDA", "#2F5D7C"],
  transport: ["#E6E3DF", "#B9B2AA", "#4A4540"],
  service: ["#E6E3DF", "#B9B2AA", "#4A4540"],
  "day-trip": ["#D6ECE8", "#93C8BE", "#2E6A61"],
};

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function PlaceArt({
  id,
  category,
  className,
  showIcon = true,
}: {
  id: string;
  category: Category;
  className?: string;
  showIcon?: boolean;
}) {
  const [sky, mid, deep] = palettes[category];
  const h = hash(id);
  const sunX = 60 + (h % 220);
  const peakX = 150 + ((h >> 3) % 110);
  const gid = `g-${id}`;
  const Icon = categoryMeta[category].icon;

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ backgroundColor: sky }}>
      <svg
        viewBox="0 0 400 260"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={sky} />
            <stop offset="1" stopColor={mid} />
          </linearGradient>
        </defs>
        <rect width="400" height="260" fill={`url(#${gid})`} />
        <circle cx={sunX} cy="70" r="26" fill="#fff" opacity=".55" />
        {/* Mayon cone */}
        <path
          d={`M${peakX - 190} 260 L${peakX - 12} 78 Q${peakX} 66 ${peakX + 12} 78 L${peakX + 190} 260 Z`}
          fill={deep}
          opacity=".35"
        />
        <path d={`M${peakX - 22} 92 Q${peakX} 72 ${peakX + 22} 92 L${peakX + 8} 84 L${peakX} 88 L${peakX - 8} 84 Z`} fill="#fff" opacity=".45" />
        {/* Hills / rice terraces */}
        <path d="M0 200 Q100 170 200 196 T400 186 V260 H0 Z" fill={deep} opacity=".45" />
        <path d="M0 226 Q120 204 240 226 T400 220 V260 H0 Z" fill={deep} opacity=".7" />
        <path d="M0 214 Q120 196 240 214" stroke="#fff" strokeOpacity=".25" fill="none" />
      </svg>
      {showIcon && (
        <span className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full bg-white/80 text-ink backdrop-blur">
          <Icon aria-hidden className="size-4" />
        </span>
      )}
    </div>
  );
}
