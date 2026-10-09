import { cn } from "@/lib/cn";

/**
 * Silhouette discrète de Londres (accent britannique de l'accueil) :
 * Elizabeth Tower et Westminster, London Eye, St Paul's, Tower Bridge,
 * The Shard et The Gherkin. Une seule forme pleine (`currentColor`), sans
 * image ni animation. Recadrée au centre sur petits écrans.
 */
export function LondonSkyline({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 220"
      preserveAspectRatio="xMidYMax slice"
      className={cn("fill-current", className)}
    >
      {/* Immeubles bas de liaison */}
      <path d="M0 220 V176 h40 v-18 h36 v28 h30 v-40 h28 v52 h40 v-30 h34 v20 h40 v-36 h28 V220 Z" />
      {/* Elizabeth Tower (Big Ben) */}
      <path d="M296 220 V96 h-6 V70 h4 V54 l18 -36 l18 36 v16 h4 v26 h-6 V220 Z" />
      {/* Palais de Westminster */}
      <path d="M330 220 V150 h14 v-22 h8 v22 h30 v-14 h10 v14 h34 v-22 h8 v22 h30 v-10 h10 v10 h18 V220 Z" />
      {/* London Eye */}
      <circle
        cx="580"
        cy="120"
        r="66"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
      />
      <path d="M580 120 L548 220 h10 l22 -88 l22 88 h10 Z" />
      <circle cx="580" cy="120" r="7" />
      {/* St Paul's */}
      <path d="M680 220 V170 h12 v-12 q36 -62 72 0 v12 h12 V220 Z M724 112 h6 v-14 h-6 Z" />
      {/* Tower Bridge */}
      <path d="M850 220 V178 h236 V220 h-14 v-30 H904 v30 Z" />
      <path d="M884 220 V82 l16 -26 l16 26 V220 Z M1020 220 V82 l16 -26 l16 26 V220 Z" />
      <path d="M916 100 h104 v10 H916 Z" />
      {/* The Shard */}
      <path d="M1150 220 L1186 22 L1194 40 L1226 220 Z" />
      {/* The Gherkin */}
      <path d="M1262 220 C1256 150 1268 92 1288 80 C1308 92 1320 150 1314 220 Z" />
      {/* Immeubles bas de liaison */}
      <path d="M1320 220 V170 h30 v-24 h28 v34 h26 v-20 h36 V220 Z" />
    </svg>
  );
}
