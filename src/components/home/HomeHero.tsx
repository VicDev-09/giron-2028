import { CalendarDays, ChevronDown, MapPin } from "lucide-react";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { NightScene } from "@/components/ui/NightScene";
import { Container } from "@/components/ui/Section";
import { TentKnock } from "@/components/treasure/TentKnock";
import { TreasureDecoy } from "@/components/treasure/TreasureDecoy";

const delay = (s: number) => ({ animationDelay: `${s}s` });

function Letters({
  text,
  start,
  gradient = false,
}: {
  text: string;
  start: number;
  /** Dégradé continu réparti sur les lettres (chaque lettre est animée) */
  gradient?: boolean;
}) {
  const n = text.length;
  return (
    <span aria-hidden className="inline-flex overflow-hidden pb-[0.04em]">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={`inline-block animate-rise${gradient ? " text-gradient" : ""}`}
          style={{
            ...delay(start + i * 0.05),
            ...(gradient && {
              backgroundSize: `${n * 100}% 100%`,
              backgroundPosition: `${n > 1 ? (i / (n - 1)) * 100 : 0}% 0`,
            }),
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export function HomeHero() {
  const { video, image } = site.heroMedia;

  return (
    <section className="tone-night grain relative isolate flex min-h-svh flex-col overflow-hidden">
      {video || image ? (
        <div aria-hidden className="absolute inset-0 -z-10">
          {video ? (
            <video
              className="size-full object-cover"
              src={video}
              poster={image || undefined}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- image de fond optionnelle fournie plus tard
            <img src={image} alt="" className="size-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/50 to-night" />
        </div>
      ) : (
        <NightScene alive className="-z-10" />
      )}

      {/* Chasse au trésor : cachette « La toile » (rien d'affiché) + leurre */}
      <TentKnock />
      <TreasureDecoy
        glyph="etoile"
        className="absolute top-[17%] right-[8%] sm:top-[24%] sm:right-[22%]"
      />

      <Container className="flex flex-1 flex-col justify-end gap-12 pt-32 pb-20 lg:grid lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end lg:gap-16 lg:pb-24">
        <div>
          <p
            className="eyebrow flex animate-rise items-center gap-3 text-amber"
            style={delay(0.1)}
          >
            <span aria-hidden className="h-px w-10 bg-current" />
            {site.region}
          </p>

          <h1 className="display-xl mt-6 text-[clamp(4.5rem,27vw,15rem)]">
            <span className="sr-only">{site.fullName}</span>
            <Letters text="Giron" start={0.15} />
            <br />
            <Letters text="2028" start={0.45} gradient />
          </h1>

          <div
            className="mt-8 flex animate-rise flex-col gap-3 text-base text-white/85 sm:flex-row sm:gap-8 sm:text-lg"
            style={delay(0.7)}
          >
            <p className="flex items-center gap-2">
              <CalendarDays aria-hidden className="size-5 text-amber" />
              {site.datesLabel}
            </p>
            <p className="flex items-center gap-2">
              <MapPin aria-hidden className="size-5 text-amber" />
              {site.place}
            </p>
          </div>
        </div>

        <div className="animate-rise" style={delay(0.85)}>
          <p className="eyebrow mb-3 text-white/70">Le Giron commence dans</p>
          <Countdown
            target={site.startsAt}
            label={`Le Giron commence en ${site.datesLabel}.`}
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/la-fete" size="lg" arrow>
              Voir le programme
            </ButtonLink>
            <ButtonLink
              href="/infos-pratiques"
              size="lg"
              variant="secondary"
              magnetic
              className="text-white hover:bg-white hover:text-night"
            >
              Infos pratiques
            </ButtonLink>
          </div>
        </div>
      </Container>

      <a
        href="#la-fete"
        aria-label="Découvrir la suite"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold tracking-[0.2em] text-white/70 uppercase transition-colors hover:text-white sm:flex"
      >
        Défiler
        <ChevronDown aria-hidden className="size-5 animate-bounce" />
      </a>
    </section>
  );
}
