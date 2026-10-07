/**
 * Persistance locale de la progression. localStorage peut être indisponible
 * (navigation privée, stockage bloqué…) : chaque accès est protégé et l'on
 * se replie sur une mémoire de session (la partie continue, sans sauvegarde).
 */

export const STORAGE_KEY = "giron2028:chasse";

let memory: string | null = null;

export function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return memory;
  }
}

export function writeRaw(value: string) {
  memory = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Stockage bloqué : la mémoire de session prend le relais
  }
}

export function clearRaw() {
  memory = null;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
