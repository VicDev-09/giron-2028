"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/** Angles (degrés) des aiguilles pour l'heure actuelle à Londres. */
function londonAngles(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) =>
    Number(parts.find((p) => p.type === t)?.value ?? 0);
  const minutes = get("minute") + get("second") / 60;
  const hours = (get("hour") % 12) + minutes / 60;
  return { hour: hours * 30, minute: minutes * 6 };
}

/**
 * Elizabeth Tower (Big Ben), cadran éclairé et aiguilles animées.
 * Rendu serveur à 10 h 10 (hydratation stable) ; au montage, les aiguilles
 * balaient jusqu'à l'heure de Londres puis tournent en temps réel (CSS,
 * transform). En mouvement réduit : l'heure s'affiche, figée.
 */
export function BigBen({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const { hour, minute } = londonAngles();
    svg.style.setProperty("--hour", `${hour}deg`);
    svg.style.setProperty("--minute", `${minute}deg`);
    if (animated) svg.classList.add("is-running");
  }, [animated]);

  const ticks = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 100 460"
      preserveAspectRatio="xMidYMax meet"
      className={cn("big-ben fill-current", className)}
    >
      {/* Flèche et toit pyramidal */}
      <path d="M50 0 L53 30 L56 34 L54 40 L66 98 L72 104 V120 H28 V104 L34 98 L46 40 L44 34 L47 30 Z" />
      {/* Beffroi (arcades) */}
      <path d="M30 120 H70 V150 H30 Z" />
      <g className="fill-gold/25">
        <path d="M36 124 h6 v20 h-6 Z M47 124 h6 v20 h-6 Z M58 124 h6 v20 h-6 Z" />
      </g>
      {/* Étage de l'horloge */}
      <path d="M24 150 H76 V158 H74 V206 H26 V158 H24 Z" />
      {/* Fût de la tour, nervures verticales */}
      <path d="M29 206 H71 V460 H29 Z" />
      <path
        d="M38 212 V460 M50 212 V460 M62 212 V460"
        className="stroke-white/[0.05]"
        strokeWidth="1"
        fill="none"
      />
      {/* Cadran éclairé */}
      <circle cx="50" cy="181" r="26" className="fill-gold/15" />
      <circle cx="50" cy="181" r="19" fill="#f8eccb" fillOpacity="0.9" />
      <circle
        cx="50"
        cy="181"
        r="19"
        fill="none"
        className="stroke-gold"
        strokeWidth="1.5"
      />
      <g className="stroke-deep" strokeWidth="1.4" strokeLinecap="round">
        {ticks.map((a) => (
          <line
            key={a}
            x1="50"
            y1="164.5"
            x2="50"
            y2={a % 90 === 0 ? 168.5 : 167}
            transform={`rotate(${a} 50 181)`}
          />
        ))}
      </g>
      <g className="stroke-deep" strokeLinecap="round">
        <line
          x1="50"
          y1="181"
          x2="50"
          y2="171"
          strokeWidth="2.4"
          className="big-ben-hour"
        />
        <line
          x1="50"
          y1="181"
          x2="50"
          y2="166"
          strokeWidth="1.6"
          className="big-ben-minute"
        />
      </g>
      <circle cx="50" cy="181" r="1.8" className="fill-deep" />
    </svg>
  );
}
