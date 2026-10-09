"use client";

import {
  motion,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";

/**
 * Brume et pluie de Londres pilotées par le SCROLL du héros (aucune
 * animation continue) : la brume dérive et s'épaissit puis se dissipe, la
 * pluie fine apparaît et glisse avec le défilement. Seuls transform et
 * opacity changent ; l'opacité passe par une variable CSS (l'opacité liée
 * au scroll de framer-motion n'est pas fiable).
 * Mobile : une nappe de moins, pas de pluie. Mouvement réduit : figé.
 */
export function LondonWeather({
  progress,
  reduce,
}: {
  /** Progression du héros : 0 en haut, 1 quand il a quitté l'écran */
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const k = reduce ? 0 : 1;
  // En mouvement réduit, chaque valeur reste figée sur son état initial
  const steps = (to: number[]) => (reduce ? to.map(() => to[0]) : to);

  // Nappe basse, posée sur la ville : s'épaissit puis s'allège
  const lowX = useTransform(progress, [0, 1], ["-3%", `${-3 + 8 * k}%`]);
  const lowO = useTransform(progress, [0, 0.5, 1], steps([0.55, 1, 0.7]));
  // Voile intermédiaire : apparaît en défilant, dérive en sens inverse
  const midX = useTransform(progress, [0, 1], ["4%", `${4 - 10 * k}%`]);
  const midScale = useTransform(progress, [0, 1], [1, 1 + 0.12 * k]);
  const midO = useTransform(progress, [0, 0.5, 1], steps([0.15, 0.6, 0.45]));
  // Brume haute (sous les toits) : se dissipe en montant
  const topY = useTransform(progress, [0, 1], ["0%", `${-30 * k}%`]);
  const topO = useTransform(progress, [0, 0.5, 1], steps([0.45, 0.25, 0.1]));
  // Pluie fine : invisible en haut, glisse plus vite que la page
  const rainY = useTransform(progress, [0, 1], ["-10%", `${-10 + 40 * k}%`]);
  const rainO = useTransform(progress, [0, 0.45, 1], steps([0, 0.32, 0.18]));

  const layer = (o: MotionValue<number>, extra: MotionStyle) =>
    ({ ...extra, "--o": o }) as MotionStyle;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        style={layer(topO, { y: topY })}
        className="fog-layer absolute -inset-x-[10%] top-[4%] h-[30%] [opacity:var(--o)]"
      />
      <motion.div
        style={layer(midO, { x: midX, scale: midScale })}
        className="fog-layer absolute -inset-x-[20%] bottom-[18%] hidden h-[45%] [opacity:var(--o)] sm:block"
      />
      <motion.div
        style={layer(lowO, { x: lowX })}
        className="fog-layer absolute -inset-x-[20%] bottom-[-8%] h-[55%] [opacity:var(--o)]"
      />
      <motion.div
        style={layer(rainO, { y: rainY })}
        className="rain absolute -inset-x-[5%] -top-[20%] hidden h-[140%] [opacity:var(--o)] sm:block"
      />
    </div>
  );
}
