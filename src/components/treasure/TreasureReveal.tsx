"use client";

import { motion } from "framer-motion";
import { Copy, Lock, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { treasure } from "@/content/treasure";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Embers } from "@/components/ui/Embers";
import { treasureService, useTreasure } from "@/lib/treasure";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Page secrète : n'affiche le code que si toutes les étapes sont validées
 * ET que le code assemblé correspond au hash de la configuration.
 */
export function TreasureReveal() {
  const progress = useTreasure();
  const complete = progress.records.length === treasure.steps.length;
  // undefined : en cours de calcul ; null : incohérent
  const [code, setCode] = useState<string | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!progress.ready || !complete) return;
    let alive = true;
    void treasureService.getFinalCode().then((c) => alive && setCode(c));
    return () => {
      alive = false;
    };
  }, [progress.ready, complete]);

  if (!progress.ready || (complete && code === undefined)) {
    return <p className="text-center text-white/70">Ouverture du coffre…</p>;
  }

  if (!complete || code === null) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <Lock aria-hidden className="mx-auto size-10 text-amber" />
        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Ce trésor est encore scellé
        </h1>
        <p className="mt-4 text-lg text-white/80">
          {code === null
            ? "Ton carnet semble incomplet ou altéré : reprends la chasse depuis le carnet."
            : `Rassemble d'abord les ${treasure.steps.length} fragments du carnet pour l'ouvrir.`}
        </p>
        <div className="mt-8">
          <ButtonLink href="/chasse" arrow>
            Ouvrir le carnet
          </ButtonLink>
        </div>
      </div>
    );
  }

  const finishedAt = progress.completedAt
    ? new Intl.DateTimeFormat("fr-CH", {
        dateStyle: "long",
        timeStyle: "medium",
      }).format(progress.completedAt)
    : null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(code ?? "");
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <Embers className="-z-10" />
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 14 }}
          className="mx-auto grid size-20 place-items-center rounded-full bg-gradient-to-br from-amber to-coral text-[#1b1225] shadow-[0_0_60px_rgba(255,178,62,0.6)]"
        >
          <Trophy aria-hidden className="size-10" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="eyebrow mt-8 text-amber"
        >
          {treasure.title}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.3 }}
          className="display-xl mt-4 text-[clamp(3rem,12vw,7rem)]"
        >
          Trésor <span className="text-gradient">trouvé</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.55 }}
          className="relative mt-10 overflow-hidden rounded-3xl border-2 border-dashed border-amber/60 bg-white/[0.05] px-4 py-8 backdrop-blur-sm sm:px-10"
        >
          <p className="text-xs font-semibold tracking-[0.25em] text-white/70 uppercase">
            Ton code secret
          </p>
          <p className="mt-4 font-mono text-[clamp(1.6rem,8vw,3.5rem)] font-bold tracking-[0.12em] break-all text-amber">
            {code}
          </p>
          {finishedAt && (
            <p className="mt-4 text-sm text-white/70">
              Chasse terminée le {finishedAt}
            </p>
          )}
          <div className="mt-6">
            <Button variant="secondary" onClick={copy} className="text-white">
              <span className="inline-flex items-center gap-2">
                <Copy aria-hidden className="size-4" />
                {copied ? "Code copié !" : "Copier le code"}
              </span>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mx-auto mt-10 max-w-xl space-y-3 text-lg leading-relaxed text-white/85"
        >
          <p>{treasure.claim}</p>
          <p className="text-base text-white/70">
            À gagner : <strong className="text-white">{treasure.prize}</strong>
          </p>
        </motion.div>
      </div>
    </>
  );
}
