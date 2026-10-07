"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { TreasureStep } from "@/content/treasure";

type TreasureEvent =
  { kind: "found"; step: TreasureStep; fragment: string } | { kind: "decoy" };

// Petite file d'un seul message, partagée par toutes les cachettes
let current: (TreasureEvent & { id: number }) | null = null;
let counter = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function notifyTreasure(event: TreasureEvent) {
  current = { ...event, id: ++counter };
  emit();
}

function dismiss() {
  current = null;
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

/** Notifications de la chasse (fragment trouvé / fausse piste). */
export function TreasureToaster() {
  const event = useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key={event.id}
          role="status"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="tone-night fixed inset-x-4 bottom-4 z-[150] rounded-3xl border border-amber/40 p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[24rem]"
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Fermer"
            className="absolute top-3 right-3 grid size-9 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X aria-hidden className="size-4" />
          </button>
          {event.kind === "found" ? (
            <>
              <p className="eyebrow text-amber">Fragment trouvé</p>
              <p className="mt-2 pr-8 font-display text-xl font-extrabold">
                {event.step.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {event.step.success}
              </p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="rounded-xl border border-amber/50 bg-amber/10 px-3 py-1.5 font-mono text-lg font-bold tracking-[0.3em] text-amber">
                  {event.fragment}
                </span>
                <Link
                  href="/chasse"
                  onClick={dismiss}
                  className="text-sm font-semibold text-white underline decoration-amber decoration-2 underline-offset-4 hover:text-amber"
                >
                  Ouvrir le carnet →
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="eyebrow text-white/60">Fausse piste</p>
              <p className="mt-2 pr-8 text-sm leading-relaxed text-white/80">
                Quelqu&apos;un a semé ceci pour égarer les plus pressés. Rien à
                gagner ici.
              </p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
