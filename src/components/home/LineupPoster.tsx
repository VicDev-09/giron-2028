"use client";

import { motion, type Variants } from "framer-motion";
import { Sparkle } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";
import {
  lineupExtras,
  lineupNights,
  lineupNote,
  lineupStages,
  type LineupAct,
} from "@/content/lineup";
import { days, venues } from "@/content/programme";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { venueStyles } from "@/components/programme/meta";
import { useTreasureStep } from "@/components/treasure/useTreasureStep";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;
const viewport = { once: true, amount: 0.4 } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const cascade = (stagger: number, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const letter: Variants = {
  hidden: { y: "110%", rotate: 6 },
  show: { y: "0%", rotate: 0, transition: { duration: 0.8, ease } },
};

const pop: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.85 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

const dayLabel = (id: string) => days.find((d) => d.id === id)?.label;
const venueLabel = (id: string) => venues.find((v) => v.id === id)?.label;

/**
 * Affiche de festival : têtes d'affiche en très grande typo révélées lettre
 * par lettre derrière un masque, artistes en cascade. En mouvement réduit,
 * MotionProvider coupe les déplacements : seuls les fondus restent.
 */
export function LineupPoster() {
  return (
    <section
      aria-labelledby="titre-affiche"
      className="tone-night grain relative overflow-hidden py-20 sm:py-28"
    >
      <Container className="relative z-10">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(120%_70%_at_50%_0%,#3d1d5c_0%,#1c0e2c_55%,#120a1c_100%)] px-5 py-14 text-center sm:rounded-[2.5rem] sm:px-12 sm:py-20">
          <div aria-hidden className="poster-rays absolute inset-0 -z-10" />
          <div
            aria-hidden
            className="absolute -bottom-1/3 left-1/2 -z-10 size-[60vmax] -translate-x-1/2 rounded-full bg-coral/20 blur-[120px]"
          />

          {/* En-tête d'affiche */}
          <motion.div
            variants={cascade(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
          >
            <motion.p
              variants={fadeUp}
              className="flex items-center justify-center gap-3 text-[0.7rem] font-semibold tracking-[0.3em] text-white/70 uppercase sm:text-xs"
            >
              <span
                aria-hidden
                className="hidden h-px w-14 bg-current sm:block"
              />
              {site.region} · {site.datesLabel}
              <span
                aria-hidden
                className="hidden h-px w-14 bg-current sm:block"
              />
            </motion.p>
            <motion.h2
              id="titre-affiche"
              variants={fadeUp}
              className="eyebrow mt-6 text-amber"
            >
              L&apos;affiche du {site.name}
            </motion.h2>
          </motion.div>

          {/* Les deux grandes soirées */}
          <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-20">
            {lineupNights.map((night) => (
              <motion.div
                key={night.day}
                variants={cascade(0.12)}
                initial="hidden"
                whileInView="show"
                viewport={viewport}
              >
                <motion.p
                  variants={fadeUp}
                  className="text-sm font-semibold tracking-[0.2em] uppercase"
                  style={{ color: `var(--venue-${night.venue})` }}
                >
                  {dayLabel(night.day)} · {venueLabel(night.venue)} ·{" "}
                  {night.time}
                </motion.p>
                <ReversibleHeadliner act={night.headliner} day={night.day} />
                <motion.ul
                  variants={cascade(0.08, 0.5)}
                  className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-2 font-display text-2xl font-bold tracking-tight sm:gap-x-6 sm:text-4xl"
                >
                  {night.support.map((act, i) => (
                    <motion.li
                      key={act.name}
                      variants={pop}
                      className="flex items-center gap-4 sm:gap-6"
                    >
                      {i > 0 && (
                        <Sparkle
                          aria-hidden
                          className="size-3 fill-coral text-coral sm:size-4"
                        />
                      )}
                      <ActName act={act} />
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </div>

          {/* Scènes secondaires */}
          <motion.div
            variants={cascade(0.15)}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="mx-auto mt-16 grid max-w-4xl gap-4 sm:mt-20 sm:grid-cols-2"
          >
            {lineupStages.map((stage) => (
              <motion.div
                key={stage.venue}
                variants={fadeUp}
                className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-7"
              >
                <p className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.2em] text-white/70 uppercase">
                  <span
                    aria-hidden
                    className={cn(
                      "size-2 rounded-full",
                      venueStyles[stage.venue].dot,
                    )}
                  />
                  {stage.label}
                </p>
                <motion.ul
                  variants={cascade(0.07, 0.2)}
                  className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 font-display text-xl font-bold sm:text-2xl"
                >
                  {stage.acts.map((act) => (
                    <motion.li key={act.name} variants={pop}>
                      <ActName act={act} />
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Et aussi */}
          <motion.div
            variants={cascade(0.06)}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="mt-14"
          >
            <motion.p variants={fadeUp} className="eyebrow text-white/60">
              Et aussi
            </motion.p>
            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {lineupExtras.map((extra) => (
                <motion.li
                  key={extra}
                  variants={pop}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85"
                >
                  {extra}
                </motion.li>
              ))}
            </ul>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-10 max-w-md text-sm text-white/70"
            >
              {lineupNote}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-6">
              <ButtonLink href="/la-fete" arrow>
                Voir le programme
              </ButtonLink>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function ActName({ act }: { act: LineupAct }) {
  return (
    <span>
      {act.name}
      {act.note && (
        <span className="ml-2 align-middle font-sans text-xs font-semibold tracking-normal text-white/60 sm:text-sm">
          ({act.note})
        </span>
      )}
    </span>
  );
}

/** Découpe en mots en gardant l'index de départ (dégradé continu). */
function words(text: string) {
  const out: Array<{ text: string; start: number }> = [];
  let start = 0;
  for (const w of text.split(" ")) {
    out.push({ text: w, start });
    start += w.length + 1;
  }
  return out;
}

// Sceaux du revers : couleurs des lieux, sans leur nom (ordre volontairement mêlé)
const seals = [
  { venue: "caveau", name: "violet" },
  { venue: "cantine", name: "corail" },
  { venue: "jeux", name: "vert" },
  { venue: "tonnelle", name: "ambre" },
] as const;

/**
 * Chasse au trésor : cachette « Le revers ». Pendant cette étape seulement,
 * la tête d'affiche du samedi se retourne au double-clic / double-tap et
 * montre des sceaux (secret "sceau-<lieu>"). Sinon : tête d'affiche normale.
 */
function ReversibleHeadliner({ act, day }: { act: LineupAct; day: string }) {
  const revers = useTreasureStep("revers");
  const enabled = revers.active && day === "samedi";
  const [turned, setTurned] = useState(false);
  const lastTap = useRef(0);
  const shown = enabled && turned;

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!enabled || (e.target as Element).closest("button")) return;
    const now = Date.now();
    if (now - lastTap.current < 350) {
      setTurned((t) => !t);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  }

  if (!enabled) return <Headliner act={act} />;

  return (
    <div onPointerUp={onPointerUp} className="select-none [perspective:1200px]">
      <motion.div
        animate={{ rotateY: shown ? 180 : 0 }}
        transition={{ duration: 0.8, ease }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        <div className="[backface-visibility:hidden]">
          <Headliner act={act} />
        </div>
        <div
          aria-hidden={!shown}
          className="absolute inset-0 flex items-center justify-center gap-3 [transform:rotateY(180deg)] [backface-visibility:hidden] sm:gap-6"
        >
          {seals.map((seal) => (
            <button
              key={seal.venue}
              type="button"
              tabIndex={shown ? 0 : -1}
              aria-label={`Sceau ${seal.name}`}
              onClick={() => void revers.attempt(`sceau-${seal.venue}`)}
              className="size-12 rounded-full border-4 border-white/25 shadow-[inset_0_-6px_12px_rgba(0,0,0,0.35),0_10px_24px_-10px_rgba(0,0,0,0.8)] transition-transform hover:scale-110 sm:size-16"
              style={{ background: `var(--venue-${seal.venue})` }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/** Tête d'affiche : lettres révélées derrière un masque + reflet balayant. */
function Headliner({ act }: { act: LineupAct }) {
  return (
    <div className="relative mt-4">
      {/* Éclat lumineux derrière le nom à sa révélation (opacité + échelle) */}
      <motion.span
        aria-hidden
        variants={{
          hidden: { opacity: 0, scale: 0.6 },
          show: {
            opacity: [0, 0.9, 0.35],
            scale: 1,
            transition: { duration: 1.6, ease: "easeOut", delay: 0.4 },
          },
        }}
        className="pointer-events-none absolute inset-x-[10%] top-1/4 bottom-0 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(255_61_127/0.45),rgb(255_90_54/0.2)_55%,transparent)] blur-2xl"
      />
      <p className="display-xl relative inline-block text-[clamp(3.2rem,15vw,11rem)]">
        <span className="sr-only">
          {act.name}
          {act.note && ` (${act.note})`}
        </span>
        <motion.span
          aria-hidden
          variants={cascade(0.035)}
          className="inline-flex flex-wrap justify-center gap-x-[0.25em]"
        >
          {words(act.name).map((word) => (
            // Un mot = un masque insécable : jamais de coupure en plein mot
            <span
              key={word.start}
              className="-mt-[0.2em] inline-flex overflow-hidden pt-[0.2em] pb-[0.06em]"
            >
              {word.text.split("").map((char, i) => {
                const index = word.start + i;
                return (
                  <motion.span
                    key={i}
                    variants={letter}
                    // Boîte étendue vers le haut : le dégradé (clip texte)
                    // couvre aussi les accents (Ê), sans décaler la ligne
                    className="-mt-[0.2em] inline-block origin-bottom-left pt-[0.2em] text-gradient"
                    style={{
                      backgroundSize: `${act.name.length * 100}% 100%`,
                      backgroundPosition: `${(index / Math.max(1, act.name.length - 1)) * 100}% 0`,
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </motion.span>
      </p>
      {act.note && (
        <motion.p
          aria-hidden
          variants={fadeUp}
          className="mt-2 inline-block rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-white/75 uppercase"
        >
          {act.note}
        </motion.p>
      )}
    </div>
  );
}
