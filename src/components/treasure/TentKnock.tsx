"use client";

import { useEffect, useRef } from "react";
import { useTreasureStep } from "./useTreasureStep";

const MARGIN = 14; // tolérance autour du dessin (px)
const PAUSE = 900; // silence qui clôt une série de coups (ms)

/**
 * Cachette « La toile » : compte les coups frappés sur la petite tente
 * dessinée dans l'illustration du héros ([data-treasure-tent]). La zone est
 * calculée sur la position réelle du dessin (parallaxe comprise) ; un clic
 * sur un lien ou un bouton n'est jamais intercepté. Rien n'est affiché.
 */
export function TentKnock() {
  const { active, attempt } = useTreasureStep("toile");
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = marker.current?.closest("section");
    if (!active || !section) return;
    let knocks = 0;
    let timer = 0;

    const onPointerUp = (e: PointerEvent) => {
      if ((e.target as Element).closest("a, button, input, select, textarea")) {
        return;
      }
      const tent = section.querySelector("[data-treasure-tent]");
      const r = tent?.getBoundingClientRect();
      if (
        !r ||
        e.clientX < r.left - MARGIN ||
        e.clientX > r.right + MARGIN ||
        e.clientY < r.top - MARGIN ||
        e.clientY > r.bottom + MARGIN
      ) {
        return;
      }
      knocks += 1;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void attempt(`toile-${knocks}`);
        knocks = 0;
      }, PAUSE);
    };

    section.addEventListener("pointerup", onPointerUp);
    return () => {
      section.removeEventListener("pointerup", onPointerUp);
      window.clearTimeout(timer);
    };
  }, [active, attempt]);

  return <span ref={marker} hidden />;
}
