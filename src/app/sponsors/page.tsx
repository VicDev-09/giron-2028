import type { Metadata } from "next";
import { Check } from "lucide-react";
import { site } from "@/content/site";
import { tiers } from "@/content/sponsors";
import { PageHero } from "@/components/layout/PageHero";
import { SponsorWall } from "@/components/sponsors/SponsorWall";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Les partenaires du Giron 2028 et les offres pour devenir sponsor.",
};

export default function SponsorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Partenaires"
        title={
          <>
            Nos <span className="text-gradient">sponsors</span>
          </>
        }
        intro="Le Giron existe grâce aux entreprises et aux personnes qui le soutiennent. Merci à elles !"
      >
        <div className="mt-10">
          <ButtonLink href="#devenir-sponsor" size="lg" arrow>
            Devenir sponsor
          </ButtonLink>
        </div>
      </PageHero>

      <Section aria-labelledby="titre-mur">
        <SectionHeading
          id="titre-mur"
          eyebrow="Le mur des partenaires"
          title="Ils font le Giron avec nous"
          intro="Emplacements provisoires — les partenaires seront dévoilés au fil des signatures."
          className="mb-16"
        />
        <SponsorWall />
      </Section>

      <Section
        id="devenir-sponsor"
        tone="night"
        aria-labelledby="titre-devenir"
      >
        <SectionHeading
          id="titre-devenir"
          eyebrow="Devenir sponsor"
          title={
            <>
              Votre marque au cœur de{" "}
              <span className="text-gradient">la fête</span>
            </>
          }
          intro="Quatre jours de visibilité auprès de toute une région. Offres indicatives — contenu et conditions sur demande."
          className="mb-14"
        />
        <Stagger className="grid gap-4 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <StaggerItem key={tier.id}>
              <SpotlightCard
                className={cn("h-full p-8", i === 0 && "ring-2 ring-amber/60")}
                color="rgba(255, 178, 62, 0.18)"
              >
                {i === 0 && (
                  <p className="eyebrow mb-4 inline-block rounded-full bg-amber px-3 py-1 text-[#1b1225]">
                    Visibilité maximale
                  </p>
                )}
                <h3 className="display-xl text-6xl">{tier.label}</h3>
                <p className="mt-2 text-sm font-semibold text-white/70">
                  Tarif sur demande
                </p>
                <ul className="mt-8 space-y-3">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex gap-3 text-white/85">
                      <Check
                        aria-hidden
                        className="mt-0.5 size-5 shrink-0 text-coral"
                      />
                      {perk}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-14 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <ButtonLink
            href={`mailto:${site.sponsorsEmail}?subject=${encodeURIComponent("Devenir sponsor — Giron 2028")}`}
            size="lg"
            arrow
          >
            Demander le dossier sponsoring
          </ButtonLink>
          <p className="text-sm text-white/70">
            Ou écrivez-nous à{" "}
            <a
              href={`mailto:${site.sponsorsEmail}`}
              className="font-semibold text-white underline underline-offset-4"
            >
              {site.sponsorsEmail}
            </a>
          </p>
        </Reveal>
      </Section>
    </>
  );
}
