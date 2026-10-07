"use client";

import { Clover, Lamp, Sparkle } from "lucide-react";
import { cn } from "@/lib/cn";
import { notifyTreasure } from "./toast";
import { useHuntInProgress } from "./useTreasureStep";

const glyphs = { etoile: Sparkle, lanterne: Lamp, trefle: Clover } as const;

/**
 * LEURRE de la chasse : un éclat bien visible… qui ne mène nulle part.
 * N'apparaît que pendant une partie (jamais pour un visiteur lambda).
 */
export function TreasureDecoy({
  glyph,
  className,
}: {
  glyph: keyof typeof glyphs;
  className?: string;
}) {
  const playing = useHuntInProgress();
  if (!playing) return null;
  const Glyph = glyphs[glyph];

  return (
    <button
      type="button"
      onClick={() => notifyTreasure({ kind: "decoy" })}
      aria-label="Un éclat attire ton regard"
      className={cn(
        "z-20 grid size-11 place-items-center rounded-full text-amber transition-transform duration-300 hover:scale-110 focus-visible:scale-110",
        className,
      )}
    >
      <Glyph
        aria-hidden
        className="treasure-glint size-4 fill-current drop-shadow-[0_0_6px_rgba(255,178,62,0.9)]"
      />
    </button>
  );
}
