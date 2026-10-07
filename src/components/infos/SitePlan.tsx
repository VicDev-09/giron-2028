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
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { TreasureDecoy } from "@/components/treasure/TreasureDecoy";
import { useTreasureStep } from "@/components/treasure/useTreasureStep";

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
  icon?: LucideIcon;
}

// PLACEHOLDER — plan indicatif, à remplacer par le plan officiel.
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
    color: "#8fb3ff",
    icon: Info,
  },
  {
    id: "parking",
    label: "Parking",
    x: 20,
    y: 30,
    w: 110,
    h: 90,
    color: "#9aa0ad",
    icon: CircleParking,
  },
  {
    id: "camping",
    label: "Camping",
    x: 290,
    y: 200,
    w: 95,
    h: 50,
    color: "#7fcf6d",
    icon: Tent,
  },
  {
    id: "navettes",
    label: "Navettes",
    x: 20,
    y: 210,
    w: 80,
    h: 40,
    color: "#c9a0ff",
    icon: BusFront,
  },
  {
    id: "velos",
    label: "Vélos",
    x: 110,
    y: 215,
    w: 50,
    h: 35,
    color: "#6dd3e0",
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
    color: "#ff7b91",
    icon: Cross,
  },
];

export function SitePlan() {
  const [active, setActive] = useState<string | null>(null);

  // Chasse au trésor : cachette « Le chemin » — les 4 dernières zones
  // touchées forment le secret "chemin-<a>><b>><c>><d>". Silencieux sinon.
  const chemin = useTreasureStep("chemin");
  const path = useRef<string[]>([]);
  const walk = (id: string) => {
    if (!chemin.active) return;
    path.current = [...path.current, id].slice(-4);
    if (path.current.length === 4) {
      void chemin.attempt(`chemin-${path.current.join(">")}`);
    }
  };

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
                onClick={() => walk(z.id)}
              >
                <rect
                  x={z.x}
                  y={z.y}
                  width={z.w}
                  height={z.h}
                  rx="10"
                  fill={z.color}
                  fillOpacity={isActive ? 0.9 : 0.55}
                  stroke={z.color}
                  strokeWidth="1.5"
                />
                <text
                  x={z.x + z.w / 2}
                  y={z.y + z.h / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[#1b1225] text-[9px] font-bold"
                >
                  {z.short ?? z.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
        {/* Chasse au trésor — leurre (n'existe que pendant une partie) */}
        <TreasureDecoy
          glyph="trefle"
          className="absolute top-[77%] left-[56%] sm:top-[84%] -translate-x-1/2 -translate-y-1/2"
        />
        <p className="absolute right-6 bottom-5 rounded-full bg-elevated/90 px-3 py-1 text-xs font-semibold text-muted">
          Plan indicatif — à confirmer
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
              onClick={() => walk(z.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors",
                active === z.id
                  ? "border-ink bg-elevated"
                  : "border-line hover:border-ink",
              )}
            >
              <span
                aria-hidden
                className="grid size-7 shrink-0 place-items-center rounded-full text-[#1b1225]"
                style={{ background: z.color }}
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
