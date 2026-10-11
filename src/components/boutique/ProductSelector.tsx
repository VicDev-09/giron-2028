"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CupSoda,
  Shirt,
  Sparkle,
  type LucideIcon,
} from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { boutique } from "@/content/boutique";
import { cn } from "@/lib/cn";

const icons: Record<string, LucideIcon> = { shirt: Shirt, bottle: CupSoda };
const ease = [0.22, 1, 0.36, 1] as const;

type Slot =
  | { kind: "product" }
  | { kind: "upcoming"; id: string; label: string; icon: LucideIcon };

// Le produit test au centre, un emplacement « Bientôt » de chaque côté
const slots: Slot[] = [
  {
    kind: "upcoming",
    id: boutique.upcoming[0].id,
    label: boutique.upcoming[0].label,
    icon: icons[boutique.upcoming[0].icon],
  },
  { kind: "product" },
  {
    kind: "upcoming",
    id: boutique.upcoming[1].id,
    label: boutique.upcoming[1].label,
    icon: icons[boutique.upcoming[1].icon],
  },
];

/** Écart circulaire de -1 à 1 entre un emplacement et l'actif. */
function offset(index: number, active: number) {
  const n = slots.length;
  let d = (index - active + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

/**
 * Sélecteur de produits « sur le même axe » : les emplacements tournent
 * autour d'un axe vertical (translation, échelle, rotation Y, opacité).
 * Flèches, pastilles-icônes et touches ←/→ ; en mouvement réduit,
 * MotionProvider rend la bascule instantanée.
 */
export function ProductSelector({ targetId }: { targetId: string }) {
  const [active, setActive] = useState(1);
  const go = (delta: number) =>
    setActive((a) => (a + delta + slots.length) % slots.length);
  const current = slots[active];
  const { product } = boutique;

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
    else return;
    e.preventDefault();
  }

  return (
    <div className="flex flex-col items-center">
      <div
        role="group"
        aria-roledescription="carrousel"
        aria-label="Produits de la boutique"
        onKeyDown={onKeyDown}
        className="relative h-[min(68vw,42svh)] w-full max-w-4xl [perspective:1400px] sm:h-[min(52vw,40svh)] [@media(max-height:780px)]:h-[30svh]"
      >
        {slots.map((slot, i) => {
          const d = offset(i, active);
          const isActive = d === 0;
          return (
            <motion.div
              key={slot.kind === "product" ? "product" : slot.id}
              aria-hidden={!isActive}
              initial={false}
              animate={{
                x: `${d * 62}%`,
                scale: isActive ? 1 : 0.58,
                rotateY: d * -32,
                opacity: isActive ? 1 : 0.32,
              }}
              transition={{ duration: 0.7, ease }}
              style={{ zIndex: isActive ? 2 : 1 }}
              className="absolute inset-y-0 left-1/2 aspect-square h-full -translate-x-1/2"
            >
              {slot.kind === "product" ? (
                <div className="group/stage relative size-full">
                  <div
                    aria-hidden
                    className="product-halo absolute inset-[-10%] rounded-full opacity-80 transition-opacity duration-500 group-hover/stage:opacity-100"
                  />
                  <div className="product-float relative size-full">
                    {/* eslint-disable-next-line @next/next/no-img-element -- poster 760×760 transparent, déjà léger */}
                    <img
                      src={product.source.poster}
                      alt={isActive ? product.name : ""}
                      width={760}
                      height={760}
                      fetchPriority="high"
                      className="size-full object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid size-full place-items-center">
                  <div className="grid aspect-square w-[62%] place-items-center rounded-full border border-dashed border-white/25 bg-white/[0.03]">
                    <span className="flex flex-col items-center gap-3 text-white/70">
                      <slot.icon aria-hidden className="size-14" />
                      <span className="text-xs font-semibold tracking-[0.25em] uppercase">
                        Bientôt
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Commandes : flèches + pastilles-icônes */}
      <div className="mt-6 flex items-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Produit précédent"
          className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white/10"
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <div className="flex items-center gap-2">
          {slots.map((slot, i) => {
            const Icon = slot.kind === "product" ? Sparkle : slot.icon;
            const label =
              slot.kind === "product"
                ? product.name
                : `${slot.label} (bientôt)`;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={label}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "grid size-9 place-items-center rounded-full border transition-[background-color,border-color,color] duration-300",
                  i === active
                    ? "border-gold bg-gold text-deep"
                    : "border-white/20 text-white/60 hover:border-white/50 hover:text-white",
                )}
              >
                <Icon aria-hidden className="size-4" />
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Produit suivant"
          className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white/10"
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>

      {/* Nom + sous-titre + CTA du produit sélectionné */}
      <div aria-live="polite" className="mt-6 min-h-36 text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {current.kind === "product" ? product.name : current.label}
        </h2>
        <p className="mt-2 text-white/75">
          {current.kind === "product"
            ? product.subtitle
            : "Bientôt dans la collection"}
        </p>
        <div className="mt-6">
          {current.kind === "product" ? (
            <a
              href={`#${targetId}`}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-royal px-6 font-semibold text-white shadow-[0_8px_30px_-8px_color-mix(in_srgb,var(--brand-royal)_70%,transparent)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-scarlet"
            >
              Voir le produit
              <ChevronRight aria-hidden className="size-4 rotate-90" />
            </a>
          ) : (
            <span className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white/60">
              Bientôt disponible
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
