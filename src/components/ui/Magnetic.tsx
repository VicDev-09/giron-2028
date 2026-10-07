"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { usePointerEffects } from "@/lib/media";

const spring = { stiffness: 220, damping: 18, mass: 0.4 };

/**
 * Attire légèrement son contenu vers le curseur (desktop uniquement).
 * Sur tactile ou en mouvement réduit, rend un simple conteneur inerte.
 */
export function Magnetic({
  children,
  strength = 0.22,
  className,
}: {
  children: ReactNode;
  /** Part du décalage pointeur → contenu (0 = aucun) */
  strength?: number;
  className?: string;
}) {
  const enabled = usePointerEffects();
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);

  function onPointerMove(e: PointerEvent<HTMLSpanElement>) {
    if (!enabled || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={enabled ? { x, y } : undefined}
      className={className ?? "inline-flex"}
    >
      {children}
    </motion.span>
  );
}
