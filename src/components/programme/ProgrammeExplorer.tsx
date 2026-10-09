"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import {
  days,
  programme,
  venues,
  type DayId,
  type VenueId,
} from "@/content/programme";
import { cn } from "@/lib/cn";
import { EventCard } from "./EventCard";
import { venueStyles } from "./meta";

type DayFilter = DayId | "tous";

const ease = [0.22, 1, 0.36, 1] as const;

/** Programme interactif : filtres par jour et par lieu, cartes animées. */
export function ProgrammeExplorer() {
  const [day, setDay] = useState<DayFilter>("tous");
  const [selectedVenues, setSelectedVenues] = useState<VenueId[]>([]);

  const toggleVenue = (id: VenueId) =>
    setSelectedVenues((current) =>
      current.includes(id) ? current.filter((v) => v !== id) : [...current, id],
    );

  const reset = () => {
    setDay("tous");
    setSelectedVenues([]);
  };

  const groups = useMemo(() => {
    const filtered = programme
      .filter((e) => day === "tous" || e.day === day)
      .filter(
        (e) => selectedVenues.length === 0 || selectedVenues.includes(e.venue),
      )
      .sort((a, b) => a.start.localeCompare(b.start));

    return days
      .map((d) => ({ day: d, events: filtered.filter((e) => e.day === d.id) }))
      .filter((g) => g.events.length > 0);
  }, [day, selectedVenues]);

  const count = groups.reduce((n, g) => n + g.events.length, 0);
  const filtersActive = day !== "tous" || selectedVenues.length > 0;

  return (
    <div>
      {/* Filtres */}
      <div className="sticky top-20 z-20 -mx-4 mb-10 border-y border-line bg-surface/85 px-4 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-3xl sm:border sm:px-5">
        <fieldset>
          <legend className="eyebrow mb-3 text-muted">Jour</legend>
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
            {[{ id: "tous" as const, label: "Tous", date: "" }, ...days].map(
              (d) => {
                const active = day === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setDay(d.id)}
                    className={cn(
                      "relative isolate shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                      active ? "text-white" : "text-ink hover:bg-sunken",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="day-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-royal"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.5,
                        }}
                      />
                    )}
                    {d.label}
                  </button>
                );
              },
            )}
          </div>
        </fieldset>

        <fieldset className="mt-4">
          <legend className="eyebrow mb-3 text-muted">Lieu</legend>
          <div className="flex flex-wrap gap-2">
            {venues.map((v) => {
              const active = selectedVenues.includes(v.id);
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleVenue(v.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-[background-color,border-color,transform] duration-300 active:scale-95",
                    active
                      ? "border-ink bg-ink text-surface"
                      : "border-line hover:border-ink",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-4 place-items-center rounded-full",
                      venueStyles[v.id].dot,
                    )}
                  >
                    {active && <Check className="size-3 text-deep" />}
                  </span>
                  {v.label}
                </button>
              );
            })}
            <AnimatePresence>
              {filtersActive && (
                <motion.button
                  type="button"
                  onClick={reset}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-accent-strong hover:underline"
                >
                  <RotateCcw aria-hidden className="size-4" />
                  Réinitialiser
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </fieldset>
      </div>

      <p aria-live="polite" className="mb-8 text-sm font-medium text-muted">
        {count} rendez-vous
        {day !== "tous" && ` · ${days.find((d) => d.id === day)?.label}`}
        {selectedVenues.length > 0 &&
          ` · ${selectedVenues
            .map((id) => venues.find((v) => v.id === id)?.label)
            .join(", ")}`}
      </p>

      {/* Résultats */}
      <div className="space-y-16">
        <AnimatePresence mode="popLayout">
          {groups.map((group) => (
            <motion.section
              key={group.day.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease }}
              aria-labelledby={`jour-${group.day.id}`}
            >
              <div className="mb-6 flex items-baseline gap-4">
                <h3
                  id={`jour-${group.day.id}`}
                  className="display-xl text-5xl sm:text-6xl"
                >
                  {group.day.label}
                </h3>
                <span className="text-sm font-semibold text-muted">
                  {group.day.date}
                </span>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {group.events.map((event, i) => (
                    <motion.li
                      key={event.id}
                      layout
                      initial={{ opacity: 0, scale: 0.94, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.45, ease, delay: i * 0.04 }}
                    >
                      <EventCard event={event} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </motion.section>
          ))}
        </AnimatePresence>

        {count === 0 && (
          <div className="rounded-3xl border border-dashed border-line p-12 text-center">
            <p className="font-display text-2xl font-bold">
              Rien à cet endroit ce jour-là.
            </p>
            <p className="mt-2 text-muted">
              Essaie un autre lieu ou un autre jour.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 font-semibold text-accent-strong underline underline-offset-4"
            >
              Voir tout le programme
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
