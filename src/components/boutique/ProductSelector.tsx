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
import { boutique, products, type BoutiqueProduct } from "@/content/boutique";
import { cn } from "@/lib/cn";
import { ProductStage } from "./ProductStage";

const icons: Record<string, LucideIcon> = { shirt: Shirt, bottle: CupSoda };
const ease = [0.22, 1, 0.36, 1] as const;

type Slot =
  | { kind: "product"; product: BoutiqueProduct }
  | { kind: "awaiting" }
  | { kind: "upcoming"; id: string; label: string; icon: LucideIcon };

const upcoming: Slot[] = boutique.upcoming.map((u) => ({
  kind: "upcoming",
  id: u.id,
  label: u.label,
  icon: icons[u.icon],
}));

/**
 * Emplacements : les produits au centre, un « Bientôt » de chaque côté.
 * Sans produit, un emplacement « Produit à venir » prend le centre.
 */
const center: Slot[] = products.length
  ? products.map((product) => ({ kind: "product", product }))
  : [{ kind: "awaiting" }];
const slots: Slot[] = [upcoming[0], ...center, upcoming[1]];
const START = 1;
/** Rien à faire défiler tant qu'il n'y a aucun produit. */
const navigable = products.length > 0;

/** Écart circulaire entre un emplacement et l'actif (-n/2 … n/2). */
function offset(index: number, active: number) {
  const n = slots.length;
  let d = (index - active + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

function slotKey(slot: Slot) {
  if (slot.kind === "product") return slot.product.id;
  return slot.kind === "upcoming" ? slot.id : "awaiting";
}

/**
 * Sélecteur de produits « sur le même axe » : les emplacements tournent
 * autour d'un axe vertical (translation, échelle, rotation Y, opacité).
 * Flèches, pastilles-icônes et touches ←/→ (désactivées tant qu'aucun
 * produit n'existe) ; en mouvement réduit, MotionProvider rend la bascule
 * instantanée.
 */
export function ProductSelector({ targetId }: { targetId: string }) {
  const [active, setActive] = useState(START);
  const go = (delta: number) =>
    navigable && setActive((a) => (a + delta + slots.length) % slots.length);
  const current = slots[active];

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!navigable) return;
    if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
    else return;
    e.preventDefault();
  }

  const title =
    current.kind === "product"
      ? current.product.name
      : current.kind === "awaiting"
        ? boutique.upcomingProduct.name
        : current.label;
  const subtitle =
    current.kind === "product"
      ? current.product.subtitle
      : current.kind === "awaiting"
        ? boutique.upcomingProduct.subtitle
        : "Bientôt dans la collection";

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
          const hidden = Math.abs(d) > 1;
          return (
            <motion.div
              key={slotKey(slot)}
              aria-hidden={!isActive}
              initial={false}
              animate={{
                x: `${d * 62}%`,
                scale: isActive ? 1 : 0.58,
                rotateY: d * -32,
                opacity: hidden ? 0 : isActive ? 1 : 0.32,
              }}
              transition={{ duration: 0.7, ease }}
              style={{ zIndex: isActive ? 2 : 1 }}
              className="absolute inset-y-0 left-1/2 aspect-square h-full -translate-x-1/2"
            >
              {slot.kind === "product" ? (
                <ProductStage
                  source={slot.product.source}
                  label={slot.product.name}
                  draggable={false}
                  className="product-float size-full"
                />
              ) : slot.kind === "awaiting" ? (
                <ProductStage
                  label={boutique.upcomingProduct.name}
                  draggable={false}
                  className="size-full"
                />
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

      {/* Commandes : flèches (+ pastilles-icônes quand il y a des produits) */}
      <div className="mt-6 flex items-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={!navigable}
          aria-label="Produit précédent"
          className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition-colors enabled:hover:border-white enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        {navigable && (
          <div className="flex items-center gap-2">
            {slots.map((slot, i) => {
              const Icon = slot.kind === "upcoming" ? slot.icon : Sparkle;
              const label =
                slot.kind === "product"
                  ? slot.product.name
                  : slot.kind === "upcoming"
                    ? `${slot.label} (bientôt)`
                    : boutique.upcomingProduct.name;
              return (
                <button
                  key={slotKey(slot)}
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
        )}
        <button
          type="button"
          onClick={() => go(1)}
          disabled={!navigable}
          aria-label="Produit suivant"
          className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition-colors enabled:hover:border-white enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>

      {/* Nom + sous-titre + CTA de l'emplacement sélectionné */}
      <div aria-live="polite" className="mt-6 min-h-36 text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-white/75">{subtitle}</p>
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
            <span className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white/70">
              Bientôt disponible
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
