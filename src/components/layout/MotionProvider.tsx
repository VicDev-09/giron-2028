"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Respecte `prefers-reduced-motion` : les animations de déplacement sont
 * coupées pour les personnes qui le demandent (seules les opacités restent).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
