import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Accents britanniques discrets (thème « Nuit britannique »). SVG inline
 * légers, couleurs tirées des tokens de marque : un seul accent par page.
 */

/**
 * Panneau façon métro londonien : anneau rouge traversé d'une barre bleue
 * portant le texte. Contraste : blanc sur bleu royal (AA).
 */
export function TubeSign({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn("relative my-[0.8em] inline-flex items-center", className)}
    >
      {/* Anneau rouge, traversé en son centre par la barre bleue */}
      <span
        aria-hidden
        className="absolute top-1/2 left-[0.35em] size-[3.1em] -translate-y-1/2 rounded-full border-[0.55em] border-scarlet"
      />
      <span className="relative bg-royal py-[0.4em] pr-[0.9em] pl-[3.9em] leading-none text-white">
        {children}
      </span>
    </span>
  );
}

/** Couronne géométrique moderne (La Jeunesse). */
export function Crown({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 64 44" className={cn("fill-gold", className)}>
      <path d="M6 34 L2 10 L18 22 L32 4 L46 22 L62 10 L58 34 Z" />
      <rect x="6" y="37" width="52" height="6" rx="2" />
      <circle cx="2.5" cy="8.5" r="2.5" />
      <circle cx="32" cy="3" r="3" />
      <circle cx="61.5" cy="8.5" r="2.5" />
      <circle cx="32" cy="24" r="3.2" className="fill-scarlet" />
      <circle cx="18" cy="28" r="2.2" className="fill-royal-soft" />
      <circle cx="46" cy="28" r="2.2" className="fill-royal-soft" />
    </svg>
  );
}

/** Chardon d'Écosse stylisé (Bénévoles). */
export function Thistle({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 48 64" className={className}>
      <g className="fill-thistle">
        <path d="M24 4 l3 9 l5 -7 l-1 10 l7 -4 l-4 9 H14 l-4 -9 l7 4 l-1 -10 l5 7 Z" />
      </g>
      <g className="fill-thistle-leaf">
        <path d="M12 22 h24 q0 14 -12 18 q-12 -4 -12 -18 Z" />
        <path d="M23 40 h2 v22 h-2 Z" />
        <path d="M24 50 q-12 -2 -18 -12 q10 2 18 8 Z M24 54 q12 -2 18 -12 q-10 2 -18 8 Z" />
      </g>
      <path
        d="M14 26 l20 10 M34 26 l-20 10"
        className="stroke-night/25"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}
