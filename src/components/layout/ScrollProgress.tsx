"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Indicateur de lecture en forme de roundel du métro londonien : l'anneau
 * rouge se remplit avec le défilement. C'est aussi un bouton « haut de
 * page ». En mouvement réduit : pas de ressort, retour en haut instantané.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p > 0.04 !== visible) setVisible(p > 0.04);
  });

  return (
    <motion.button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
      }
      aria-label="Revenir en haut de la page"
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed right-4 bottom-4 z-[55] size-12 rounded-full transition-[opacity,transform] duration-300 hover:scale-110 sm:right-6 sm:bottom-6 sm:size-14",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <svg
        viewBox="0 0 56 56"
        aria-hidden
        className="size-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
      >
        <circle cx="28" cy="28" r="27" className="fill-night/85" />
        <circle
          cx="28"
          cy="28"
          r="19"
          fill="none"
          className="stroke-white/15"
          strokeWidth="7"
        />
        <motion.circle
          cx="28"
          cy="28"
          r="19"
          fill="none"
          className="stroke-scarlet"
          strokeWidth="7"
          transform="rotate(-90 28 28)"
          style={{ pathLength: reduce ? scrollYProgress : smooth }}
        />
        <rect x="3" y="22" width="50" height="12" className="fill-royal" />
        <path
          d="M23 31 L28 25.5 L33 31"
          fill="none"
          className="stroke-white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}
