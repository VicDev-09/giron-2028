import { ArrowUpRight, HandHeart, Handshake, Sparkle } from "lucide-react";
import Link from "next/link";
import { highlights, programme, venues } from "@/content/programme";
import { site } from "@/content/site";
import { sponsors } from "@/content/sponsors";
import { ButtonLink } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { EventCard } from "@/components/programme/EventCard";
import { kindIcons, venueStyles } from "@/components/programme/meta";
import { SponsorLogo } from "@/components/sponsors/SponsorLogo";
import { cn } from "@/lib/cn";

const keywords = [
  "Concerts",
  "Cortège",
  "Loto",
  "Souper",
  "Caveau",
  "Tonnelle",
  "Jeux enfants",
  "Bal",
];

/** Bandeau corail de mots-clés défilants. */
export function KeywordBand() {
  return (
    <div className="relative z-10 -my-6 -rotate-2 bg-coral py-5 text-[#1b1225] shadow-2xl sm:py-6">
      <Marquee duration={32}>
        {keywords.map((word) => (
          <span
            key={word}
            className="flex items-center gap-8 pr-8 font-display text-3xl font-extrabold tracking-tight uppercase sm:text-5xl"
          >
            {word}
            <Sparkle aria-hidden className="size-6 fill-current sm:size-8" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}

/** Présentation de la fête et de ses quatre lieux. */
export function FestTeaser() {
  return (
    <Section id="la-fete" className="pt-28 sm:pt-36">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="La fête"
            title={
              <>
                Quatre jours.
                <br />
                Un village.
                <br />
                <span className="text-accent-strong">Toute la Glâne.</span>
              </>
            }
            intro="Le Giron, c'est la grande fête des jeunesses glânoises : des concerts, un cortège, un loto, des retrouvailles et des souvenirs pour toute une vie."
          />
          <Reveal delay={0.15} className="mt-10">
            <ButtonLink href="/la-fete" arrow variant="secondary">
              Découvrir la fête
            </ButtonLink>
          </Reveal>
        </div>

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {venues.map((venue, i) => (
            <StaggerItem
              key={venue.id}
              className={cn(i % 2 === 1 && "sm:mt-12")}
            >
              <SpotlightCard
                color={venueStyles[venue.id].glow}
                className="h-full p-7"
              >
                <span
                  aria-hidden
                  className={cn(
                    "mb-10 block size-3 rounded-full",
                    venueStyles[venue.id].dot,
                  )}
                  style={{
                    boxShadow: `0 0 0 8px ${venueStyles[venue.id].glow}`,
                  }}
                />
                <p className="text-sm font-semibold text-muted tabular-nums">
                  0{i + 1}
                </p>
                <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
                  {venue.label}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">
                  {venue.description}
                </p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

/** Aperçu des temps forts du programme, en carrousel horizontal. */
export function ProgrammePreview() {
  const featured = programme.filter((e) => e.highlight);

  return (
    <Section tone="sunken" aria-labelledby="apercu-programme">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          id="apercu-programme"
          eyebrow="Programme"
          title="Les temps forts"
          intro="Un avant-goût du programme — les artistes et horaires définitifs seront annoncés prochainement."
        />
        <Reveal>
          <ButtonLink href="/la-fete" arrow>
            Programme complet
          </ButtonLink>
        </Reveal>
      </div>

      <Stagger
        as="ul"
        className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:thin] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {featured.map((event) => (
          <StaggerItem
            as="li"
            key={event.id}
            className="w-[82vw] max-w-sm shrink-0 snap-start sm:w-[360px]"
          >
            <EventCard event={event} showDay />
          </StaggerItem>
        ))}
      </Stagger>

      <Stagger className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {highlights.map((h) => {
          const Icon = kindIcons[h.kind];
          return (
            <StaggerItem key={h.kind}>
              <Link
                href="/la-fete#temps-forts"
                className="group flex h-full flex-col items-start gap-6 rounded-3xl border border-line bg-elevated p-5 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent"
              >
                <Icon
                  aria-hidden
                  className="size-7 text-accent-strong transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12"
                />
                <span className="font-display text-lg font-bold">
                  {h.title}
                </span>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}

/** Deux grands appels : bénévoles et sponsors. */
export function CallsToAction() {
  const calls = [
    {
      href: "/benevoles",
      icon: HandHeart,
      eyebrow: "Bénévoles",
      title: "Vis le Giron de l'intérieur",
      text: "Bar, cantine, montage, accueil… Rejoins l'équipe qui fait la fête.",
      cta: "Je m'annonce",
      gradient: "from-coral via-[#ff3d7f] to-plum-2",
    },
    {
      href: "/sponsors",
      icon: Handshake,
      eyebrow: "Sponsors",
      title: "Associez votre nom à la fête",
      text: "Des milliers de visiteurs, une région entière : devenez partenaire du Giron 2028.",
      cta: "Devenir partenaire",
      gradient: "from-amber via-coral to-plum",
    },
  ];

  return (
    <Section tone="night">
      <div className="grid gap-5 lg:grid-cols-2">
        {calls.map((c, i) => (
          <Reveal key={c.href} delay={i * 0.1}>
            <Link
              href={c.href}
              className="group relative isolate flex min-h-[26rem] flex-col justify-between overflow-hidden rounded-[2rem] p-8 sm:p-10"
            >
              <div
                aria-hidden
                className={cn(
                  "absolute inset-0 -z-10 bg-gradient-to-br opacity-90 transition-transform duration-700 ease-out group-hover:scale-110",
                  c.gradient,
                )}
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.35),transparent_45%)]"
              />
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-2xl bg-night/20 text-[#1b1225] backdrop-blur">
                  <c.icon aria-hidden className="size-7" />
                </span>
                <span className="grid size-14 place-items-center rounded-full bg-night text-white transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight aria-hidden className="size-6" />
                </span>
              </div>
              <div className="text-[#1b1225]">
                <p className="eyebrow">{c.eyebrow}</p>
                <h2 className="mt-3 font-display text-4xl leading-[0.95] font-extrabold tracking-tight sm:text-5xl">
                  {c.title}
                </h2>
                <p className="mt-4 max-w-md text-lg font-medium">{c.text}</p>
                <p className="mt-6 inline-flex items-center gap-2 font-semibold underline decoration-2 underline-offset-4">
                  {c.cta}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/** Défilé des partenaires. */
export function SponsorsStrip() {
  return (
    <Section aria-labelledby="partenaires" className="py-16 sm:py-20">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="partenaires"
          className="font-display text-2xl font-bold tracking-tight"
        >
          Ils soutiennent le Giron
        </h2>
        <Link
          href="/sponsors"
          className="font-semibold text-accent-strong underline-offset-4 hover:underline"
        >
          Tous les partenaires →
        </Link>
      </div>
      <Marquee duration={50}>
        {sponsors
          .filter((s) => s.tier !== "bronze")
          .map((s) => (
            <SponsorLogo key={s.id} sponsor={s} className="mx-2 w-52" />
          ))}
      </Marquee>
    </Section>
  );
}

/** Invitation à suivre les réseaux. */
export function SocialSection() {
  return (
    <Section tone="sunken" className="text-center">
      <SectionHeading
        align="center"
        eyebrow="Réseaux"
        title={
          <>
            Suis l&apos;aventure{" "}
            <span className="text-accent-strong">jusqu&apos;au Giron</span>
          </>
        }
        intro="Annonces d'artistes, coulisses des constructions, appels aux bénévoles : tout se passe sur nos réseaux."
      />
      <Stagger className="mt-12 flex flex-wrap justify-center gap-4">
        {site.socials.map((s) => (
          <StaggerItem key={s.name}>
            <a
              href={s.href}
              className="group flex items-center gap-4 rounded-full border-2 border-ink py-2 pr-7 pl-2 font-semibold transition-[background-color,color,transform] duration-300 hover:-translate-y-1 hover:bg-ink hover:text-surface"
            >
              <span className="grid size-12 place-items-center rounded-full bg-coral text-[#1b1225] transition-transform duration-500 group-hover:rotate-[-12deg]">
                <SocialIcon name={s.name} />
              </span>
              <span className="text-left">
                <span className="block">{s.name}</span>
                <span className="block text-sm font-medium opacity-70">
                  {s.handle}
                </span>
              </span>
            </a>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
