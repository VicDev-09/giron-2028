"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ChevronDown, Sparkle } from "lucide-react";
import { useRef, useState, type CSSProperties } from "react";
import { boutique } from "@/content/boutique";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/media";
import { ProductStage } from "./ProductStage";

const ease = [0.22, 1, 0.36, 1] as const;
const cascade: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const { product } = boutique;

/**
 * Vitrine de la future boutique : scroll narratif en sections plein écran.
 * Démo d'expérience uniquement — aucun panier, prix ni traitement serveur.
 * Animations liées au scroll en transform uniquement (les opacités passent
 * par des révélations à l'entrée dans l'écran). Mouvement réduit : figé.
 */
export function ShopShowcase() {
  return (
    <>
      <Intro />
      <Staging />
      <Detail />
      <VariantsDemo />
      <Closing />
    </>
  );
}

/* 1. Intro ---------------------------------------------------------------- */
function Intro() {
  return (
    <section className="tone-night grain shop-mesh relative isolate flex min-h-svh items-center overflow-hidden pt-28 pb-24">
      <Container className="relative z-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-6">
        <div>
          <p className="eyebrow mb-6 flex animate-rise items-center gap-3 text-gold">
            <span aria-hidden className="h-px w-10 bg-current" />
            {boutique.eyebrow}
          </p>
          <h1
            className="display-xl animate-rise text-[clamp(3.4rem,12vw,7.5rem)] xl:text-[8.5rem]"
            style={{ animationDelay: "0.08s" }}
          >
            {boutique.title.split(" ")[0]}{" "}
            <span className="text-gradient">
              {boutique.title.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          <p
            className="mt-8 max-w-md animate-rise text-lg leading-relaxed text-pretty text-white/80 sm:text-xl"
            style={{ animationDelay: "0.16s" }}
          >
            {boutique.intro}
          </p>
        </div>

        <div className="product-enter mx-auto w-[min(78vw,26rem)] lg:w-[min(38vw,32rem)]">
          <ProductStage source={product.source} priority />
        </div>
      </Container>

      <a
        href="#mise-en-scene"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold tracking-[0.2em] text-white/70 uppercase transition-colors hover:text-white"
      >
        Découvrir
        <ChevronDown aria-hidden className="size-5 animate-bounce" />
      </a>
    </section>
  );
}

/* 2. Mise en scène au scroll ---------------------------------------------- */
function Staging() {
  const ref = useRef<HTMLElement>(null);
  // Comme `desktop` : identique au rendu serveur pendant l'hydratation
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const desktop = useMediaQuery("(min-width: 1024px)");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Amplitudes allégées sur mobile, nulles en mouvement réduit
  const k = reduce ? 0 : desktop ? 1 : 0.5;

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1 - 0.18 * k, 1 + 0.06 * k, 1 + 0.12 * k],
  );
  const x = useTransform(scrollYProgress, [0, 0.5], [`${-14 * k}%`, "0%"]);
  const y = useTransform(scrollYProgress, [0, 1], [`${8 * k}%`, `${-8 * k}%`]);
  const shadowScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1 - 0.3 * k, 1, 1 - 0.1 * k],
  );
  const shadowX = useTransform(
    scrollYProgress,
    [0, 0.5],
    [`${-24 * k}%`, "0%"],
  );
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    [`${12 * k}%`, `${-12 * k}%`],
  );

  return (
    <section
      id="mise-en-scene"
      ref={ref}
      aria-labelledby="titre-mise-en-scene"
      className="tone-night relative overflow-clip lg:h-[190vh]"
    >
      <div className="relative flex min-h-svh items-center py-24 lg:sticky lg:top-0 lg:h-svh lg:py-0">
        {/* Fond : lueur lente (parallaxe la plus faible) */}
        <motion.div
          aria-hidden
          style={{ y: bgY }}
          className="shop-mesh absolute -inset-y-[15%] inset-x-0 opacity-70"
        />
        <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto w-[min(72vw,24rem)] lg:w-[min(36vw,30rem)]">
            {/* Ombre portée : parallaxe distincte du produit */}
            <motion.div
              aria-hidden
              style={{ scaleX: shadowScale, x: shadowX }}
              className="absolute inset-x-[12%] -bottom-[6%] h-[8%] rounded-[50%] bg-black/55 blur-xl"
            />
            <motion.div style={{ scale, x, y }}>
              <ProductStage
                source={product.source}
                interactive={false}
                float={false}
              />
            </motion.div>
          </div>

          <motion.div
            variants={cascade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
          >
            <motion.p variants={rise} className="eyebrow text-gold">
              {product.tagline}
            </motion.p>
            <motion.h2
              id="titre-mise-en-scene"
              variants={rise}
              className="mt-3 font-display text-4xl leading-[0.95] font-extrabold tracking-tight sm:text-6xl"
            >
              {product.name}
            </motion.h2>
            <ul className="mt-10 space-y-7">
              {boutique.story.map((item, i) => (
                <motion.li
                  key={item.title}
                  variants={rise}
                  className="flex gap-5"
                >
                  <span className="font-display text-sm font-bold text-royal-soft tabular-nums">
                    0{i + 1}
                  </span>
                  <span>
                    <span className="block font-display text-xl font-bold">
                      {item.title}
                    </span>
                    <span className="mt-1 block max-w-md leading-relaxed text-white/75">
                      {item.text}
                    </span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </Container>
      </div>
    </section>
  );
}

/* 3. Gros plan sur le logo ------------------------------------------------- */
function Detail() {
  const ref = useRef<HTMLElement>(null);
  // Comme `desktop` : identique au rendu serveur pendant l'hydratation
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const zoom = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1.1, 1.1] : [0.95, 1.3],
  );

  return (
    <section
      ref={ref}
      aria-labelledby="titre-detail"
      className="tone-night grain relative overflow-hidden py-24 sm:py-32"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative mx-auto size-[min(80vw,28rem)]">
          <div className="absolute inset-0 overflow-hidden rounded-full border border-gold/40 bg-[radial-gradient(circle,var(--brand-dusk-2),var(--brand-night)_70%)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
            <motion.div
              style={{ scale: zoom }}
              className="absolute -inset-[30%]"
            >
              <ProductStage
                source={product.source}
                interactive={false}
                float={false}
                focus={{ ...product.logoFocus, scale: 2.2 }}
                className="size-full"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
            </motion.div>
          </div>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-gold/40 bg-night px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-gold uppercase">
            Gros plan
          </span>
        </div>

        <motion.div
          variants={cascade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.p variants={rise} className="eyebrow text-gold">
            {boutique.detail.eyebrow}
          </motion.p>
          <motion.h2
            id="titre-detail"
            variants={rise}
            className="mt-3 font-display text-4xl leading-[0.95] font-extrabold tracking-tight sm:text-6xl"
          >
            {boutique.detail.title}
          </motion.h2>
          <motion.p
            variants={rise}
            className="mt-6 max-w-md text-lg leading-relaxed text-white/80"
          >
            {boutique.detail.text}
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

/* 4. Variantes (démo d'ambiance) ------------------------------------------ */
function VariantsDemo() {
  const [active, setActive] = useState<string>(boutique.variants[0].id);
  const tint = boutique.variants.find((v) => v.id === active)?.color;

  return (
    <section
      aria-labelledby="titre-variantes"
      className="tone-night relative overflow-hidden py-24 sm:py-32"
      style={{ "--stage-tint": tint } as CSSProperties}
    >
      {/* Une lumière par teinte, en fondu croisé (opacité) */}
      {boutique.variants.map((v) => (
        <div
          key={v.id}
          aria-hidden
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: v.id === active ? 1 : 0,
            background: `radial-gradient(60% 55% at 50% 45%, color-mix(in srgb, ${v.color} 32%, transparent), transparent 70%)`,
          }}
        />
      ))}

      <Container className="relative z-10 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-white/80 uppercase">
          <Sparkle aria-hidden className="size-3 fill-gold text-gold" />
          Démo · aperçu d&apos;ambiance
        </p>
        <h2
          id="titre-variantes"
          className="mt-5 font-display text-4xl leading-[0.95] font-extrabold tracking-tight sm:text-6xl"
        >
          Choisis ton ambiance
        </h2>

        <div className="mx-auto mt-12 w-[min(70vw,22rem)] sm:w-[min(50vw,26rem)]">
          <ProductStage source={product.source} />
        </div>

        <div
          role="radiogroup"
          aria-label="Teinte d'ambiance (démo)"
          className="mt-12 flex justify-center gap-4"
        >
          {boutique.variants.map((v) => {
            const selected = v.id === active;
            return (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={v.label}
                onClick={() => setActive(v.id)}
                className={cn(
                  "grid size-12 place-items-center rounded-full border-2 transition-[transform,border-color] duration-300 hover:scale-110",
                  selected ? "scale-110 border-white" : "border-white/25",
                )}
              >
                <span
                  className="size-8 rounded-full"
                  style={{ background: v.color }}
                />
              </button>
            );
          })}
        </div>
        <p
          aria-live="polite"
          className="mt-4 text-sm font-semibold text-white/75"
        >
          {boutique.variants.find((v) => v.id === active)?.label}
        </p>
        <p className="mt-2 text-xs text-white/55">
          Les coloris définitifs seront annoncés au lancement.
        </p>
      </Container>
    </section>
  );
}

/* 5. Clôture --------------------------------------------------------------- */
function Closing() {
  const mail = `mailto:${site.email}?subject=${encodeURIComponent("Boutique Giron 2028 — m'avertir au lancement")}`;
  return (
    <section
      aria-labelledby="titre-cloture"
      className="tone-night grain shop-mesh relative overflow-hidden py-28 text-center sm:py-36"
    >
      <Container>
        <motion.div
          variants={cascade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.h2
            id="titre-cloture"
            variants={rise}
            className="display-xl text-[clamp(2.8rem,9vw,6.5rem)]"
          >
            {boutique.closing.title}
          </motion.h2>
          <motion.p
            variants={rise}
            className="mx-auto mt-6 max-w-lg text-lg text-white/80"
          >
            {boutique.closing.text}
          </motion.p>
          <motion.div variants={rise} className="mt-10">
            <ButtonLink href={mail} size="lg" arrow>
              {boutique.closing.cta}
            </ButtonLink>
          </motion.div>
          <motion.p variants={rise} className="mt-6 text-sm text-white/60">
            {boutique.closing.note}
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
