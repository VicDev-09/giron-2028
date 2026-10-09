import type { Metadata } from "next";
import {
  Coins,
  Hammer,
  Megaphone,
  PartyPopper,
  ShieldCheck,
  UserRound,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { commissions, committee, type CommissionId } from "@/content/jeunesse";
import { site } from "@/content/site";
import { PageHero } from "@/components/layout/PageHero";
import { Crown } from "@/components/ui/british/motifs";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export const metadata: Metadata = {
  title: "La Jeunesse",
  description:
    "La jeunesse organisatrice du Giron 2028 : son histoire, son comité et ses commissions.",
};

const commissionIcons: Record<CommissionId, LucideIcon> = {
  constructions: Hammer,
  animations: PartyPopper,
  subsistance: UtensilsCrossed,
  finances: Coins,
  communication: Megaphone,
  securite: ShieldCheck,
};

const values = [
  { k: "4", label: "jours de fête" },
  { k: "4", label: "lieux sur la place" },
  { k: "6", label: "commissions" },
  { k: "1", label: "région réunie" },
];

export default function LaJeunessePage() {
  return (
    <>
      <PageHero
        ornament={<Crown className="h-8 w-auto sm:h-10" />}
        eyebrow={site.organizer}
        title={
          <>
            La <span className="text-gradient">jeunesse</span>
          </>
        }
        intro="Derrière le Giron, il y a une bande de jeunes de la Glâne qui bâtit, pendant des mois, la fête de toute une région."
      />

      <Section aria-labelledby="titre-histoire">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              id="titre-histoire"
              eyebrow="Qui sommes-nous"
              title="Une jeunesse, un village, une fête à organiser"
            />
            <Reveal delay={0.1}>
              <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
                <p>
                  Chaque année, une jeunesse de la Glâne reçoit l&apos;honneur
                  d&apos;organiser le Giron. En 2028, c&apos;est notre tour —{" "}
                  <strong className="text-ink">{site.organizer}</strong>{" "}
                  (présentation officielle à venir).
                </p>
                <p>
                  Constructions, programme, subsistance, sécurité : tout est
                  pensé et monté par des bénévoles, avec le soutien des
                  habitants, des entreprises et des autorités de la région.
                </p>
              </div>
            </Reveal>
          </div>
          <Stagger className="grid grid-cols-2 gap-3 self-center lg:col-span-5">
            {values.map((v) => (
              <StaggerItem key={v.label}>
                <div className="rounded-3xl border border-line bg-elevated p-6">
                  <p className="display-xl text-7xl text-accent-strong">
                    {v.k}
                  </p>
                  <p className="mt-3 font-semibold">{v.label}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section tone="night" aria-labelledby="titre-comite">
        <SectionHeading
          id="titre-comite"
          eyebrow="Le comité"
          title="Les visages du Giron"
          intro="La composition du comité sera publiée prochainement."
          className="mb-14"
        />
        <Stagger
          as="ul"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {committee.map((m) => (
            <StaggerItem as="li" key={m.role}>
              <div className="group text-center">
                <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-dusk-2 to-night">
                  <UserRound
                    aria-hidden
                    strokeWidth={1}
                    className="absolute inset-x-0 bottom-0 mx-auto size-3/4 text-white/15 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-scarlet/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>
                <p className="mt-4 font-display text-lg font-bold">{m.role}</p>
                <p className="text-sm text-white/70">{m.name}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="sunken" aria-labelledby="titre-commissions">
        <SectionHeading
          id="titre-commissions"
          eyebrow="Les commissions"
          title="Six équipes, une seule fête"
          className="mb-14"
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {commissions.map((c) => {
            const Icon = commissionIcons[c.id];
            return (
              <StaggerItem key={c.id}>
                <SpotlightCard className="h-full p-7">
                  <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-fg transition-transform duration-500 group-hover/spot:-rotate-6">
                    <Icon aria-hidden className="size-7" />
                  </span>
                  <h3 className="mt-8 font-display text-2xl font-bold">
                    {c.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">{c.text}</p>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>
        <Reveal className="mt-14 flex flex-col items-start gap-6 rounded-[2rem] bg-ink p-8 text-surface sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <p className="max-w-xl font-display text-2xl font-bold sm:text-3xl">
            Envie de rejoindre l&apos;une de ces équipes le temps du
            Giron&nbsp;?
          </p>
          <ButtonLink href="/benevoles" size="lg" arrow>
            Devenir bénévole
          </ButtonLink>
        </Reveal>
      </Section>
    </>
  );
}
