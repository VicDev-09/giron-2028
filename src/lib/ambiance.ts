"use client";

import { useSyncExternalStore } from "react";

export const ambiances = ["aube", "jour", "crepuscule", "nuit"] as const;
export type Ambiance = (typeof ambiances)[number];

/** Ambiance rendue au build et pendant l'hydratation (identité « Nuit de Glâne »). */
export const DEFAULT_AMBIANCE: Ambiance = "nuit";

/** Tranches horaires locales → ambiance. */
export function ambianceAt(hour: number): Ambiance {
  if (hour >= 5 && hour < 8) return "aube";
  if (hour >= 8 && hour < 17) return "jour";
  if (hour >= 17 && hour < 21) return "crepuscule";
  return "nuit";
}

function isAmbiance(value: string | null): value is Ambiance {
  return ambiances.includes(value as Ambiance);
}

function subscribe(callback: () => void) {
  // Re-vérifie chaque minute : l'ambiance suit l'heure si la page reste ouverte
  const id = window.setInterval(callback, 60_000);
  return () => window.clearInterval(id);
}

function getSnapshot(): Ambiance {
  // Aperçu pour la relecture : ?ambiance=aube|jour|crepuscule|nuit
  const forced = new URLSearchParams(window.location.search).get("ambiance");
  return isAmbiance(forced) ? forced : ambianceAt(new Date().getHours());
}

/**
 * Ambiance du ciel selon l'heure locale du visiteur. Calculée uniquement
 * côté client après l'hydratation : le serveur rend toujours l'ambiance par
 * défaut, d'où aucun décalage d'hydratation.
 */
export function useAmbiance(enabled = true): Ambiance {
  const ambiance = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => DEFAULT_AMBIANCE,
  );
  return enabled ? ambiance : DEFAULT_AMBIANCE;
}
