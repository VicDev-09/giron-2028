"use client";

import { useSyncExternalStore } from "react";

/**
 * Suit une media query côté client. Le rendu serveur (et la première passe
 * d'hydratation) reçoit toujours `false` : les effets « enrichis » n'apparaissent
 * qu'après montage, sans décalage d'hydratation.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Souris ou trackpad (pas d'écran tactile comme pointeur principal). */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/**
 * Vrai seulement si les effets de pointeur sont souhaitables : pointeur fin
 * ET aucune demande de réduction des animations.
 */
export function usePointerEffects() {
  return useMediaQuery(
    `${FINE_POINTER} and (prefers-reduced-motion: no-preference)`,
  );
}
