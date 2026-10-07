"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

const format = (n: number) => Math.round(n).toLocaleString("fr-CH");

/**
 * Nombre qui s'incrémente quand il entre à l'écran. Le HTML serveur contient
 * la valeur finale (SEO, sans JS, mouvement réduit) ; le texte n'est écrit
 * directement dans le DOM que pendant l'animation (aucun re-rendu React).
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1.8,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const final = `${prefix}${format(value)}${suffix}`;

  // Repart de zéro dès le montage (ou affiche la valeur finale en mouvement
  // réduit) ; l'effet suivant prend le relais à l'entrée dans l'écran.
  useEffect(() => {
    if (!ref.current) return;
    ref.current.textContent = reduce ? final : `${prefix}${format(0)}${suffix}`;
  }, [reduce, final, prefix, suffix]);

  useEffect(() => {
    const el = ref.current;
    if (!inView || reduce || !el) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${format(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, prefix, suffix, duration]);

  return (
    <span className={className}>
      <span className="sr-only">{final}</span>
      <span ref={ref} aria-hidden className="tabular-nums">
        {final}
      </span>
    </span>
  );
}
