import { cn } from "@/lib/cn";

/** Pots de cheminée posés sur une souche : [x, y du sommet, nombre de pots] */
const stacks = [
  [52, 46, 3],
  [176, 34, 4],
  [262, 52, 2],
  [372, 28, 3],
  [470, 44, 4],
  [598, 38, 3],
  [702, 54, 2],
  [806, 30, 4],
  [928, 46, 3],
  [1034, 36, 3],
  [1150, 50, 2],
  [1248, 32, 4],
  [1360, 44, 3],
] as const;

/**
 * Frise de toits & cheminées londoniens, en haut du héros : elle répond à
 * l'horizon du bas. Le pied se fond dans la brume (masque dégradé).
 */
export function Rooftops({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 130"
      preserveAspectRatio="xMidYMax slice"
      className={cn(
        "fill-current [mask-image:linear-gradient(to_bottom,#000_45%,transparent)]",
        className,
      )}
    >
      {/* Toits à deux pans, mansardes et pignons, en rangée continue */}
      <path d="M0 130 V82 l40 -26 l40 26 v-6 h30 l18 -14 h44 l18 14 h12 l46 -30 l46 30 v-8 h40 v-12 l20 -10 l20 10 v12 h36 l40 -24 l40 24 h14 l18 -12 h50 l18 12 v-4 h26 l44 -28 l44 28 h20 v-10 h56 v10 h18 l38 -24 l38 24 h12 l20 -14 h48 l20 14 v-6 h28 l42 -26 l42 26 h18 v-12 h44 v12 h22 l40 -22 l40 22 h10 l18 -12 h46 l18 12 h16 l44 -28 l44 28 V130 Z" />
      {/* Souches et pots de cheminée */}
      {stacks.map(([x, y, pots]) => (
        <g key={x}>
          <rect x={x} y={y} width={pots * 9 + 6} height={130 - y} />
          <rect x={x - 3} y={y} width={pots * 9 + 12} height="4" />
          {Array.from({ length: pots }, (_, i) => (
            <rect
              key={i}
              x={x + 4 + i * 9}
              y={y - 10}
              width="6"
              height="10"
              rx="1"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
