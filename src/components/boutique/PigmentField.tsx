"use client";

import type { MotionValue } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Pigment {
  angle: number;
  radius: number;
  speed: number;
  height: number;
  bob: number;
  size: number;
  sprite: number;
  alpha: number;
}

/** Couleur de marque lue dans les tokens CSS, en rgba (le canvas ne lit pas var()). */
function brand(name: string, fallback: string, alpha: number) {
  const raw =
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback;
  const [r, g, b] = (raw.replace("#", "").match(/\w\w/g) ?? []).map((x) =>
    parseInt(x, 16),
  );
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Halos pré-rendus (ambre, prune, rouge, bleu) : un drawImage par pigment. */
function makeSprites() {
  const prune = "#7d2b62";
  const colors = [
    [brand("--brand-gold", "#f2c14e", 1), brand("--brand-gold", "#f2c14e", 0)],
    [`${prune}`, "rgba(125, 43, 98, 0)"],
    [
      brand("--brand-scarlet", "#e8173a", 1),
      brand("--brand-scarlet", "#e8173a", 0),
    ],
    [
      brand("--brand-royal-soft", "#7a98ff", 1),
      brand("--brand-royal-soft", "#7a98ff", 0),
    ],
  ];
  return colors.map(([inner, outer]) => {
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const ctx = c.getContext("2d");
    if (!ctx) return c;
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, "rgba(255, 248, 230, 0.95)");
    g.addColorStop(0.25, inner);
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 32, 32);
    return c;
  });
}

// Répartition des teintes : surtout ambre et prune, un peu de rouge et bleu
const spriteWeights = [0, 0, 0, 1, 1, 1, 2, 2, 3];

function countFor(width: number) {
  if (width < 640) return 34;
  if (width < 1024) return 60;
  return 110;
}

/**
 * Pigments en orbite autour du produit (canvas 2D, sans dépendance) : les
 * particules tourbillonnent sur une ellipse ; celles « derrière » le
 * produit sont peintes sur le canvas arrière, les autres devant, d'où la
 * profondeur. `boost` (vitesse de scroll) accélère légèrement le tourbillon.
 * Pause hors écran / onglet masqué ; rien en mouvement réduit.
 */
export function PigmentField({
  children,
  boost,
  className,
}: {
  children: ReactNode;
  /** Intensité liée au scroll (0 = repos) */
  boost?: MotionValue<number>;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const back = backRef.current?.getContext("2d");
    const front = frontRef.current?.getContext("2d");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || !wrap || !back || !front) return;

    const sprites = makeSprites();
    let width = 0;
    let height = 0;
    let pigments: Pigment[] = [];
    let frame = 0;
    let last = 0;
    let visible = true;

    const spawn = (): Pigment => ({
      angle: Math.random() * Math.PI * 2,
      radius: 0.24 + Math.random() * 0.26,
      speed: (0.12 + Math.random() * 0.22) * (Math.random() < 0.5 ? 1 : 0.8),
      height: (Math.random() - 0.5) * 0.5,
      bob: Math.random() * Math.PI * 2,
      size: 2 + Math.random() * 5,
      sprite: spriteWeights[Math.floor(Math.random() * spriteWeights.length)],
      alpha: 0.35 + Math.random() * 0.5,
    });

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, width < 640 ? 1 : 1.5);
      for (const ctx of [back, front]) {
        ctx.canvas.width = Math.round(width * dpr);
        ctx.canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      const n = countFor(window.innerWidth);
      if (pigments.length !== n) pigments = Array.from({ length: n }, spawn);
    };

    const draw = (time: number) => {
      const dt = Math.min((time - (last || time)) / 1000, 0.05);
      last = time;
      const t = time / 1000;
      const speedUp = 1 + Math.min(Math.abs(boost?.get() ?? 0), 3);
      const cx = width / 2;
      const cy = height / 2;
      const span = Math.min(width, height);
      for (const ctx of [back, front]) {
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = "lighter";
      }
      for (const p of pigments) {
        p.angle += p.speed * dt * speedUp;
        const depth = Math.sin(p.angle); // > 0 : devant le produit
        const r = p.radius * span;
        const x = cx + Math.cos(p.angle) * r;
        const y =
          cy +
          depth * r * 0.28 +
          p.height * span +
          Math.sin(t * 0.8 + p.bob) * 6;
        const scale = 0.75 + (depth + 1) * 0.25;
        const s = p.size * scale;
        const ctx = depth > 0 ? front : back;
        ctx.globalAlpha = p.alpha * (0.55 + (depth + 1) * 0.225);
        ctx.drawImage(sprites[p.sprite], x - s, y - s, s * 2, s * 2);
      }
      back.globalAlpha = front.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (frame || !visible || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(wrap);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [boost]);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <canvas
        ref={backRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      />
      <div className="relative">{children}</div>
      <canvas
        ref={frontRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      />
    </div>
  );
}
