import type { PointerEvent } from "react";

/** Inclinaison maximale (degrés) des cartes au survol. */
const MAX_TILT = 5;

/**
 * Écrit l'inclinaison et la position du pointeur en variables CSS (aucun
 * re-rendu React). L'effet visuel n'est appliqué que par la classe `.tilt`,
 * elle-même limitée au desktop sans `prefers-reduced-motion` (globals.css).
 */
export function tiltMove(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  el.style.setProperty("--x", `${x}px`);
  el.style.setProperty("--y", `${y}px`);
  if (e.pointerType !== "mouse") return;
  const px = x / rect.width - 0.5;
  const py = y / rect.height - 0.5;
  el.style.setProperty("--ry", `${(px * 2 * MAX_TILT).toFixed(2)}deg`);
  el.style.setProperty("--rx", `${(-py * 2 * MAX_TILT).toFixed(2)}deg`);
}

export function tiltReset(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
}
