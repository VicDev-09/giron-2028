import type { Metadata } from "next";
import Link from "next/link";
import {
  Bike,
  BusFront,
  Car,
  Check,
  CircleParking,
  CreditCard,
  Moon,
  Tent,
  TrainFront,
  type LucideIcon,
} from "lucide-react";
import {
  access,
  camping,
  cashlessSteps,
  faq,
  parking,
  shuttles,
} from "@/content/infos";
import { site } from "@/content/site";
import { PageHero } from "@/components/layout/PageHero";
import { SitePlan } from "@/components/infos/SitePlan";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export const metadata: Metadata = {
  title: "Infos pratiques",
  description:
    "Accès, parking, plan du site, cashless, camping, navettes et FAQ du Giron 2028.",
};

const accessIcons: Record<(typeof access)[number]["mode"], LucideIcon> = {
  train: TrainFront,
  bus: BusFront,
  car: Car,
  bike: Bike,
};

const sections = [
  { id: "acces", label: "Accès" },
  { id: "plan", label: "Plan du site" },
  { id: "cashless", label: "Cashless" },
  { id: "camping", label: "Camping" },
  { id: "navettes", label: "Navettes" },
  { id: "faq", label: "FAQ" },
];

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed">
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent text-accent-fg">
            <Check aria-hidden className="size-3.5" />
          </span>
          <span className="text-muted">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function InfosPratiquesPage() {
  return (
    <>
      <PageHero
        eyebrow={site.place}
        title={
          <>
            Infos <span className="text-gradient">pratiques</span>
          </>
        }
        intro="Tout ce qu'il faut savoir pour venir, payer, dormir et rentrer en toute sécurité."
      >
        <nav aria-label="Sur cette page" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 transition-colors hover:border-coral hover:bg-coral hover:text-night"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {/* Accès + parking */}
      <Section id="acces" aria-labelledby="titre-acces">
        <SectionHeading
          id="titre-acces"
          eyebrow="Accès"
          title="Venir au Giron"
          intro="Privilégie les transports publics : c'est plus simple, plus sûr et plus sympa."
          className="mb-12"
        />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {access.map((a) => {
            const Icon = accessIcons[a.mode];
            return (
              <StaggerItem key={a.mode}>
                <SpotlightCard className="h-full p-6">
                  <Icon aria-hidden className="size-8 text-accent-strong" />
                  <h3 className="mt-8 font-display text-2xl font-bold">
                    {a.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">{a.text}</p>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal className="mt-6">
          <div className="grid gap-8 rounded-[2rem] border border-line bg-elevated p-8 sm:grid-cols-[auto_1fr] sm:p-10">
            <span className="grid size-16 place-items-center rounded-2xl bg-accent text-accent-fg">
              <CircleParking aria-hidden className="size-8" />
            </span>
            <div>
              <h3 className="font-display text-3xl font-extrabold">Parking</h3>
              <div className="mt-6">
                <Bullets items={parking} />
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Plan */}
      <Section id="plan" tone="sunken" aria-labelledby="titre-plan">
        <SectionHeading
          id="titre-plan"
          eyebrow="Plan du site"
          title="Repère-toi sur la place de fête"
          intro="Survole ou parcours la légende pour situer chaque espace."
          className="mb-12"
        />
        <Reveal>
          <SitePlan />
        </Reveal>
      </Section>

      {/* Cashless */}
      <Section id="cashless" tone="night" aria-labelledby="titre-cashless">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="titre-cashless"
              eyebrow="Cashless"
              title={
                <>
                  Un bracelet,{" "}
                  <span className="text-gradient">zéro monnaie</span>
                </>
              }
              intro="Au Giron, on paie sans espèces : plus rapide au bar, plus sûr pour tout le monde."
            />
            <Reveal delay={0.1} className="mt-10">
              <CreditCard
                aria-hidden
                className="size-24 text-coral"
                strokeWidth={1.2}
              />
            </Reveal>
          </div>
          <Stagger as="ol" className="space-y-4 lg:col-span-7">
            {cashlessSteps.map((step, i) => (
              <StaggerItem as="li" key={step.title}>
                <div className="flex gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                  <span className="display-xl text-5xl text-coral">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-bold">
                      {step.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-white/80">
                      {step.text}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Camping + navettes */}
      <Section aria-label="Camping et navettes">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <article
              id="camping"
              className="h-full rounded-[2rem] border border-line bg-elevated p-8 sm:p-10"
            >
              <Tent aria-hidden className="size-10 text-accent-strong" />
              <h2 className="mt-8 font-display text-4xl font-extrabold tracking-tight">
                Camping
              </h2>
              <div className="mt-6">
                <Bullets items={camping} />
              </div>
            </article>
          </Reveal>
          <Reveal delay={0.1}>
            <article
              id="navettes"
              className="h-full rounded-[2rem] border border-line bg-elevated p-8 sm:p-10"
            >
              <Moon aria-hidden className="size-10 text-accent-strong" />
              <h2 className="mt-8 font-display text-4xl font-extrabold tracking-tight">
                Navettes & rapatriement
              </h2>
              <div className="mt-6 space-y-6">
                {shuttles.map((s) => (
                  <div key={s.title}>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-1 leading-relaxed text-muted">{s.text}</p>
                  </div>
                ))}
                <p className="rounded-2xl bg-sunken p-4 text-sm font-semibold">
                  Tu as bu ? Tu ne conduis pas. Les navettes sont là pour ça.
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" tone="sunken" aria-labelledby="titre-faq">
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionHeading
            id="titre-faq"
            eyebrow="FAQ"
            title="Questions fréquentes"
            intro={
              <>
                Une autre question ?{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-accent-strong underline underline-offset-4"
                >
                  Écris-nous
                </Link>
                .
              </>
            }
            className="lg:col-span-4"
          />
          <Reveal className="lg:col-span-8">
            <Accordion items={faq} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
