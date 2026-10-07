"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { tiltMove, tiltReset } from "./tilt";

/**
 * Carte avec halo lumineux qui suit le pointeur et léger tilt 3D (desktop).
 * La position est écrite directement en variables CSS (aucun re-rendu React).
 */
export function SpotlightCard({
  children,
  className,
  color = "rgba(255, 90, 54, 0.22)",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <div
      onPointerMove={tiltMove}
      onPointerLeave={tiltReset}
      className={cn(
        "tilt group/spot relative isolate overflow-hidden rounded-3xl border border-line bg-elevated transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_24px_60px_-30px_rgba(255,90,54,0.55)]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), ${color}, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}
