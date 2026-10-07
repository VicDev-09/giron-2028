"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Fine barre de progression de lecture en haut de l'écran. Seul `scaleX`
 * est animé (GPU). En mouvement réduit, elle suit le défilement sans ressort.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
      className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-gradient-to-r from-amber via-coral to-[#ff3d7f] shadow-[0_0_12px_rgba(255,90,54,0.6)]"
    />
  );
}
