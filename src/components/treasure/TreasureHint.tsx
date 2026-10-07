"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clover, Lamp, Sparkle, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { treasure, type TreasureStep } from "@/content/treasure";
import { cn } from "@/lib/cn";
import { treasureService, useTreasure } from "@/lib/treasure";

const glyphs = { etoile: Sparkle, lanterne: Lamp, trefle: Clover } as const;

/**
 * Indice caché de la chasse au trésor. N'existe dans la page QUE pour un
 * joueur dont c'est l'étape en cours : un visiteur lambda ne voit rien.
 * Placement : <TreasureHint step="id" className="absolute …" /> dans un
 * parent positionné.
 */
export function TreasureHint({
  step,
  className,
}: {
  step: string;
  className?: string;
}) {
  const progress = useTreasure();
  const config = treasure.steps.find((s) => s.id === step);
  const [found, setFound] = useState<{
    step: TreasureStep;
    fragment: string;
  } | null>(null);

  const active =
    !!config?.token && progress.started && progress.currentStep?.id === step;
  const Glyph = glyphs[config?.glyph ?? "etoile"];

  async function onActivate() {
    if (!config?.token) return;
    const result = await treasureService.discoverHint(step, config.token);
    if (result.ok) setFound({ step: result.step, fragment: result.fragment });
  }

  return (
    <>
      {active && (
        <button
          type="button"
          onClick={onActivate}
          aria-label="Un éclat inhabituel attire ton regard"
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
      )}
      {found &&
        createPortal(
          <FoundToast {...found} onClose={() => setFound(null)} />,
          document.body,
        )}
    </>
  );
}

function FoundToast({
  step,
  fragment,
  onClose,
}: {
  step: TreasureStep;
  fragment: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        role="status"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="tone-night fixed inset-x-4 bottom-4 z-[150] rounded-3xl border border-amber/40 p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[24rem]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X aria-hidden className="size-4" />
        </button>
        <p className="eyebrow text-amber">Fragment trouvé !</p>
        <p className="mt-2 pr-8 font-display text-xl font-extrabold">
          {step.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/80">
          {step.success}
        </p>
        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="rounded-xl border border-amber/50 bg-amber/10 px-3 py-1.5 font-mono text-lg font-bold tracking-[0.3em] text-amber">
            {fragment}
          </span>
          <Link
            href="/chasse"
            onClick={onClose}
            className="text-sm font-semibold text-white underline decoration-amber decoration-2 underline-offset-4 hover:text-amber"
          >
            Ouvrir le carnet →
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
