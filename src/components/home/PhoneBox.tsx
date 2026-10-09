"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Easter-egg : la cabine téléphonique rouge, discrète au coin du quai.
 * Un clic la fait sonner, ouvre sa porte, allume sa lumière et laisse un
 * petit message. Sonnerie coupée en mouvement réduit (globals.css).
 */
export function PhoneBox({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setOpen(false), 6000);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <div className={cn("z-10", className)}>
      {open && (
        <p
          role="status"
          className="absolute bottom-full left-0 mb-3 w-56 rounded-2xl rounded-bl-sm bg-cream px-4 py-3 text-sm leading-snug font-medium text-deep shadow-[0_14px_40px_-12px_rgba(0,0,0,0.7)]"
        >
          Allô&nbsp;? Ici Londres… On vous attend au Giron&nbsp;2028&nbsp;!
        </p>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Cabine téléphonique : décrocher"
        aria-pressed={open}
        className={cn(
          "block h-full origin-bottom transition-transform hover:scale-105",
          open && "phone-ringing",
        )}
      >
        <svg aria-hidden viewBox="0 0 40 92" className="h-full w-auto">
          {/* Toit bombé et couronne */}
          <path
            d="M4 16 Q20 4 36 16 Z"
            style={{ fill: "var(--brand-scarlet)" }}
          />
          <rect
            x="17"
            y="3"
            width="6"
            height="5"
            rx="1"
            style={{ fill: "var(--brand-scarlet)" }}
          />
          {/* Caisse */}
          <rect
            x="3"
            y="16"
            width="34"
            height="74"
            rx="1.5"
            style={{ fill: "var(--brand-scarlet)" }}
          />
          <rect x="6" y="19" width="28" height="6" className="fill-deep" />
          <text
            x="20"
            y="23.6"
            textAnchor="middle"
            className="fill-white font-sans text-[3.8px] font-bold tracking-wide"
          >
            TELEPHONE
          </text>
          {/* Porte vitrée : lumière quand elle s'ouvre */}
          <rect
            x="7"
            y="28"
            width="26"
            height="56"
            className={open ? "fill-gold/90" : "fill-deep/70"}
          />
          <g
            className="origin-left transition-transform duration-500 [transform-box:fill-box]"
            style={{ transform: open ? "scaleX(0.28)" : "none" }}
          >
            <rect
              x="7"
              y="28"
              width="26"
              height="56"
              style={{ fill: "var(--brand-scarlet)" }}
            />
            <g style={{ fill: "#ffe7b0" }} fillOpacity={0.55}>
              {[0, 1, 2, 3, 4, 5].map((r) =>
                [0, 1, 2].map((c) => (
                  <rect
                    key={`${r}-${c}`}
                    x={9.5 + c * 7.5}
                    y={30.5 + r * 8}
                    width="6"
                    height="6.5"
                    rx="0.6"
                  />
                )),
              )}
            </g>
            <rect
              x="29"
              y="56"
              width="2"
              height="5"
              rx="1"
              className="fill-gold"
            />
          </g>
        </svg>
      </button>
    </div>
  );
}
