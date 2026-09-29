import { MapPin, Tag } from "lucide-react";
import { days, venues, type ProgrammeEvent } from "@/content/programme";
import { cn } from "@/lib/cn";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { kindIcons, kindLabels, venueStyles } from "./meta";

export function EventCard({
  event,
  showDay = false,
  className,
}: {
  event: ProgrammeEvent;
  showDay?: boolean;
  className?: string;
}) {
  const Icon = kindIcons[event.kind];
  const venue = venues.find((v) => v.id === event.venue);
  const day = days.find((d) => d.id === event.day);
  const style = venueStyles[event.venue];

  return (
    <SpotlightCard color={style.glow} className={cn("h-full", className)}>
      <article className="flex h-full flex-col p-6">
        <div
          aria-hidden
          className={cn(
            "absolute inset-x-0 top-0 h-1 bg-gradient-to-r to-transparent",
            style.bar,
          )}
        />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-3xl font-extrabold tabular-nums">
              {event.start}
              {event.end && (
                <span className="text-lg font-semibold text-muted">
                  {" "}
                  – {event.end}
                </span>
              )}
            </p>
            {showDay && day && (
              <p className="mt-1 text-sm font-medium text-muted">
                {day.label} {day.date}
              </p>
            )}
          </div>
          <span
            className={cn(
              "grid size-12 shrink-0 place-items-center rounded-2xl text-ink transition-transform duration-500 group-hover/spot:scale-110 group-hover/spot:-rotate-6",
              style.soft,
            )}
          >
            <Icon aria-hidden className="size-6" />
          </span>
        </div>

        <h3 className="mt-6 font-display text-xl leading-tight font-bold text-balance">
          {event.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {event.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5">
            <span
              aria-hidden
              className={cn("size-2 rounded-full", style.dot)}
            />
            <MapPin aria-hidden className="size-3.5" />
            {venue?.label}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5">
            <Tag aria-hidden className="size-3.5" />
            {kindLabels[event.kind]}
          </span>
        </div>
      </article>
    </SpotlightCard>
  );
}
