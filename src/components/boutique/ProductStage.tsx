"use client";

import {
  motionValue,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { tiltMove, tiltReset } from "@/components/ui/tilt";

/**
 * Source du visuel produit.
 *
 * POINT D'EXTENSION 360° : aujourd'hui `image` (un PNG détouré). Pour un vrai
 * spin, fournir `sequence` (images ordonnées sur un tour complet) et piloter
 * la prop `spin` (0 → 1) depuis la page — scroll, glisser ou autoplay. Ni la
 * page ni les autres sections n'ont à changer : seul ce composant décide
 * comment afficher la source.
 */
export type ProductSource =
  | { kind: "image"; src: string; alt: string }
  | { kind: "sequence"; frames: readonly string[]; alt: string };

/**
 * Scène produit : visuel, halo, flottement doux et tilt 3D au survol
 * (desktop). Le flottement et le tilt sont coupés en mouvement réduit
 * (globals.css) ; le tilt n'existe qu'avec un pointeur fin.
 * Si l'image est introuvable, un t-shirt dessiné prend le relais.
 */
export function ProductStage({
  source,
  className,
  float = true,
  interactive = true,
  priority = false,
  spin,
  /** Gros plan : zoom centré sur un point du visuel (0–1) */
  focus,
  sizes = "(min-width: 1024px) 40vw, 80vw",
}: {
  source: ProductSource;
  className?: string;
  float?: boolean;
  interactive?: boolean;
  priority?: boolean;
  spin?: MotionValue<number>;
  focus?: { x: number; y: number; scale: number };
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [frame, setFrame] = useState(0);
  const frames = source.kind === "sequence" ? source.frames : null;

  // Séquence 360° : l'image affichée suit `spin` (0 → 1 = un tour)
  useMotionValueEvent(spin ?? NO_SPIN, "change", (v) => {
    if (!frames?.length) return;
    const i = Math.round((((v % 1) + 1) % 1) * (frames.length - 1));
    if (i !== frame) setFrame(i);
  });

  const src = frames
    ? frames[frame]
    : source.kind === "image"
      ? source.src
      : "";
  const zoom = focus
    ? {
        transform: `scale(${focus.scale})`,
        transformOrigin: `${focus.x * 100}% ${focus.y * 100}%`,
      }
    : undefined;

  return (
    <div
      onPointerMove={interactive ? tiltMove : undefined}
      onPointerLeave={interactive ? tiltReset : undefined}
      className={cn(
        "group/stage relative aspect-[4/5]",
        interactive && "tilt",
        className,
      )}
    >
      {/* Halo / projecteur, plus intense au survol */}
      <div
        aria-hidden
        className="product-halo absolute inset-[-12%] rounded-full opacity-80 transition-opacity duration-500 group-hover/stage:opacity-100"
      />
      <div className={cn("absolute inset-0", float && "product-float")}>
        <div className="absolute inset-0" style={zoom}>
          {failed || !src ? (
            <TshirtFallback label={source.alt} />
          ) : (
            <Image
              src={src}
              alt={source.alt}
              fill
              priority={priority}
              sizes={sizes}
              onError={() => setFailed(true)}
              className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Valeur neutre pour l'abonnement quand aucune rotation n'est fournie
const NO_SPIN = motionValue(0);

/** T-shirt dessiné (repli tant que le visuel n'est pas déposé). */
function TshirtFallback({ label }: { label: string }) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 400 500"
      className="size-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
    >
      <defs>
        <linearGradient id="tee-shade" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.25" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path
        d="M140 40 Q200 78 260 40 L352 82 Q372 92 376 114 L392 196 L326 212 L316 176 L318 470 Q200 488 82 470 L84 176 L74 212 L8 196 L24 114 Q28 92 48 82 Z"
        style={{
          fill: "color-mix(in oklab, var(--brand-dusk-2) 55%, var(--brand-night))",
          stroke:
            "color-mix(in srgb, var(--brand-royal-soft) 45%, transparent)",
          strokeWidth: 2,
        }}
      />
      <path
        d="M140 40 Q200 78 260 40 L352 82 Q372 92 376 114 L392 196 L326 212 L316 176 L318 470 Q200 488 82 470 L84 176 L74 212 L8 196 L24 114 Q28 92 48 82 Z"
        fill="url(#tee-shade)"
      />
      <path
        d="M140 40 Q200 78 260 40"
        fill="none"
        style={{ stroke: "var(--brand-dusk-2)" }}
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Logo poitrine : badge « 28 » + GIRON */}
      <g transform="translate(200 170)">
        <rect
          x="-26"
          y="-26"
          width="52"
          height="52"
          rx="12"
          style={{ fill: "var(--brand-scarlet)" }}
        />
        <text
          y="10"
          textAnchor="middle"
          className="fill-white font-display text-[28px] font-extrabold"
        >
          28
        </text>
        <text
          y="58"
          textAnchor="middle"
          className="fill-[#f5f3ec] font-display text-[26px] font-extrabold tracking-[0.12em]"
        >
          GIRON
        </text>
        <rect
          x="-40"
          y="70"
          width="80"
          height="3"
          rx="1.5"
          style={{ fill: "var(--brand-gold)" }}
        />
      </g>
    </svg>
  );
}
