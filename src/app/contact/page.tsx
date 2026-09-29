import type { Metadata } from "next";
import {
  HandHeart,
  Handshake,
  Mail,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { site } from "@/content/site";
import { MailtoForm } from "@/components/forms/MailtoForm";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter la jeunesse organisatrice du Giron 2028.",
};

const channels: Array<{
  icon: LucideIcon;
  title: string;
  value: string;
  href?: string;
}> = [
  {
    icon: Mail,
    title: "Questions générales",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    icon: HandHeart,
    title: "Bénévoles",
    value: site.volunteersEmail,
    href: `mailto:${site.volunteersEmail}`,
  },
  {
    icon: Handshake,
    title: "Sponsoring",
    value: site.sponsorsEmail,
    href: `mailto:${site.sponsorsEmail}`,
  },
  { icon: MapPin, title: "Place de fête", value: site.place },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow={site.organizer}
        title={
          <>
            On se <span className="text-gradient">parle</span>&nbsp;?
          </>
        }
        intro="Une question, une idée, une envie de participer ? Écris-nous, on répond vite."
      />

      <Section aria-labelledby="titre-coordonnees">
        <h2 id="titre-coordonnees" className="sr-only">
          Coordonnées
        </h2>
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c) => (
            <StaggerItem key={c.title}>
              <SpotlightCard className="h-full p-6">
                <c.icon aria-hidden className="size-8 text-accent-strong" />
                <h3 className="mt-8 text-sm font-semibold text-muted">
                  {c.title}
                </h3>
                {c.href ? (
                  <a
                    href={c.href}
                    className="mt-1 block font-display text-lg font-bold underline-offset-4 hover:text-accent-strong hover:underline"
                  >
                    {c.value.split("@")[0]}
                    <wbr />@{c.value.split("@")[1]}
                  </a>
                ) : (
                  <p className="mt-1 font-display text-lg font-bold">
                    {c.value}
                  </p>
                )}
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="sunken" aria-labelledby="titre-message">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              id="titre-message"
              eyebrow="Message"
              title="Écris-nous"
              intro="Remplis le formulaire : ton application e-mail s'ouvrira avec ton message prêt à partir."
            />
            <Reveal delay={0.1} className="mt-10">
              <p className="eyebrow mb-4 text-muted">Réseaux</p>
              <ul className="flex gap-3">
                {site.socials.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      aria-label={s.name}
                      className="grid size-12 place-items-center rounded-full border-2 border-ink transition-[background-color,color,transform] duration-300 hover:-translate-y-1 hover:bg-ink hover:text-surface"
                    >
                      <SocialIcon name={s.name} />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="rounded-[2rem] border border-line bg-surface p-6 sm:p-10 lg:col-span-8">
            <MailtoForm
              to={site.email}
              subject="Message depuis le site — Giron 2028"
              fields={[
                {
                  type: "text",
                  name: "nom",
                  label: "Nom",
                  required: true,
                  autoComplete: "name",
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
                { type: "text", name: "sujet", label: "Sujet", required: true },
                {
                  type: "textarea",
                  name: "message",
                  label: "Message",
                  required: true,
                },
              ]}
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
