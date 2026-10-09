import { cn } from "@/lib/cn";

/**
 * Horizon de Londres en trois plans (silhouettes SVG inline, `currentColor`).
 * Les plans sont séparés pour la profondeur et la parallaxe :
 *  - far        : ville lointaine, quelques fenêtres éclairées ;
 *  - landmarks  : Westminster, London Eye, St Paul's, Tower Bridge,
 *                 The Shard, The Gherkin (Big Ben est un composant à part) ;
 *  - near       : quai de la Tamise, balustrade et réverbères (route du bus).
 * Recadrage centré sur petits écrans (`slice`).
 */

const svgProps = {
  "aria-hidden": true,
  preserveAspectRatio: "xMidYMax slice",
} as const;

// Fenêtres éclairées de la ville lointaine (positions fixes : rendu stable)
const windows = [
  [40, 196],
  [52, 204],
  [118, 188],
  [126, 210],
  [210, 200],
  [226, 186],
  [318, 206],
  [404, 192],
  [512, 202],
  [596, 190],
  [604, 208],
  [702, 198],
  [790, 186],
  [884, 204],
  [968, 194],
  [1046, 206],
  [1130, 190],
  [1214, 202],
  [1298, 196],
  [1306, 184],
  [1390, 204],
] as const;

export function SkylineFar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 240"
      {...svgProps}
      className={cn("fill-current", className)}
    >
      <path d="M0 240 V196 h22 v-20 h30 v14 h26 v-30 h34 v22 h22 v-12 h40 v26 h28 v-34 h36 v18 h30 v-8 h28 v22 h34 v-28 h26 v16 h40 v-24 h30 v30 h36 v-18 h24 v10 h34 v-30 h30 v20 h40 v-14 h28 v24 h30 v-32 h36 v18 h26 v-10 h40 v22 h28 v-26 h34 v14 h30 v-20 h36 v28 h28 v-16 h40 v10 h30 v-24 h34 v18 h28 v-30 h36 v22 h30 v-12 h40 v18 h26 v-22 h34 v14 h22 v-18 h40 v12 h36 v-20 h40 v26 h30 v-14 h68 V240 Z" />
      <g className="fill-gold/50">
        {windows.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="4" height="5" rx="0.5" />
        ))}
      </g>
    </svg>
  );
}

export function SkylineLandmarks({
  className,
  eyeTurning = false,
}: {
  className?: string;
  /** London Eye en rotation lente (accueil, hors reduced-motion) */
  eyeTurning?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1440 240"
      {...svgProps}
      className={cn("fill-current", className)}
    >
      {/* Palais de Westminster */}
      <path d="M40 240 V170 h10 v-14 l6 -10 l6 10 v14 h22 v-10 h8 v10 h26 v-16 l5 -8 l5 8 v16 h24 v-10 h8 v10 h26 v-14 l6 -10 l6 10 v14 h24 v-10 h8 v10 h22 v-22 l7 -12 l7 12 v22 h20 V240 Z" />
      {/* London Eye : pieds + roue */}
      <path d="M430 130 L384 240 h12 l34 -92 l34 92 h12 Z" />
      <g
        className={cn(
          "[transform-box:fill-box] [transform-origin:center]",
          eyeTurning && "animate-eye",
        )}
      >
        <circle
          cx="430"
          cy="130"
          r="92"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
        <circle
          cx="430"
          cy="130"
          r="84"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <g stroke="currentColor" strokeWidth="1.2">
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return (
              <line
                key={i}
                x1="430"
                y1="130"
                x2={(430 + Math.cos(a) * 88).toFixed(1)}
                y2={(130 + Math.sin(a) * 88).toFixed(1)}
              />
            );
          })}
        </g>
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2 + 0.2;
          return (
            <rect
              key={i}
              x={(430 + Math.cos(a) * 95 - 4).toFixed(1)}
              y={(130 + Math.sin(a) * 95 - 3).toFixed(1)}
              width="8"
              height="6"
              rx="3"
            />
          );
        })}
      </g>
      <circle cx="430" cy="130" r="8" />
      {/* St Paul's : tours ouest, tambour, dôme, lanterne */}
      <path d="M600 240 V176 h12 v-26 l6 -10 l6 10 v26 h20 v-18 h10 v-12 q30 -58 60 0 v12 h10 v18 h20 v-26 l6 -10 l6 10 v26 h12 V240 Z M676 86 h8 v-14 h-8 Z M679 72 h2 v-10 h-2 Z" />
      {/* Tower Bridge : tablier, tours, passerelles, câbles */}
      <path d="M836 240 V196 h300 V240 h-16 v-28 H852 v28 Z" />
      <path d="M884 240 V102 l-6 -2 l6 -14 l4 -16 l4 16 v-6 l6 -12 l6 12 v6 l4 -16 l4 16 l6 14 l-6 2 V240 Z M1050 240 V102 l-6 -2 l6 -14 l4 -16 l4 16 v-6 l6 -12 l6 12 v6 l4 -16 l4 16 l6 14 l-6 2 V240 Z" />
      <path d="M914 112 h136 v8 H914 Z M914 126 h136 v6 H914 Z" />
      <path
        d="M836 196 Q860 150 884 120 M1080 120 Q1104 150 1136 196"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      {/* The Shard */}
      <path d="M1186 240 L1222 18 L1230 34 L1262 240 Z" />
      {/* The Gherkin */}
      <path d="M1296 240 C1290 168 1302 110 1322 98 C1342 110 1354 168 1348 240 Z" />
      {/* Immeubles de liaison */}
      <path d="M0 240 V200 h40 V240 Z M300 240 V188 h26 v-12 h30 v20 h28 V240 Z M772 240 V182 h30 v-10 h34 V240 Z M1136 240 V190 h26 v-14 h24 V240 Z M1262 240 V194 h34 V240 Z M1348 240 V184 h40 v20 h52 V240 Z" />
    </svg>
  );
}

export function SkylineNear({ className }: { className?: string }) {
  const lamps = Array.from({ length: 13 }, (_, i) => 40 + i * 113);
  return (
    <svg
      viewBox="0 0 1440 80"
      {...svgProps}
      className={cn("fill-current", className)}
    >
      {/* Quai : parapet et balustres */}
      <path d="M0 80 V44 h1440 V80 Z" />
      <path d="M0 44 V38 h1440 V44 Z" />
      <g>
        {Array.from({ length: 72 }, (_, i) => (
          <rect key={i} x={i * 20 + 6} y="30" width="8" height="10" rx="3" />
        ))}
      </g>
      <path d="M0 30 V26 h1440 V30 Z" />
      {/* Réverbères : fût + lanterne éclairée */}
      {lamps.map((x) => (
        <g key={x}>
          <rect x={x - 1.5} y="2" width="3" height="26" />
          <rect x={x - 5} y="0" width="10" height="4" rx="1" />
          <circle cx={x} cy="7" r="3.2" className="fill-gold/80" />
          <circle cx={x} cy="7" r="9" className="fill-gold/10" />
        </g>
      ))}
    </svg>
  );
}
