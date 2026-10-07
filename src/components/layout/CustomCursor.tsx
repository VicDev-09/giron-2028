"use client";

import { useEffect, useRef } from "react";
import { usePointerEffects } from "@/lib/media";

const INTERACTIVE =
  "a[href], button:not([disabled]), [role='button'], summary, label, select";
const TEXT_FIELD = "input, textarea, [contenteditable='true']";

/**
 * Curseur festif : point corail + halo ambré qui le suit avec inertie et
 * grossit sur les éléments interactifs. Desktop uniquement (pointeur fin),
 * jamais sur tactile ni en mouvement réduit : rien n'est alors rendu et le
 * curseur natif reste en place.
 */
export function CustomCursor() {
  const enabled = usePointerEffects();
  return enabled ? <Cursor /> : null;
}

function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const root = document.documentElement;
    const target = { x: -100, y: -100 };
    const ringPos = { ...target };
    let frame = 0;
    let visible = false;

    const setVisible = (v: boolean) => {
      if (v === visible) return;
      visible = v;
      dot.style.opacity = ring.style.opacity = v ? "1" : "0";
      // Le curseur natif n'est masqué que tant que le curseur custom s'affiche
      root.classList.toggle("has-custom-cursor", v);
    };

    const loop = () => {
      // Interpolation simple : le halo rattrape le point en douceur
      ringPos.x += (target.x - ringPos.x) * 0.2;
      ringPos.y += (target.y - ringPos.y) * 0.2;
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      const settled =
        Math.abs(target.x - ringPos.x) < 0.1 &&
        Math.abs(target.y - ringPos.y) < 0.1;
      frame = settled ? 0 : requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") {
        setVisible(false);
        return;
      }
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        ringPos.x = target.x;
        ringPos.y = target.y;
      }
      setVisible(true);
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      const onText = !!el?.closest(TEXT_FIELD);
      root.dataset.cursor = onText
        ? "text"
        : el?.closest(INTERACTIVE)
          ? "hover"
          : "";
    };

    const onDown = () => ring.classList.add("is-pressed");
    const onUp = () => ring.classList.remove("is-pressed");
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      root.classList.remove("has-custom-cursor");
      delete root.dataset.cursor;
    };
  }, []);

  return (
    <div aria-hidden className="cursor-layer">
      <div ref={ringRef} className="cursor-ring">
        <span />
      </div>
      <div ref={dotRef} className="cursor-dot">
        <span />
      </div>
    </div>
  );
}
