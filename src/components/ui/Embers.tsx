"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface Ember {
  x: number;
  y: number;
  /** Rayon du halo (px CSS) */
  r: number;
  /** Vitesse de montée (px/s) */
  vy: number;
  sway: number;
  phase: number;
  /** Intensité de base, modulée par un scintillement */
  alpha: number;
}

/** Densité allégée sur petits écrans. */
function countFor(width: number) {
  if (width < 640) return 12;
  if (width < 1024) return 22;
  return 38;
}

/** Couleur de marque lue dans les tokens CSS, en rgba (le canvas ne lit pas var()). */
function brand(name: string, alpha: number, fallback: string) {
  const hex =
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback;
  const [r, g, b] = (hex.replace("#", "").match(/\w\w/g) ?? []).map((x) =>
    parseInt(x, 16),
  );
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Halo de braise pré-rendu une fois, puis simplement copié à chaque image. */
function makeSprite() {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255, 248, 230, 1)");
  g.addColorStop(0.18, brand("--brand-gold", 0.9, "#f2c14e"));
  g.addColorStop(0.45, brand("--brand-scarlet", 0.35, "#e8173a"));
  g.addColorStop(1, brand("--brand-scarlet", 0, "#e8173a"));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return c;
}

/**
 * Braises qui montent doucement (canvas 2D, sans dépendance). Pause hors
 * écran et onglet masqué ; rien n'est dessiné en mouvement réduit.
 */
export function Embers({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const sprite = makeSprite();
    if (reduce || !canvas || !ctx || !sprite) return;

    let width = 0;
    let height = 0;
    let embers: Ember[] = [];
    let frame = 0;
    let last = 0;
    let onScreen = true;

    const spawn = (anywhere: boolean): Ember => ({
      x: Math.random() * width,
      // Au démarrage, réparties sur toute la hauteur ; ensuite, depuis le bas
      y: anywhere ? Math.random() * height : height + 10 + Math.random() * 40,
      r: 3 + Math.random() * 6,
      vy: 14 + Math.random() * 34,
      sway: 8 + Math.random() * 22,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.35 + Math.random() * 0.55,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, width < 640 ? 1 : 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = countFor(width);
      embers =
        embers.length === n
          ? embers
          : Array.from({ length: n }, () => spawn(true));
    };

    const draw = (time: number) => {
      const dt = Math.min((time - (last || time)) / 1000, 0.05);
      last = time;
      const t = time / 1000;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.y -= e.vy * dt;
        if (e.y < -20) {
          embers[i] = spawn(false);
          continue;
        }
        const x = e.x + Math.sin(t * 0.8 + e.phase) * e.sway;
        // S'éteignent en approchant du haut ; scintillement léger
        const life = Math.min(1, e.y / (height * 0.55));
        const flicker = 0.75 + 0.25 * Math.sin(t * 6 + e.phase * 3);
        ctx.globalAlpha = Math.max(0, e.alpha * life * flicker);
        const s = e.r * 2;
        ctx.drawImage(sprite, x - e.r, e.y - e.r, s, s);
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (frame || !onScreen || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      ctx.clearRect(0, 0, width, height);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  // Toujours rendu (HTML serveur identique) ; reste vide en mouvement réduit.
  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 size-full",
        className,
      )}
    />
  );
}
