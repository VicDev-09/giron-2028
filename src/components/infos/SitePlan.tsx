"use client";

import { motion } from "framer-motion";
import {
  Bike,
  BusFront,
  CircleParking,
  Cross,
  Info,
  Tent,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { TubeSign } from "@/components/ui/british/motifs";

interface Zone {
  id: string;
  label: string;
  /** Libellé court affiché dans le plan (défaut : label) */
  short?: string;
  /** Rectangle arrondi dans un repère 400 × 260 */
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  /** Contour (défaut : `color`) */
  stroke?: string;
  icon?: LucideIcon;
}

// PLACEHOLDER — plan indicatif, à remplacer par le plan officiel.
// Couleurs : lieux = tokens --venue-* ; services = clins d'œil aux lignes du
// métro londonien, choisis pour rester distincts des quatre lieux.
const zones: Zone[] = [
  {
    id: "cantine",
    label: "Cantine",
    x: 150,
    y: 30,
    w: 130,
    h: 80,
    color: "var(--venue-cantine)",
  },
  {
    id: "tonnelle",
    label: "Tonnelle",
    x: 150,
    y: 130,
    w: 90,
    h: 70,
    color: "var(--venue-tonnelle)",
  },
  {
    id: "caveau",
    label: "Caveau",
    x: 255,
    y: 130,
    w: 60,
    h: 50,
    color: "var(--venue-caveau)",
  },
  {
    id: "jeux",
    label: "Jeux enfants",
    short: "Jeux",
    x: 300,
    y: 30,
    w: 80,
    h: 70,
    color: "var(--venue-jeux)",
  },
  {
    id: "accueil",
    label: "Accueil & cashless",
    short: "Accueil",
    x: 60,
    y: 150,
    w: 70,
    h: 45,
    color: "#8fb3ff", // bleu ciel
    icon: Info,
  },
  {
    id: "parking",
    label: "Parking",
    x: 20,
    y: 30,
    w: 110,
    h: 90,
    color: "#a0a5a9", // gris « Jubilee »
    icon: CircleParking,
  },
  {
    id: "camping",
    label: "Camping",
    x: 290,
    y: 200,
    w: 95,
    h: 50,
    color: "#f4a9be", // rose « Hammersmith & City »
    icon: Tent,
  },
  {
    id: "navettes",
    label: "Navettes",
    x: 20,
    y: 210,
    w: 80,
    h: 40,
    color: "#f59a42", // orange « Overground »
    icon: BusFront,
  },
  {
    id: "velos",
    label: "Vélos",
    x: 110,
    y: 215,
    w: 50,
    h: 35,
    color: "#5fd0f0", // cyan « Victoria »
    icon: Bike,
  },
  {
    id: "secours",
    label: "Samaritains",
    short: "Secours",
    x: 330,
    y: 130,
    w: 50,
    h: 50,
    color: "#ffffff", // blanc à contour rouge (premiers secours)
    stroke: "var(--brand-scarlet)",
    icon: Cross,
  },
];

export function SitePlan() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-sunken p-3 sm:p-5">
        <svg
          viewBox="0 0 400 260"
          role="img"
          aria-label="Plan indicatif de la place de fête"
          className="h-auto w-full"
        >
          <defs>
            <pattern
              id="grass"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="0.6" className="fill-muted/20" />
            </pattern>
          </defs>
          <rect width="400" height="260" rx="16" fill="url(#grass)" />
          {/* Route d'accès */}
          <path
            d="M0 135 H140 V255"
            fill="none"
            className="stroke-line"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M0 135 H140 V255"
            fill="none"
            className="stroke-muted/50"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          {zones.map((z) => {
            const isActive = active === z.id;
            const dimmed = active !== null && !isActive;
            return (
              <motion.g
                key={z.id}
                animate={{
                  opacity: dimmed ? 0.3 : 1,
                  scale: isActive ? 1.04 : 1,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  transformOrigin: `${z.x + z.w / 2}px ${z.y + z.h / 2}px`,
                }}
                onPointerEnter={() => setActive(z.id)}
                onPointerLeave={() => setActive(null)}
              >
                <rect
                  x={z.x}
                  y={z.y}
                  width={z.w}
                  height={z.h}
                  rx="10"
                  fillOpacity={isActive ? 0.9 : 0.55}
                  strokeWidth="1.5"
                  // var() dans un attribut SVG n'est pas fiable partout : style
                  style={{ fill: z.color, stroke: z.stroke ?? z.color }}
                />
                <text
                  x={z.x + z.w / 2}
                  y={z.y + z.h / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-deep text-[9px] font-bold"
                >
                  {z.short ?? z.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
        <p className="mt-2 flex justify-end text-[0.65rem] font-semibold tracking-[0.08em] uppercase sm:text-xs">
          <TubeSign>Plan indicatif — à confirmer</TubeSign>
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-2 self-start lg:grid-cols-1">
        {zones.map((z) => (
          <li key={z.id}>
            <button
              type="button"
              onPointerEnter={() => setActive(z.id)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(z.id)}
              onBlur={() => setActive(null)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors",
                active === z.id
                  ? "border-ink bg-elevated"
                  : "border-line hover:border-ink",
              )}
            >
              <span
                aria-hidden
                className="grid size-7 shrink-0 place-items-center rounded-full text-deep"
                style={{
                  background: z.color,
                  boxShadow: z.stroke
                    ? `inset 0 0 0 2px ${z.stroke}`
                    : undefined,
                }}
              >
                {z.icon && <z.icon className="size-4" />}
              </span>
              {z.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
