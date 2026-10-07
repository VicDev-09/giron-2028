import type { Metadata } from "next";
import { highlights } from "@/content/programme";
import { site } from "@/content/site";
import { PageHero } from "@/components/layout/PageHero";
import { kindIcons } from "@/components/programme/meta";
import { ProgrammeExplorer } from "@/components/programme/ProgrammeExplorer";
import { ProgrammeStory } from "@/components/programme/ProgrammeStory";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "La Fête",
  description:
    "Programme interactif du Giron 2028 : concerts, cortège, loto, souper et jeux, jour par jour et lieu par lieu.",
};

export default function LaFetePage() {
  return (
    <>
      <PageHero
        eyebrow={`${site.datesLabel} · ${site.place}`}
        title={
          <>
            La <span className="text-gradient">fête</span>
          </>
        }
        intro="Quatre jours, quatre lieux et un programme à composer selon tes envies. Filtre par jour et par lieu pour ne rien manquer."
      >
        <div className="mt-10">
          <ButtonLink href="#programme" size="lg" arrow>
            Explorer le programme
          </ButtonLink>
        </div>
      </PageHero>

      <ProgrammeStory />

      <Section id="programme" aria-labelledby="titre-programme">
        <SectionHeading
          id="titre-programme"
          eyebrow="Programme"
          title="Compose ton Giron"
          intro="Programme provisoire : les artistes et horaires définitifs seront annoncés prochainement."
          className="mb-12"
        />
        <ProgrammeExplorer />
      </Section>

      <Section
        id="temps-forts"
        tone="night"
        aria-labelledby="titre-temps-forts"
      >
        <SectionHeading
          id="titre-temps-forts"
          eyebrow="Temps forts"
          title="Ce qu'il ne faut pas manquer"
          className="mb-16"
        />
        <ol className="space-y-4">
          {highlights.map((h, i) => {
            const Icon = kindIcons[h.kind];
            return (
              <Reveal as="li" key={h.kind}>
                <article
                  className={cn(
                    "group grid items-center gap-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition-[background-color,border-color] duration-500 hover:border-coral/50 hover:bg-white/[0.07] sm:grid-cols-[auto_1fr_auto] sm:gap-10 sm:p-10",
                  )}
                >
                  <span className="display-xl text-6xl text-white/20 transition-colors duration-500 group-hover:text-coral sm:text-8xl">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                      {h.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-lg leading-relaxed text-white/80">
                      {h.text}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-amber">
                      {h.detail}
                    </p>
                  </div>
                  <span className="hidden size-20 place-items-center rounded-full bg-white/[0.06] transition-[transform,background-color] duration-500 group-hover:scale-110 group-hover:-rotate-12 group-hover:bg-coral group-hover:text-night sm:grid">
                    <Icon aria-hidden className="size-9" />
                  </span>
                </article>
              </Reveal>
            );
          })}
        </ol>
      </Section>
    </>
  );
}
