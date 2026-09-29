"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Scène nocturne générée : halos lumineux, guirlande de fête et collines de
 * la Glâne en parallaxe. Sert de fond aux héros tant qu'aucune photo/vidéo
 * officielle n'est fournie.
 */
export function NightScene({
  className,
  intensity = 1,
  garland = true,
}: {
  className?: string;
  /** Amplitude de la parallaxe (0 = aucune) */
  intensity?: number;
  garland?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const k = reduce ? 0 : intensity;

  const yFar = useTransform(scrollYProgress, [0, 1], ["0%", `${12 * k}%`]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["0%", `${22 * k}%`]);
  const yNear = useTransform(scrollYProgress, [0, 1], ["0%", `${34 * k}%`]);
  const yGlow = useTransform(scrollYProgress, [0, 1], ["0%", `${-18 * k}%`]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {/* Ciel */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#3d1d5c_0%,#1c0e2c_45%,#120a1c_75%)]" />

      {/* Halos de lumière */}
      <motion.div style={{ y: yGlow }} className="absolute inset-0">
        <div className="absolute top-[18%] left-[8%] size-[42vmax] animate-drift rounded-full bg-coral/30 blur-[90px]" />
        <div
          className="absolute top-[5%] right-[2%] size-[36vmax] animate-drift rounded-full bg-amber/25 blur-[100px]"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="absolute bottom-[10%] left-[40%] size-[30vmax] animate-drift rounded-full bg-[#ff3d7f]/20 blur-[90px]"
          style={{ animationDelay: "-11s" }}
        />
      </motion.div>

      <Stars />
      {garland && <Garland />}

      {/* Collines — de la plus lointaine à la plus proche */}
      <Hill
        y={yFar}
        className="bottom-[14%] text-[#2e1747]"
        d="M0 180 C 140 120 260 150 380 110 C 470 80 520 30 600 40 C 690 52 740 120 860 115 C 990 110 1080 60 1200 90 C 1290 112 1360 100 1440 120 L1440 320 L0 320 Z"
      />
      <Hill
        y={yMid}
        className="bottom-[6%] text-[#22113a]"
        d="M0 210 C 160 170 300 200 460 165 C 600 135 700 175 820 170 C 980 162 1090 120 1240 140 C 1340 152 1400 170 1440 165 L1440 320 L0 320 Z"
      />
      <Hill
        y={yNear}
        className="-bottom-[2%] text-[#120a1c]"
        d="M0 250 C 200 215 360 240 540 222 C 720 205 860 240 1040 228 C 1200 218 1320 236 1440 226 L1440 320 L0 320 Z"
      >
        {/* Petite silhouette de village et de tente de fête */}
        <path d="M600 226 l18 -22 l18 22 z M636 226 v-14 h26 v14 z M700 224 q46 -40 92 0 z M806 226 l10 -14 l10 14 z" />
        <rect x="741" y="176" width="2" height="12" />
      </Hill>
    </div>
  );
}

function Hill({
  d,
  y,
  className,
  children,
}: {
  d: string;
  y: MotionValue<string>;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <motion.svg
      style={{ y }}
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      className={cn(
        "absolute left-0 h-[38%] min-h-48 w-full fill-current",
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

const bulbColors = ["#ffb23e", "#ff5a36", "#ffe3a3", "#ff3d7f"];

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
          fill={bulbColors[b.i % bulbColors.length]}
          className="animate-twinkle"
          style={{
            animationDelay: `${(b.i % 5) * -0.7}s`,
            filter: `drop-shadow(0 0 1.2px ${bulbColors[b.i % bulbColors.length]})`,
          }}
        />
      ))}
    </svg>
  );
}
