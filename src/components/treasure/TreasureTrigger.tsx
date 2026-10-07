"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type MouseEvent } from "react";
import { useTreasure } from "@/lib/treasure";
import { useTreasureStep } from "./useTreasureStep";

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
 * Grand filigrane « Giron 28 » du pied de page.
 *  • Hors partie : point d'entrée caché n°2 (tactile compris) — le toucher
 *    cinq fois de suite ouvre le carnet.
 *  • Pendant la partie : cachette « À rebours » — ses deux parties touchées
 *    dans un certain ordre (secret "rebours-<partie>><partie>").
 */
export function TreasureTapTrigger({ className }: { className?: string }) {
  const router = useRouter();
  const progress = useTreasure();
  const { active, attempt } = useTreasureStep("rebours");
  const taps = useRef<number[]>([]);
  const parts = useRef<string[]>([]);

  function onClick(e: MouseEvent<HTMLParagraphElement>) {
    if (progress.started) {
      if (!active) return;
      const part = (e.target as HTMLElement).dataset.part;
      if (!part) return;
      parts.current = [...parts.current, part].slice(-2);
      if (parts.current.length === 2) {
        void attempt(`rebours-${parts.current.join(">")}`);
        parts.current = [];
      }
      return;
    }
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 2500), now];
    if (taps.current.length >= 5) {
      taps.current = [];
      router.push("/chasse");
    }
  }

  return (
    <p aria-hidden onClick={onClick} className={className}>
      <span data-part="giron">Giron</span> <span data-part="28">28</span>
    </p>
  );
}
