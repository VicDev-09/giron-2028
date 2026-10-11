"use client";

import {
  motionValue,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Source du visuel produit.
 *  - `sequence` (AUJOURD'HUI) : images d'un tour complet, dans l'ordre.
 *  - `model` (PLUS TARD) : modèle 3D .glb — voir le TODO dans `ModelStage`.
 * La page ne connaît que ce type et la prop `rotation` : passer d'une
 * séquence à un vrai modèle 3D ne demande aucune refonte de la page.
 */
export type ProductSource =
  | { kind: "sequence"; frames: readonly string[]; poster: string }
  | { kind: "model"; src: string };

const NO_ROTATION = motionValue(0);

/**
 * Scène produit 360°. `rotation` est exprimée en tours (0 → 1 = un tour,
 * au-delà ça boucle) ; on y ajoute le glisser horizontal de l'utilisateur
 * (souris, tactile) et les flèches du clavier.
 */
export function ProductStage({
  source,
  label,
  rotation = NO_ROTATION,
  draggable = true,
  className,
}: {
  source: ProductSource;
  /** Nom accessible du produit */
  label: string;
  rotation?: MotionValue<number>;
  draggable?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("group/stage relative aspect-square", className)}>
      {/* Halo / projecteur, accentué au survol (desktop) */}
      <div
        aria-hidden
        className="product-halo absolute inset-[-14%] rounded-full opacity-75 transition-opacity duration-500 group-hover/stage:opacity-100"
      />
      {source.kind === "sequence" ? (
        <SequenceStage
          source={source}
          label={label}
          rotation={rotation}
          draggable={draggable}
        />
      ) : (
        <ModelStage source={source} label={label} />
      )}
    </div>
  );
}

/* --- Mode « sequence » ---------------------------------------------------- */

function SequenceStage({
  source,
  label,
  rotation,
  draggable,
}: {
  source: Extract<ProductSource, { kind: "sequence" }>;
  label: string;
  rotation: MotionValue<number>;
  draggable: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const drag = useMotionValue(0);
  // Progression du préchargement, liée à un jeton (un nouveau préchargement
  // ignore les réponses de l'ancien). Mise à jour uniquement en asynchrone.
  const [load, setLoad] = useState({ token: -1, total: 0, count: 0 });
  const ready = load.total > 0 && load.count >= load.total;
  const lastDrawn = useRef(-1);

  // Préchargement : 1 image sur 2 sur très petit écran, décodées d'avance
  useEffect(() => {
    const token = Math.random();
    let cancelled = false; // un préchargement annulé n'écrit plus rien
    const step = window.matchMedia("(max-width: 479px)").matches ? 2 : 1;
    const frames = source.frames.filter((_, i) => i % step === 0);
    images.current = frames.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      const done = () =>
        !cancelled &&
        setLoad((prev) => ({
          token,
          total: frames.length,
          count: (prev.token === token ? prev.count : 0) + 1,
        }));
      // Une image manquante ne bloque pas la scène
      img.decode().then(done, done);
      return img;
    });
    return () => {
      cancelled = true;
      images.current = [];
    };
  }, [source.frames]);

  // Dessine la frame correspondant à l'angle courant (scroll + glisser) :
  // les images sont déjà décodées, un simple drawImage par changement.
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const frames = images.current;
    if (!canvas || !ctx || !frames.length) return;
    const turns = rotation.get() + drag.get();
    const t = ((turns % 1) + 1) % 1;
    const index = Math.min(frames.length - 1, Math.floor(t * frames.length));
    const size = Math.round(
      canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 2),
    );
    if (index === lastDrawn.current && canvas.width === size) return;
    const img = frames[index];
    if (!img.complete || !img.naturalWidth) return;
    if (canvas.width !== size) canvas.width = canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
    lastDrawn.current = index;
  }, [rotation, drag]);

  useEffect(() => {
    if (!ready) return;
    lastDrawn.current = -1;
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [ready, draw]);

  useMotionValueEvent(rotation, "change", () => ready && draw());
  useMotionValueEvent(drag, "change", () => ready && draw());

  // Glisser horizontal : une largeur de scène ≈ trois quarts de tour
  const start = useRef<{ x: number; value: number } | null>(null);
  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!draggable) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, value: drag.get() };
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!start.current) return;
    const width = e.currentTarget.clientWidth || 1;
    drag.set(
      start.current.value - ((e.clientX - start.current.x) / width) * 0.75,
    );
  }
  function onPointerUp() {
    start.current = null;
  }
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") drag.set(drag.get() + 1 / 36);
    else if (e.key === "ArrowRight") drag.set(drag.get() - 1 / 36);
    else return;
    e.preventDefault();
  }

  const progress = load.total ? Math.min(1, load.count / load.total) : 0;

  return (
    <div
      role="img"
      aria-label={`${label} — vue à 360°${draggable ? " (glisser ou flèches pour tourner)" : ""}`}
      tabIndex={draggable ? 0 : undefined}
      onKeyDown={draggable ? onKeyDown : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      data-ready={ready || undefined}
      className={cn(
        "absolute inset-0 rounded-full select-none",
        // pan-y : le défilement vertical reste natif sur tactile
        draggable && "cursor-grab touch-pan-y active:cursor-grabbing",
      )}
    >
      {/* Poster tant que la séquence charge */}
      {/* eslint-disable-next-line @next/next/no-img-element -- poster de même taille que les frames, le temps du préchargement */}
      <img
        src={source.poster}
        alt=""
        draggable={false}
        className={cn(
          "absolute inset-0 size-full object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)] transition-opacity duration-500",
          ready ? "opacity-0" : "opacity-100",
        )}
      />
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 size-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)] transition-opacity duration-500",
          ready ? "opacity-100" : "opacity-0",
        )}
      />
      {/* Indicateur de chargement discret */}
      {!ready && (
        <div
          aria-hidden
          className="absolute inset-x-[32%] -bottom-3 h-0.5 overflow-hidden rounded-full bg-white/15"
        >
          <div
            className="h-full origin-left bg-gold transition-transform duration-300"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      )}
    </div>
  );
}

/* --- Mode « model » (STUB) ------------------------------------------------ */

/**
 * TODO(3D) — brancher ici le rendu Three.js quand un vrai .glb existera :
 *  1. npm install three (+ @react-three/fiber / drei si souhaité) ;
 *  2. remplacer ce bloc par un <canvas> Three.js (ou <Canvas> de R3F) qui
 *     charge `source.src` avec GLTFLoader (ou useGLTF), éclairage studio ;
 *  3. appliquer la prop `rotation` (tours) : model.rotation.y = r * 2π, et
 *     réutiliser le même glisser horizontal que le mode « sequence ».
 * Rien d'autre à changer : la page passe déjà `source` et `rotation`.
 * Three.js n'est volontairement PAS installé tant qu'aucun .glb n'existe.
 */
function ModelStage({
  source,
  label,
}: {
  source: Extract<ProductSource, { kind: "model" }>;
  label: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${label} — modèle 3D à venir`}
      data-model-src={source.src}
      className="absolute inset-0 grid place-items-center rounded-full border border-dashed border-white/25 text-sm text-white/60"
    >
      Modèle 3D à venir
    </div>
  );
}
