"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { useAmbiance, type Ambiance } from "@/lib/ambiance";
import { cn } from "@/lib/cn";
import { usePointerEffects } from "@/lib/media";
import { BigBen } from "./london/BigBen";
import { DoubleDecker } from "./london/DoubleDecker";
import {
  SkylineFar,
  SkylineLandmarks,
  SkylineNear,
} from "./london/LondonSkyline";
import { LondonWeather } from "./london/LondonWeather";
import { Rooftops } from "./london/Rooftops";

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
 * Scène « Londres la nuit » des héros : ciel (selon l'heure sur l'accueil),
 * frise de toits et cheminées en haut, horizon de Londres en bas (ville,
 * monuments, Big Ben, quai). Sert de fond tant qu'aucune photo/vidéo
 * officielle n'est fournie.
 *
 * `alive` (héros d'accueil) ajoute : ciel selon l'heure locale, dégradé
 * animé, Big Ben à l'heure de Londres, London Eye qui tourne, bus à
 * impériale, brume et pluie fine, parallaxe à la souris (desktop).
 * Ailleurs, et en mouvement réduit : décor statique.
 */
export function NightScene({
  className,
  intensity = 1,
  alive = false,
}: {
  className?: string;
  /** Amplitude de la parallaxe (0 = aucune) */
  intensity?: number;
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

      {/* Frise de toits et cheminées (en haut, se fond dans la brume) */}
      <motion.div
        style={{ x: xStars }}
        className="absolute -left-[3%] top-0 h-[15%] max-h-36 min-h-16 w-[106%] text-[color-mix(in_oklab,var(--brand-night)_85%,var(--brand-dusk))]"
      >
        <Rooftops className="size-full" />
      </motion.div>

      {/* Lueur de la ville à l'horizon : détache les silhouettes du ciel */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(75%_65%_at_50%_100%,color-mix(in_srgb,var(--brand-royal)_30%,transparent),color-mix(in_srgb,var(--brand-gold)_6%,transparent)_45%,transparent_75%)]" />

      {/* Horizon de Londres — du plus lointain au plus proche */}
      <motion.div
        style={{ y: yFar, x: xFar }}
        className="absolute -left-[3%] bottom-[6%] h-[27%] min-h-24 w-[106%] text-[color-mix(in_oklab,var(--brand-dusk-2)_52%,var(--brand-night))]"
      >
        <SkylineFar className="size-full" />
      </motion.div>
      <motion.div
        style={{ y: yMid, x: xMid }}
        className="absolute -left-[3%] bottom-[2%] h-[33%] min-h-36 w-[106%] text-[color-mix(in_oklab,var(--brand-dusk)_62%,var(--brand-night))]"
      >
        <SkylineLandmarks className="size-full" eyeTurning={alive} />
      </motion.div>
      <motion.div
        style={{ y: yMid, x: xMid }}
        className="absolute right-[3%] bottom-[3%] h-[26%] text-[color-mix(in_oklab,var(--brand-dusk)_40%,var(--brand-night))] sm:right-[8%] sm:h-[64%] sm:max-h-[680px]"
      >
        <BigBen className="h-full w-auto" animated={alive} />
      </motion.div>

      {/* Bus à impériale sur le quai (accueil) */}
      {alive && (
        <motion.div
          style={{ y: yNear }}
          className="absolute inset-x-0 bottom-[4%] h-[5%] max-h-20 min-h-7 sm:bottom-[5%] sm:h-[7%] sm:min-h-9"
        >
          <div className="bus bus-drive absolute bottom-0 left-0 h-full">
            <DoubleDecker className="h-full w-auto" />
          </div>
        </motion.div>
      )}

      <motion.div
        style={{ y: yNear, x: xNear }}
        className="absolute -left-[3%] -bottom-px h-[9%] min-h-10 w-[106%] text-night"
      >
        <SkylineNear className="size-full" />
      </motion.div>

      {/* Brume et pluie fine (accueil) */}
      {alive && <LondonWeather />}

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
