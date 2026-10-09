"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

const red = { fill: "var(--brand-scarlet)" };
const redDark = {
  fill: "color-mix(in oklab, var(--brand-scarlet) 78%, var(--brand-night))",
};

/**
 * Cabine téléphonique rouge (type K6), illustration principale de la page
 * Contact. Un clic la fait sonner, ouvre la porte sur l'intérieur éclairé
 * et laisse un message avec l'adresse e-mail. Sonnerie et ouverture
 * coupées/instantanées en mouvement réduit (globals.css).
 */
export function PhoneBooth({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setOpen(false), 9000);
    return () => window.clearTimeout(timer);
  }, [open]);

  const panes = Array.from({ length: 8 }, (_, r) =>
    Array.from({ length: 3 }, (_, c) => ({ x: 50 + c * 42, y: 158 + r * 36 })),
  ).flat();

  return (
    <div className={cn("relative", className)}>
      {/* Halo au sol et lumière diffuse */}
      <div
        aria-hidden
        className="absolute inset-x-[10%] bottom-0 h-10 rounded-[50%] bg-black/25 blur-xl"
      />
      <div
        aria-hidden
        className={cn(
          "absolute inset-[15%] rounded-full bg-gold/30 blur-3xl transition-opacity duration-700",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-pressed={open}
        aria-label={open ? "Raccrocher le téléphone" : "Décrocher le téléphone"}
        className={cn(
          "relative block h-full origin-bottom transition-transform duration-300 hover:-translate-y-1",
          open && "phone-ringing",
        )}
      >
        <svg aria-hidden viewBox="0 0 220 530" className="h-full w-auto">
          {/* Dôme, fronton et couronne */}
          <path d="M14 112 Q110 30 206 112 Z" style={red} />
          <path
            d="M22 112 Q110 46 198 112"
            fill="none"
            stroke="rgb(0 0 0 / 0.18)"
            strokeWidth="3"
          />
          <rect x="10" y="108" width="200" height="10" rx="2" style={redDark} />
          <g transform="translate(92 62)" className="fill-gold">
            <path d="M3 22 L1 6 L10 14 L18 2 L26 14 L35 6 L33 22 Z" />
            <rect x="3" y="24" width="30" height="4" rx="1" />
          </g>

          {/* Caisse, pilastres et socle */}
          <rect x="22" y="118" width="176" height="384" style={red} />
          <rect x="22" y="118" width="18" height="384" style={redDark} />
          <rect x="180" y="118" width="18" height="384" style={redDark} />
          <rect x="8" y="500" width="204" height="26" rx="3" style={redDark} />

          {/* Bandeau « TELEPHONE » */}
          <rect
            x="44"
            y="124"
            width="132"
            height="24"
            rx="2"
            className="fill-deep"
          />
          <text
            x="110"
            y="141"
            textAnchor="middle"
            className="fill-white font-sans text-[13px] font-bold tracking-[0.18em]"
          >
            TELEPHONE
          </text>

          {/* Intérieur (visible porte ouverte) : mur éclairé, téléphone */}
          <rect
            x="46"
            y="154"
            width="128"
            height="296"
            className={open ? "fill-[#ffe2a0]" : "fill-deep"}
          />
          <g
            className={cn(
              "transition-opacity duration-500",
              open ? "opacity-100" : "opacity-0",
            )}
          >
            <rect
              x="92"
              y="236"
              width="38"
              height="52"
              rx="4"
              className="fill-deep"
            />
            <rect
              x="98"
              y="244"
              width="26"
              height="14"
              rx="2"
              className="fill-white/70"
            />
            <path
              d="M92 268 q-14 -2 -14 14 v20 q0 10 10 10"
              fill="none"
              className="stroke-deep"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <rect
              x="72"
              y="300"
              width="22"
              height="9"
              rx="4"
              className="fill-deep"
            />
          </g>

          {/* Porte vitrée (charnière à gauche) */}
          <g
            className="origin-left transition-transform duration-700 ease-out [transform-box:fill-box]"
            style={{ transform: open ? "scaleX(0.14)" : "none" }}
          >
            <rect x="44" y="152" width="132" height="300" style={red} />
            {panes.map((p) => (
              <rect
                key={`${p.x}-${p.y}`}
                x={p.x}
                y={p.y}
                width="36"
                height="30"
                rx="1.5"
                className="fill-[color-mix(in_oklab,var(--brand-night)_70%,var(--brand-royal))]"
              />
            ))}
            {/* Reflet sur le vitrage */}
            <path
              d="M54 162 l26 0 l-26 60 Z M96 300 l20 0 l-34 80 l-20 0 Z"
              className="fill-white/10"
            />
            <rect
              x="166"
              y="288"
              width="5"
              height="34"
              rx="2"
              className="fill-gold"
            />
          </g>

          {/* Plaques basses */}
          <rect x="44" y="462" width="132" height="28" rx="2" style={redDark} />
        </svg>
      </button>

      {open && (
        <div
          role="status"
          className="absolute top-[16%] left-1/2 w-[min(16rem,80vw)] -translate-x-1/2 rounded-2xl bg-cream px-5 py-4 text-left text-deep shadow-[0_18px_50px_-16px_rgba(0,0,0,0.6)] ring-1 ring-black/5"
        >
          <p className="font-display text-lg leading-tight font-extrabold">
            Allô&nbsp;? Ici le Giron&nbsp;2028.
          </p>
          <p className="mt-1 text-sm leading-snug">
            On décroche toujours… surtout par e-mail&nbsp;:
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-2 inline-block text-sm font-bold text-royal underline underline-offset-4"
          >
            {site.email}
          </a>
        </div>
      )}
    </div>
  );
}
