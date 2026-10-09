import type { Metadata } from "next";
import {
  PartyPopper,
  Shirt,
  UsersRound,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { missions, perks, steps } from "@/content/benevoles";
import { days } from "@/content/programme";
import { site } from "@/content/site";
import { MailtoForm } from "@/components/forms/MailtoForm";
import { PageHero } from "@/components/layout/PageHero";
import { Thistle } from "@/components/ui/british/motifs";
import { ButtonLink } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export const metadata: Metadata = {
  title: "Bénévoles",
  description:
    "Deviens bénévole au Giron 2028 : missions, avantages et inscription.",
};

const perkIcons: Record<(typeof perks)[number]["id"], LucideIcon> = {
  repas: UtensilsCrossed,
  tshirt: Shirt,
  soiree: PartyPopper,
  equipe: UsersRound,
};

export default function BenevolesPage() {
  return (
    <>
      <PageHero
        ornament={<Thistle className="h-12 w-auto sm:h-14" />}
        band="tartan"
        eyebrow="On a besoin de toi"
        title={
          <>
            Deviens <span className="text-gradient">bénévole</span>
          </>
        }
        intro="Sans bénévoles, pas de Giron. Quelques heures de ton temps, des souvenirs pour la vie — et la meilleure place pour vivre la fête."
      >
        <div className="mt-10">
          <ButtonLink href="#inscription" size="lg" arrow>
            Je m&apos;annonce
          </ButtonLink>
        </div>
      </PageHero>

      <div className="border-b border-line bg-sunken py-6">
        <Marquee duration={36}>
          {missions.map((m) => (
            <span
              key={m}
              className="mx-3 rounded-full border border-line bg-elevated px-5 py-2.5 font-display text-lg font-bold whitespace-nowrap"
            >
              {m}
            </span>
          ))}
        </Marquee>
      </div>

      <Section aria-labelledby="titre-avantages">
        <SectionHeading
          id="titre-avantages"
          eyebrow="Pourquoi s'engager"
          title="Ce que le Giron te rend"
          intro="Avantages provisoires, à confirmer par le comité."
          className="mb-14"
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => {
            const Icon = perkIcons[p.id];
            return (
              <StaggerItem key={p.id}>
                <SpotlightCard className="h-full p-7">
                  <Icon
                    aria-hidden
                    className="size-10 text-accent-strong transition-transform duration-500 group-hover/spot:scale-110 group-hover/spot:-rotate-6"
                  />
                  <h3 className="mt-10 font-display text-2xl font-bold">
                    {p.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">{p.text}</p>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Section>

      <Section tone="night" aria-labelledby="titre-etapes">
        <SectionHeading
          id="titre-etapes"
          eyebrow="Comment ça marche"
          title="Trois étapes, et tu es dans l'équipe"
          className="mb-14"
        />
        <Stagger as="ol" className="grid gap-4 lg:grid-cols-3">
          {steps.map((s, i) => (
            <StaggerItem as="li" key={s.title}>
              <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
                <span
                  aria-hidden
                  className="display-xl absolute -top-4 -right-2 text-[9rem] text-white/[0.06]"
                >
                  {i + 1}
                </span>
                <span className="grid size-12 place-items-center rounded-full bg-scarlet font-display text-xl font-extrabold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-8 font-display text-2xl font-bold">
                  {s.title}
                </h3>
                <p className="mt-2 leading-relaxed text-white/80">{s.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section
        id="inscription"
        tone="sunken"
        aria-labelledby="titre-inscription"
      >
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              id="titre-inscription"
              eyebrow="Inscription"
              title="Je m'annonce"
              intro="Dis-nous qui tu es et quand tu es disponible : on revient vers toi avec des propositions de missions."
            />
          </div>
          <Reveal className="rounded-[2rem] border border-line bg-surface p-6 sm:p-10 lg:col-span-8">
            <MailtoForm
              to={site.volunteersEmail}
              subject="Inscription bénévole — Giron 2028"
              submitLabel="Envoyer mon inscription"
              fields={[
                {
                  type: "text",
                  name: "prenom",
                  label: "Prénom",
                  required: true,
                  autoComplete: "given-name",
                  half: true,
                },
                {
                  type: "text",
                  name: "nom",
                  label: "Nom",
                  required: true,
                  autoComplete: "family-name",
                  half: true,
                },
                {
                  type: "email",
                  name: "email",
                  label: "E-mail",
                  required: true,
                  autoComplete: "email",
                  half: true,
                },
                {
                  type: "tel",
                  name: "telephone",
                  label: "Téléphone",
                  autoComplete: "tel",
                  half: true,
                },
                {
                  type: "checkboxes",
                  name: "missions",
                  label: "Missions qui te tentent",
                  options: missions,
                },
                {
                  type: "checkboxes",
                  name: "jours",
                  label: "Disponibilités",
                  options: days.map((d) => d.label),
                },
                {
                  type: "textarea",
                  name: "message",
                  label: "Un mot pour le comité ?",
                },
              ]}
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
