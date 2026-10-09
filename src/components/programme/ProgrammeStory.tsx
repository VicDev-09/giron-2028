"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  days,
  programme,
  venues,
  type DayId,
  type ProgrammeEvent,
} from "@/content/programme";
import { recitDays, recitIntro } from "@/content/recit";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/media";
import { kindIcons, kindLabels, venueStyles } from "./meta";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Le mode « épinglé » (défilement horizontal piloté par le scroll vertical)
 * n'existe que sur grand écran, hors mouvement réduit. Partout ailleurs, la
 * même liste s'empile verticalement : aucun scroll détourné sur mobile.
 * La bascule est faite en CSS (variantes `lg:motion-safe:`), donc identique
 * au rendu serveur ; le JS ne fait que translater la piste.
 */
const PINNED =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const pin = {
  /** Largeurs des panneaux en mode épinglé (vw), reprises dans le calcul */
  intro: 40,
  day: 24,
  event: 32,
  outro: 30,
  gap: 3,
  padding: 6,
};

type Panel =
  | { type: "intro" }
  | { type: "day"; day: DayId }
  | { type: "event"; event: ProgrammeEvent }
  | { type: "outro" };

const dayOrder = days.map((d) => d.id);

/** Intro, puis chaque jour suivi de ses temps forts, puis conclusion. */
function buildPanels(): Panel[] {
  const panels: Panel[] = [{ type: "intro" }];
  for (const day of dayOrder) {
    const events = programme
      .filter((e) => e.highlight && e.day === day)
      .sort((a, b) => a.start.localeCompare(b.start));
    if (!events.length) continue;
    panels.push({ type: "day", day });
    for (const event of events) panels.push({ type: "event", event });
  }
  panels.push({ type: "outro" });
  return panels;
}

const panels = buildPanels();

/** Distance horizontale totale (vw) : sert à dimensionner la zone de scroll. */
const trackVw =
  pin.padding * 2 +
  panels.reduce((sum, p) => sum + pin[p.type], 0) +
  pin.gap * (panels.length - 1);
const scrollVw = Math.max(0, trackVw - 100);

const panelWidth: Record<Panel["type"], string> = {
  intro: "lg:motion-safe:w-[40vw]",
  day: "lg:motion-safe:w-[24vw]",
  event: "lg:motion-safe:w-[32vw]",
  outro: "lg:motion-safe:w-[30vw]",
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export function ProgrammeStory() {
  const areaRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const pinned = useMediaQuery(PINNED);
  const [dayMarks, setDayMarks] = useState<Array<{ day: DayId; at: number }>>(
    [],
  );
  const [activeDay, setActiveDay] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: areaRef,
    offset: ["start start", "end end"],
  });
  const distance = useMotionValue(0);
  const x = useTransform(
    [scrollYProgress, distance],
    ([p, d]: number[]) => -p * d,
  );

  // Mesure la piste (et la position de chaque jour) ; uniquement au resize.
  useEffect(() => {
    const track = trackRef.current;
    if (!pinned || !track) {
      distance.set(0);
      return;
    }
    const measure = () => {
      const d = Math.max(
        0,
        track.offsetWidth - document.documentElement.clientWidth,
      );
      distance.set(d);
      const marks = [...track.querySelectorAll<HTMLElement>("[data-day]")].map(
        (el) => ({
          day: el.dataset.day as DayId,
          at: d ? Math.min(1, el.offsetLeft / d) : 0,
        }),
      );
      setDayMarks(marks);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned, distance]);

  // Jour courant dans la frise (re-rendu seulement quand il change)
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    let index = -1;
    dayMarks.forEach((m, i) => {
      if (p + 0.04 >= m.at) index = i;
    });
    if (index !== activeDay) setActiveDay(index);
  });

  return (
    <section
      aria-labelledby="titre-recit"
      className="tone-night grain relative overflow-clip"
      style={{ "--story-scroll": `${scrollVw}vw` } as CSSProperties}
    >
      <div
        ref={areaRef}
        className="lg:motion-safe:h-[calc(100svh+var(--story-scroll))]"
      >
        <div className="relative py-20 sm:py-28 lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-svh lg:motion-safe:flex-col lg:motion-safe:justify-center lg:motion-safe:overflow-hidden lg:motion-safe:py-0">
          {/* Halos fixes de la scène épinglée */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-1/4 left-[10%] size-[40vmax] rounded-full bg-scarlet/15 blur-[110px]" />
            <div className="absolute right-[5%] -bottom-1/3 size-[36vmax] rounded-full bg-royal/15 blur-[110px]" />
          </div>

          <motion.ol
            ref={trackRef}
            style={pinned ? { x } : undefined}
            className="relative mx-auto grid w-full max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:px-8 lg:motion-safe:mx-0 lg:motion-safe:flex lg:motion-safe:w-max lg:motion-safe:max-w-none lg:motion-safe:items-stretch lg:motion-safe:gap-[3vw] lg:motion-safe:px-[6vw]"
          >
            {panels.map((panel) => (
              <motion.li
                key={
                  panel.type === "event"
                    ? panel.event.id
                    : panel.type === "day"
                      ? `jour-${panel.day}`
                      : panel.type
                }
                data-day={panel.type === "day" ? panel.day : undefined}
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className={cn(
                  "lg:motion-safe:h-[min(70svh,44rem)] lg:motion-safe:shrink-0",
                  panelWidth[panel.type],
                  panel.type !== "event" && "md:col-span-2",
                )}
              >
                <PanelContent panel={panel} />
              </motion.li>
            ))}
          </motion.ol>

          {/* Frise des jours (mode épinglé uniquement) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[6vw] bottom-8 hidden lg:motion-safe:block"
          >
            <div className="relative h-8">
              {dayMarks.map((m, i) => (
                <span
                  key={m.day}
                  className={cn(
                    "absolute top-0 -translate-x-1/2 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300",
                    i <= activeDay ? "text-gold" : "text-white/40",
                  )}
                  style={{ left: `${m.at * 100}%` }}
                >
                  {days.find((d) => d.id === m.day)?.short}
                </span>
              ))}
            </div>
            <div className="h-px bg-white/15">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="h-full origin-left bg-gradient-to-r from-scarlet via-royal to-royal-soft"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PanelContent({ panel }: { panel: Panel }) {
  switch (panel.type) {
    case "intro":
      return (
        <div className="flex h-full flex-col justify-center pb-6 md:max-w-3xl lg:motion-safe:pb-0">
          <motion.p
            variants={item}
            className="eyebrow mb-5 flex items-center gap-3 text-gold"
          >
            <span aria-hidden className="h-px w-8 bg-current" />
            {recitIntro.eyebrow}
          </motion.p>
          <motion.h2
            id="titre-recit"
            variants={item}
            className="display-xl text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] text-balance lg:motion-safe:text-[clamp(3rem,6vw,7rem)]"
          >
            {recitIntro.title}
          </motion.h2>
          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/80"
          >
            {recitIntro.text}
          </motion.p>
          <motion.p
            variants={item}
            aria-hidden
            className="mt-10 hidden items-center gap-3 text-sm font-semibold tracking-[0.2em] text-white/60 uppercase lg:motion-safe:flex"
          >
            Fais défiler
            <ArrowRight className="size-4 animate-pulse" />
          </motion.p>
        </div>
      );

    case "day": {
      const day = days.find((d) => d.id === panel.day);
      const recit = recitDays[panel.day];
      return (
        <div className="flex h-full flex-col justify-end border-t border-white/15 pt-10 lg:motion-safe:border-t-0 lg:motion-safe:border-l lg:motion-safe:pt-0 lg:motion-safe:pb-10 lg:motion-safe:pl-[2vw]">
          <motion.p variants={item} className="eyebrow text-gold">
            {recit.kicker}
          </motion.p>
          <motion.h3
            variants={item}
            className="display-xl mt-3 w-fit text-gradient text-[clamp(3.5rem,12vw,7rem)] lg:motion-safe:text-[clamp(3rem,5vw,6.5rem)]"
          >
            {day?.label}
          </motion.h3>
          <motion.p
            variants={item}
            className="mt-2 text-sm font-semibold text-white/60"
          >
            {day?.date}
          </motion.p>
          <motion.p
            variants={item}
            className="mt-4 max-w-sm leading-relaxed text-white/80"
          >
            {recit.text}
          </motion.p>
        </div>
      );
    }

    case "event": {
      const { event } = panel;
      const style = venueStyles[event.venue];
      const venue = venues.find((v) => v.id === event.venue);
      const Icon = kindIcons[event.kind];
      const color = `var(--venue-${event.venue})`;
      return (
        <article className="relative isolate flex h-full min-h-[22rem] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 sm:p-9">
          <div
            aria-hidden
            className={cn(
              "absolute inset-x-0 top-0 h-1 bg-gradient-to-r to-transparent",
              style.bar,
            )}
          />
          <div
            aria-hidden
            className="absolute -top-1/3 -right-1/3 -z-10 size-[26rem] rounded-full blur-[80px]"
            style={{ background: style.glow }}
          />
          <Icon
            aria-hidden
            className="absolute -right-6 -bottom-6 -z-10 size-48 text-white/[0.05]"
          />

          <motion.div
            variants={item}
            className="flex flex-wrap items-center gap-2 text-xs font-semibold"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5">
              <span
                aria-hidden
                className={cn("size-2 rounded-full", style.dot)}
              />
              <MapPin aria-hidden className="size-3.5" />
              {venue?.label}
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1.5">
              {kindLabels[event.kind]}
            </span>
          </motion.div>

          <motion.p
            variants={item}
            className="display-xl mt-auto pt-10 text-[clamp(3.5rem,10vw,6rem)] tabular-nums lg:motion-safe:text-[clamp(3.5rem,5vw,6.5rem)]"
            style={{ color }}
          >
            {event.start}
          </motion.p>
          <motion.h4
            variants={item}
            className="mt-4 font-display text-2xl leading-tight font-extrabold tracking-tight text-balance sm:text-3xl"
          >
            {event.title}
          </motion.h4>
          <motion.p
            variants={item}
            className="mt-3 max-w-md leading-relaxed text-white/80"
          >
            {event.description}
          </motion.p>
        </article>
      );
    }

    case "outro":
      return (
        <div className="flex h-full flex-col justify-center rounded-[2rem] border border-dashed border-white/20 p-8 sm:p-10">
          <motion.p variants={item} className="eyebrow text-gold">
            Et maintenant
          </motion.p>
          <motion.p
            variants={item}
            className="mt-4 font-display text-4xl leading-[0.95] font-extrabold tracking-tight sm:text-5xl"
          >
            À toi de composer ton Giron.
          </motion.p>
          <motion.div variants={item} className="mt-8">
            <ButtonLink href="#programme" arrow>
              Voir tout le programme
            </ButtonLink>
          </motion.div>
        </div>
      );
  }
}
