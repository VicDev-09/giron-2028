"use client";

import { useState } from "react";
import { navigation } from "@/content/site";

/** Vrai dès que l'application a hydraté une première fois. */
export const appState = { hydrated: false };

const stations: Record<string, string> = Object.fromEntries([
  ["/", "Accueil"],
  ...navigation.map((item) => [item.href, item.label]),
]);

/**
 * Annonce façon métro londonien à chaque changement de page : « Prochain
 * arrêt » + « Mind the gap ». Animation CSS (aucun état à gérer), jamais au
 * premier chargement, absente en mouvement réduit. Décorative : le
 * changement de page est déjà annoncé par Next aux lecteurs d'écran.
 */
export function TubeAnnounce({ pathname }: { pathname: string }) {
  // Monté à chaque navigation (clé = chemin) ; faux lors de l'hydratation
  const [show] = useState(() => appState.hydrated);
  if (!show) return null;

  const station =
    stations[pathname] ??
    stations[`/${pathname.split("/")[1]}`] ??
    "Giron 2028";

  return (
    <div
      aria-hidden
      className="tube-announce tone-night fixed bottom-5 left-1/2 z-[70] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="relative grid size-9 shrink-0 place-items-center">
          <span className="absolute inset-0 rounded-full border-[5px] border-scarlet" />
          <span className="relative h-2.5 w-11 bg-royal" />
        </span>
        <span className="min-w-0">
          <span className="block text-[0.65rem] font-semibold tracking-[0.2em] text-white/70 uppercase">
            Prochain arrêt
          </span>
          <span className="block truncate font-display text-lg leading-tight font-extrabold">
            {station}
          </span>
        </span>
      </div>
      <p className="bg-gold py-1 text-center text-[0.65rem] font-bold tracking-[0.35em] text-deep uppercase">
        Mind the gap
      </p>
    </div>
  );
}
