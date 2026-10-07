"use client";

import { useCallback } from "react";
import { treasureService, useTreasure } from "@/lib/treasure";
import { notifyTreasure } from "./toast";

/**
 * Branche une cachette sur une étape. `active` n'est vrai que pour l'étape
 * en cours d'un joueur : hors partie, la cachette n'existe pas.
 * `attempt(secret)` : un bon secret débloque le fragment, une fausse piste
 * connue l'annonce, tout le reste est SILENCIEUX (aucune aide).
 */
export function useTreasureStep(stepId: string) {
  const progress = useTreasure();
  const active = progress.started && progress.currentStep?.id === stepId;

  const attempt = useCallback(
    async (secret: string) => {
      const result = await treasureService.discoverHint(stepId, secret);
      if (result.ok) {
        notifyTreasure({
          kind: "found",
          step: result.step,
          fragment: result.fragment,
        });
      } else if (result.reason === "decoy") {
        notifyTreasure({ kind: "decoy" });
      }
      return result;
    },
    [stepId],
  );

  return { active, attempt };
}

/** Vrai pendant une partie en cours (pour les leurres). */
export function useHuntInProgress() {
  const progress = useTreasure();
  return progress.started && progress.currentStep !== null;
}
