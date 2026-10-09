"use client";

import { useEffect } from "react";

/**
 * Script inline (dans <head>, avant le premier rendu) : la brume d'entrée ne
 * se lève qu'une fois par session. Stockage bloqué : elle se relève, sans
 * gêne (elle ne bloque jamais rien).
 */
export const entryFogScript = `try{if(sessionStorage.getItem("giron:brume"))document.documentElement.classList.add("fog-seen");else sessionStorage.setItem("giron:brume","1")}catch(e){}`;

/**
 * Brume qui se lève sur Londres au premier chargement (CSS pur : visible
 * avant l'hydratation, sans JavaScript). Le contenu est déjà rendu dessous,
 * la brume ne capte aucun clic. Passable : la première interaction l'efface.
 * Absente en mouvement réduit (globals.css).
 */
export function EntryFog() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("fog-seen")) return;
    const skip = () => {
      root.classList.add("fog-skip");
      stop();
    };
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    const stop = () =>
      events.forEach((ev) => window.removeEventListener(ev, skip));
    events.forEach((ev) =>
      window.addEventListener(ev, skip, { passive: true, once: true }),
    );
    const done = window.setTimeout(stop, 1800);
    return () => {
      stop();
      window.clearTimeout(done);
    };
  }, []);

  return <div aria-hidden className="entry-fog" />;
}
