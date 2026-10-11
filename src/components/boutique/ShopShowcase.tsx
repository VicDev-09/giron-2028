"use client";

import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  type Variants,
} from "framer-motion";
import { ChevronDown, Sparkle } from "lucide-react";
import { useRef } from "react";
import { boutique, products } from "@/content/boutique";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/media";
import { PigmentField } from "./PigmentField";
import { ProductSelector } from "./ProductSelector";
import { ProductStage } from "./ProductStage";

const ease = [0.22, 1, 0.36, 1] as const;
const cascade: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

/** Produit présenté (le premier) — aucun tant que la boutique est vide */
const product = products.at(0);
const PRESENTATION_ID = "presentation";

/**
 * Vitrine de la future boutique (démo d'expérience, aucun e-commerce) :
 * sélecteur → présentation 360° au scroll avec pigments → gros plan →
 * clôture. Sans produit, chaque section affiche son état « à venir »
 * (placeholder, aucune image) en gardant la mise en page et l'ambiance. Scroll-linked en transform uniquement ; les opacités passent par
 * des révélations à l'entrée dans l'écran.
 */
export function ShopShowcase() {
  return (
    <>
      <Hero />
      <Presentation />
      <Detail />
      <Closing />
    </>
  );
}

/* 1. Hero — sélecteur ------------------------------------------------------ */
function Hero() {
  return (
    <section className="tone-night grain shop-mesh relative isolate overflow-hidden pt-28 pb-20">
      <Container className="relative z-10 text-center">
        <p className="eyebrow inline-flex animate-rise items-center gap-3 text-gold">
          <span aria-hidden className="h-px w-8 bg-current" />
          {boutique.eyebrow}
          <span aria-hidden className="h-px w-8 bg-current" />
        </p>
        <h1
          className="display-xl mt-4 animate-rise text-[clamp(2.4rem,7vw,5rem)]"
          style={{ animationDelay: "0.08s" }}
        >
          La <span className="text-gradient">collection</span>
        </h1>
        <div className="mt-6 animate-rise" style={{ animationDelay: "0.16s" }}>
          <ProductSelector targetId={PRESENTATION_ID} />
        </div>
      </Container>
      <a
        href={`#${PRESENTATION_ID}`}
        aria-label="Faire défiler vers la présentation"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-white/60 transition-colors hover:text-white sm:block"
      >
        <ChevronDown aria-hidden className="size-6 animate-bounce" />
      </a>
    </section>
  );
}

/* 2 + 3. Présentation au scroll, pigments --------------------------------- */
function Presentation() {
  const ref = useRef<HTMLElement>(null);
  // Hooks SSR-safe : même valeur qu'au rendu serveur pendant l'hydratation
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const desktop = useMediaQuery("(min-width: 1024px)");
  const { scrollY, scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // La rotation au scroll reste active en mouvement réduit (elle EST la
  // lecture du produit) ; parallaxe et pigments, eux, sont coupés.
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const k = reduce ? 0 : desktop ? 1 : 0.5;
  const productY = useTransform(
    scrollYProgress,
    [0, 1],
    [`${6 * k}%`, `${-6 * k}%`],
  );
  const shadowScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1 - 0.25 * k, 1],
  );
  const shadowX = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-10 * k}%`, `${10 * k}%`],
  );
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    [`${10 * k}%`, `${-10 * k}%`],
  );
  // Vitesse de scroll → tourbillon des pigments (0 au repos)
  const velocity = useVelocity(scrollY);
  const boost = useTransform(velocity, (v) => Math.min(Math.abs(v) / 900, 3));

  return (
    <section
      id={PRESENTATION_ID}
      ref={ref}
      aria-labelledby="titre-presentation"
      className={cn(
        "tone-night relative overflow-clip",
        product ? "h-[240vh] lg:h-[300vh]" : undefined,
      )}
    >
      <div
        className={cn(
          "flex items-center overflow-hidden",
          // Le fond couvre aussi les marges : padding à l'intérieur
          product ? "sticky top-0 h-svh" : "relative min-h-[90svh] py-16",
        )}
      >
        {/* Fond : la parallaxe la plus lente */}
        <motion.div
          aria-hidden
          style={{ y: bgY }}
          className="shop-mesh absolute -inset-y-[15%] inset-x-0 opacity-80"
        />

        <Container className="relative z-10 grid items-center gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <div className="relative mx-auto w-[min(78vw,24rem)] sm:w-[min(60vw,28rem)] lg:w-[min(42vw,34rem)]">
            {/* Ombre portée : parallaxe distincte du produit */}
            <motion.div
              aria-hidden
              style={{ scaleX: shadowScale, x: shadowX }}
              className="absolute inset-x-[22%] bottom-[2%] h-[7%] rounded-[50%] bg-black/55 blur-xl"
            />
            <PigmentField boost={boost} className="p-[14%] -m-[14%]">
              <motion.div style={{ y: productY }}>
                <ProductStage
                  source={product?.source}
                  label={product?.name ?? boutique.presentation.title}
                  rotation={rotation}
                  draggable={!!product}
                />
              </motion.div>
            </PigmentField>
            {product && (
              <p className="mt-2 text-center text-xs font-semibold tracking-[0.2em] text-white/55 uppercase">
                Fais défiler ou glisse pour tourner
              </p>
            )}
          </div>

          <motion.div
            variants={cascade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-3xl border border-white/10 bg-night/60 p-5 backdrop-blur-md sm:p-7 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
          >
            <motion.p variants={rise} className="eyebrow text-gold">
              {product?.subtitle ?? boutique.presentation.eyebrow}
            </motion.p>
            <motion.h2
              id="titre-presentation"
              variants={rise}
              className="mt-2 font-display text-3xl leading-[0.95] font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              {product?.name ?? boutique.presentation.title}
            </motion.h2>
            {product && (
              <motion.dl
                variants={rise}
                className="mt-5 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-3"
              >
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 sm:px-4 sm:py-3"
                  >
                    <dt className="text-[0.65rem] font-semibold tracking-[0.15em] text-white/60 uppercase">
                      {spec.label}
                    </dt>
                    <dd className="mt-1 text-xs leading-snug font-semibold sm:text-sm">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </motion.dl>
            )}
            <motion.p
              variants={rise}
              className={cn(
                "mt-5 max-w-md leading-relaxed text-white/80 sm:text-lg",
                product && "hidden sm:block",
              )}
            >
              {product?.description ?? boutique.presentation.text}
            </motion.p>
          </motion.div>
        </Container>
      </div>
    </section>
  );
}

/* 4. Gros plan ------------------------------------------------------------- */
function Detail() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const zoom = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [2.1, 2.1] : [1.8, 2.5],
  );
  // Écusson de l'état « à venir » : zoom plus doux
  const placeholderZoom = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [0.9, 1.15],
  );

  return (
    <section
      ref={ref}
      aria-labelledby="titre-detail"
      className="tone-night grain relative overflow-hidden py-24 sm:py-32"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative mx-auto size-[min(80vw,28rem)]">
          <div className="absolute inset-0 overflow-hidden rounded-full border border-gold/40 bg-[radial-gradient(circle,var(--brand-dusk-2),var(--brand-night)_72%)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
            {product?.detailImage ? (
              /* Gros plan sur l'image nette du produit, zoomée au scroll */
              <motion.div
                style={{
                  scale: zoom,
                  transformOrigin: `${(product.detailFocus?.x ?? 0.5) * 100}% ${(product.detailFocus?.y ?? 0.5) * 100}%`,
                }}
                className="absolute inset-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- image nette du produit, zoomée */}
                <img
                  src={product.detailImage}
                  alt={`${product.name}, gros plan`}
                  loading="lazy"
                  className="size-full object-contain"
                />
              </motion.div>
            ) : (
              /* Aucun produit : écusson brodé stylisé (décor, aucune image) */
              <motion.div
                aria-hidden
                style={{ scale: placeholderZoom }}
                className="absolute inset-0 grid place-items-center"
              >
                <div className="grid aspect-square w-[56%] place-items-center rounded-full border-2 border-dashed border-gold/50 bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand-scarlet)_18%,transparent),transparent_70%)]">
                  <div className="grid aspect-square w-[78%] place-items-center rounded-full border border-white/20">
                    <Sparkle className="size-12 fill-gold text-gold" />
                  </div>
                </div>
              </motion.div>
            )}
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
