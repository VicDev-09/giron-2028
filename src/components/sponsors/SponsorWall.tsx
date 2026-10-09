import { Medal } from "lucide-react";
import { sponsors, tiers, type SponsorTier } from "@/content/sponsors";
import { cn } from "@/lib/cn";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SponsorLogo } from "./SponsorLogo";

const layout: Record<SponsorTier, { grid: string; medal: string }> = {
  or: {
    grid: "grid-cols-1 sm:grid-cols-3",
    medal: "bg-gradient-to-br from-[#ffe08a] to-gold text-deep",
  },
  argent: {
    grid: "grid-cols-2 sm:grid-cols-3",
    medal: "bg-gradient-to-br from-white to-[#bdb6cc] text-deep",
  },
  bronze: {
    grid: "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6",
    medal: "bg-gradient-to-br from-[#f2b183] to-[#b8703e] text-deep",
  },
};

/** Mur des partenaires, organisé par catégorie. */
export function SponsorWall() {
  return (
    <div className="space-y-20">
      {tiers.map((tier) => {
        const list = sponsors.filter((s) => s.tier === tier.id);
        return (
          <section key={tier.id} aria-labelledby={`tier-${tier.id}`}>
            <Reveal className="mb-8 flex items-center gap-4">
              <span
                className={cn(
                  "grid size-12 place-items-center rounded-full shadow-lg",
                  layout[tier.id].medal,
                )}
              >
                <Medal aria-hidden className="size-6" />
              </span>
              <h3
                id={`tier-${tier.id}`}
                className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
              >
                Partenaires {tier.label}
              </h3>
              <span aria-hidden className="h-px flex-1 bg-line" />
            </Reveal>
            <Stagger
              as="ul"
              stagger={0.05}
              className={cn("grid gap-3 sm:gap-4", layout[tier.id].grid)}
            >
              {list.map((s) => (
                <StaggerItem as="li" key={s.id}>
                  <SponsorLogo
                    sponsor={s}
                    className={cn(
                      tier.id === "or" &&
                        "shadow-[0_18px_50px_-28px_color-mix(in_srgb,var(--brand-gold)_90%,transparent)] ring-2 ring-gold/50",
                    )}
                    aspect={
                      tier.id === "or"
                        ? "aspect-[16/9] sm:aspect-[4/3]"
                        : "aspect-[5/3]"
                    }
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        );
      })}
    </div>
  );
}
