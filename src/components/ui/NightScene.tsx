"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { useAmbiance, type Ambiance } from "@/lib/ambiance";
import { cn } from "@/lib/cn";
import { usePointerEffects } from "@/lib/media";
import { LondonSkyline } from "./british/LondonSkyline";
import { Embers } from "./Embers";

/**
 * Ciels superposés au ciel de nuit (par défaut), révélés en fondu selon
 * l'heure locale. Le bas reste sombre pour garder le texte du héros lisible.
 */
const skies: Record<Exclude<Ambiance, "nuit">, string> = {
  aube: [
    "radial-gradient(70% 45% at 18% 78%, rgb(255 150 160 / 0.38), transparent 70%)",
    "radial-gradient(120% 80% at 50% 0%, #3b418f 0%, #1b2259 48%, var(--brand-night) 80%)",
  ].join(","),
  jour: [
    "radial-gradient(55% 45% at 78% 10%, rgb(255 238 196 / 0.24), transparent 70%)",
    "radial-gradient(120% 80% at 50% 0%, #3a5ccc 0%, #1d2d7a 46%, #0b1236 80%)",
  ].join(","),
  crepuscule: [
    "radial-gradient(65% 42% at 50% 80%, rgb(245 128 72 / 0.45), transparent 72%)",
    "radial-gradient(40% 30% at 24% 70%, color-mix(in srgb, var(--brand-scarlet) 24%, transparent), transparent 70%)",
    "radial-gradient(120% 80% at 50% 0%, #4a1f4e 0%, #22183f 46%, var(--brand-night) 78%)",
  ].join(","),
};

/** Visibilité des étoiles selon l'ambiance. */
const starsOpacity: Record<Ambiance, number> = {
  aube: 0.45,
  jour: 0.2,
  crepuscule: 0.6,
  nuit: 1,
};

/**
 * Scène nocturne générée : halos lumineux, guirlande de fête et collines de
 * la Glâne en parallaxe. Sert de fond aux héros tant qu'aucune photo/vidéo
 * officielle n'est fournie.
 *
 * `alive` (héros d'accueil) ajoute : braises, dégradé animé, parallaxe à la
 * souris (desktop) et ciel qui suit l'heure locale.
 */
export function NightScene({
  className,
  intensity = 1,
  garland = true,
  alive = false,
}: {
  className?: string;
  /** Amplitude de la parallaxe (0 = aucune) */
  intensity?: number;
  garland?: boolean;
  alive?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const ambiance = useAmbiance(alive);
  const pointer = usePointerEffects() && alive;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const k = reduce ? 0 : intensity;

  const yFar = useTransform(scrollYProgress, [0, 1], ["0%", `${12 * k}%`]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["0%", `${22 * k}%`]);
  const yNear = useTransform(scrollYProgress, [0, 1], ["0%", `${34 * k}%`]);
  const yGlow = useTransform(scrollYProgress, [0, 1], ["0%", `${-18 * k}%`]);

  // Parallaxe horizontale au déplacement de la souris (desktop uniquement)
  const mx = useSpring(0, { stiffness: 50, damping: 20 });
  useEffect(() => {
    if (!pointer) {
      mx.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse")
        mx.set(e.clientX / window.innerWidth - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointer, mx]);
  const xGlow = useTransform(mx, (v) => v * 40);
  const xStars = useTransform(mx, (v) => v * -8);
  const xFar = useTransform(mx, (v) => v * -12);
  const xMid = useTransform(mx, (v) => v * -22);
  const xNear = useTransform(mx, (v) => v * -34);

  return (
    <div
      ref={ref}
      aria-hidden
      data-ambiance={alive ? ambiance : undefined}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {/* Ciel */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,var(--brand-dusk-2)_0%,var(--brand-dusk)_42%,var(--brand-night)_75%)]" />

      {/* Ciels selon l'heure (fondu d'opacité ; tous masqués au rendu serveur) */}
      {alive &&
        (Object.keys(skies) as Array<keyof typeof skies>).map((key) => (
          <div
            key={key}
            className="absolute inset-0 transition-opacity duration-[1600ms] ease-out"
            style={{
              background: skies[key],
              opacity: ambiance === key ? 1 : 0,
            }}
          />
        ))}

      {/* Dégradé animé, lent et diffus */}
      {alive && <div className="aurora absolute -inset-[20%] animate-aurora" />}

      {/* Halos de lumière */}
      <motion.div style={{ y: yGlow, x: xGlow }} className="absolute inset-0">
        <div className="absolute top-[18%] left-[8%] size-[42vmax] animate-drift rounded-full bg-scarlet/25 blur-[90px]" />
        <div
          className="absolute top-[5%] right-[2%] size-[36vmax] animate-drift rounded-full bg-royal/35 blur-[100px]"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="absolute bottom-[10%] left-[40%] size-[30vmax] animate-drift rounded-full bg-gold/12 blur-[90px]"
          style={{ animationDelay: "-11s" }}
        />
      </motion.div>

      <motion.div
        style={{ x: xStars, opacity: starsOpacity[ambiance] }}
        className="absolute inset-0 transition-opacity duration-[1600ms]"
      >
        <Stars />
      </motion.div>
      {garland && <Garland />}

      {/* Collines — de la plus lointaine à la plus proche */}
      <Hill
        y={yFar}
        x={xFar}
        className="bottom-[14%] text-[color-mix(in_oklab,var(--brand-dusk-2)_55%,var(--brand-night))]"
        d="M0 180 C 140 120 260 150 380 110 C 470 80 520 30 600 40 C 690 52 740 120 860 115 C 990 110 1080 60 1200 90 C 1290 112 1360 100 1440 120 L1440 320 L0 320 Z"
      />
      {/* Accent britannique : Londres au loin, dans la vallée (accueil) */}
      {alive && (
        <motion.div
          style={{ y: yFar, x: xFar }}
          className="absolute -left-[3%] bottom-[20%] h-[22%] min-h-28 w-[106%] text-[color-mix(in_oklab,var(--brand-dusk-2)_42%,var(--brand-night))]"
        >
          <LondonSkyline className="size-full" />
        </motion.div>
      )}

      <Hill
        y={yMid}
        x={xMid}
        className="bottom-[6%] text-[color-mix(in_oklab,var(--brand-dusk)_70%,var(--brand-night))]"
        d="M0 210 C 160 170 300 200 460 165 C 600 135 700 175 820 170 C 980 162 1090 120 1240 140 C 1340 152 1400 170 1440 165 L1440 320 L0 320 Z"
      />
      <Hill
        y={yNear}
        x={xNear}
        className="-bottom-[2%] text-night"
        d="M0 250 C 200 215 360 240 540 222 C 720 205 860 240 1040 228 C 1200 218 1320 236 1440 226 L1440 320 L0 320 Z"
      >
        {/* Petite silhouette de village et de tente de fête */}
        <path d="M600 226 l18 -22 l18 22 z M636 226 v-14 h26 v14 z M700 224 q46 -40 92 0 z M806 226 l10 -14 l10 14 z" />
        <rect x="741" y="176" width="2" height="12" />
      </Hill>

      {/* Braises montant de la place de fête, devant les collines */}
      {alive && <Embers />}

      {/* Voile bas en journée : garantit le contraste du texte du héros */}
      {alive && (
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-night/80 via-night/30 to-transparent transition-opacity duration-[1600ms]"
          style={{ opacity: ambiance === "nuit" ? 0 : 1 }}
        />
      )}
    </div>
  );
}

function Hill({
  d,
  y,
  x,
  className,
  children,
}: {
  d: string;
  y: MotionValue<string>;
  x: MotionValue<number>;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <motion.svg
      style={{ y, x }}
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      className={cn(
        // Légèrement plus larges que l'écran : la parallaxe ne révèle aucun bord
        "absolute -left-[3%] h-[38%] min-h-48 w-[106%] fill-current",
        className,
      )}
    >
      <path d={d} />
      {children}
    </motion.svg>
  );
}

// Positions fixes (pas d'aléatoire au rendu, pour une hydratation stable)
const stars = [
  [6, 12, 1.2],
  [14, 30, 0.8],
  [22, 8, 1],
  [31, 22, 0.7],
  [38, 6, 1.3],
  [47, 18, 0.9],
  [55, 9, 0.7],
  [63, 27, 1.1],
  [71, 12, 0.8],
  [79, 4, 1.2],
  [86, 20, 0.9],
  [93, 10, 1],
  [10, 40, 0.7],
  [27, 36, 0.9],
  [44, 32, 0.6],
  [58, 38, 0.8],
  [75, 34, 0.7],
  [90, 38, 0.9],
] as const;

function Stars() {
  return (
    <svg className="absolute inset-0 size-full">
      {stars.map(([x, y, r], i) => (
        <circle
          key={i}
          cx={`${x}%`}
          cy={`${y}%`}
          r={r}
          className="animate-twinkle fill-white/70"
          style={{ animationDelay: `${(i % 6) * -0.55}s` }}
        />
      ))}
    </svg>
  );
}

const bulbColors = [
  "var(--brand-gold)",
  "var(--brand-scarlet)",
  "#fff6dc",
  "var(--brand-royal-soft)",
];

/** Guirlande lumineuse suspendue en haut de la scène. */
function Garland() {
  const bulbs = Array.from({ length: 21 }, (_, i) => {
    const t = i / 20;
    // Chaînette approximée par une parabole
    return { x: t * 100, y: 6 + 10 * (1 - (2 * t - 1) ** 2), i };
  });
  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className="absolute inset-x-0 top-0 h-[26%] w-full"
    >
      <path
        d="M0 6 Q 50 26 100 6"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.15"
        vectorEffect="non-scaling-stroke"
      />
      {bulbs.map((b) => (
        <ellipse
          key={b.i}
          cx={b.x}
          cy={b.y + 0.9}
          rx="0.45"
          ry="0.9"
          className="animate-twinkle"
          style={{
            // var() dans un attribut SVG n'est pas fiable partout : style
            fill: bulbColors[b.i % bulbColors.length],
            animationDelay: `${(b.i % 5) * -0.7}s`,
            filter: `drop-shadow(0 0 1.2px ${bulbColors[b.i % bulbColors.length]})`,
          }}
        />
      ))}
    </svg>
  );
}
