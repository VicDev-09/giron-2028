"use client";

import { useSyncExternalStore } from "react";
import { SERVER_PROGRESS, treasureService } from "./service";

export {
  formatCode,
  treasureService,
  type AttemptResult,
  type StepRecord,
  type TreasureProgress,
  type TreasureService,
} from "./service";

/**
 * Progression de la chasse, réactive. Le rendu serveur et l'hydratation
 * reçoivent toujours l'état vide (`ready: false`) : aucun décalage.
 */
export function useTreasure() {
  return useSyncExternalStore(
    treasureService.subscribe,
    treasureService.getProgress,
    () => SERVER_PROGRESS,
  );
}
