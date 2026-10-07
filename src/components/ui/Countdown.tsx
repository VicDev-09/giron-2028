"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { useTreasureStep } from "@/components/treasure/useTreasureStep";

// Horloge partagée : une seule minuterie, lue via useSyncExternalStore.
function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 1000);
  return () => window.clearInterval(id);
}
const getSeconds = () => Math.floor(Date.now() / 1000);
const getServerSeconds = () => null;

function split(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  return {
    jours: Math.floor(s / 86400),
    heures: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    secondes: s % 60,
  };
}

const labels = {
  jours: "jours",
  heures: "heures",
  minutes: "min",
  secondes: "sec",
} as const;

interface CountdownProps {
  target: string;
  /** Texte lisible par les lecteurs d'écran, ex. « Début le 13 juillet 2028 » */
  label: string;
  className?: string;
}

export function Countdown({ target, label, className }: CountdownProps) {
  const now = useSyncExternalStore(subscribe, getSeconds, getServerSeconds);
  // Chasse au trésor : cachette « Le sablier » (secret "seconde-<valeur>")
  const sablier = useTreasureStep("sablier");
  const targetSeconds = Math.floor(new Date(target).getTime() / 1000);
  const remaining = now === null ? null : targetSeconds - now;

  if (remaining !== null && remaining <= 0) {
    return (
      <p className={cn("font-display text-3xl font-extrabold", className)}>
        C&apos;est parti — bon Giron&nbsp;!
      </p>
    );
  }

  const parts = remaining === null ? null : split(remaining);

  return (
    <div className={className}>
      <p className="sr-only">{label}</p>
      <div aria-hidden className="grid grid-cols-4 gap-2 sm:gap-3">
        {(Object.keys(labels) as Array<keyof typeof labels>).map((unit) => {
          const value = parts ? parts[unit] : null;
          const text =
            value === null
              ? "--"
              : unit === "jours"
                ? String(value)
                : String(value).padStart(2, "0");
          return (
            <div
              key={unit}
              onClick={
                sablier.active && unit === "secondes"
                  ? () => void sablier.attempt(`seconde-${text}`)
                  : undefined
              }
              className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] px-2 py-3 backdrop-blur-md sm:px-4 sm:py-4"
            >
              <span className="relative block h-[1.1em] overflow-hidden font-display text-3xl leading-none font-extrabold tabular-nums sm:text-5xl">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={text}
                    className="block"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {text}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="mt-2 text-[0.65rem] font-semibold tracking-[0.2em] text-white/70 uppercase sm:text-xs">
                {labels[unit]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
