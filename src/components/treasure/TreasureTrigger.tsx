"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

const SECRET_WORD = "giron";

/**
 * Point d'entrée caché n°1 : taper « giron » au clavier (hors champ de
 * saisie) ouvre le carnet de la chasse. Ne rend rien, ne capte aucune
 * touche : la navigation normale n'est jamais gênée.
 */
export function TreasureKeyTrigger() {
  const router = useRouter();

  useEffect(() => {
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        target?.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }
      if (e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-SECRET_WORD.length);
      if (typed === SECRET_WORD) {
        typed = "";
        router.push("/chasse");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return null;
}

/**
 * Point d'entrée caché n°2 (tactile compris) : toucher cinq fois de suite
 * le grand « Giron 28 » du pied de page.
 */
export function TreasureTapTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const taps = useRef<number[]>([]);

  function onClick() {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 2500), now];
    if (taps.current.length >= 5) {
      taps.current = [];
      router.push("/chasse");
    }
  }

  return (
    <p aria-hidden onClick={onClick} className={className}>
      {children}
    </p>
  );
}
