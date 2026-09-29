import Image from "next/image";
import type { Sponsor } from "@/content/sponsors";
import { cn } from "@/lib/cn";

const tierAccent = {
  or: "from-amber/35 to-amber/5 text-amber",
  argent: "from-[#c9c3d6]/35 to-[#c9c3d6]/5 text-[#8a829c]",
  bronze: "from-[#d98a52]/35 to-[#d98a52]/5 text-[#b8703e]",
} as const;

/**
 * Emplacement de logo partenaire. Sans logo fourni, affiche un monogramme
 * neutre (aucun faux sponsor réel n'est inventé).
 */
export function SponsorLogo({
  sponsor,
  className,
  aspect = "aspect-[5/3]",
}: {
  sponsor: Sponsor;
  className?: string;
  aspect?: string;
}) {
  return (
    <div
      className={cn(
        "group/logo relative flex items-center justify-center overflow-hidden rounded-2xl border border-line bg-elevated p-5 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_20px_50px_-25px_rgba(255,90,54,0.6)]",
        aspect,
        className,
      )}
    >
      {sponsor.logo ? (
        <Image
          src={sponsor.logo}
          alt={sponsor.name}
          fill
          sizes="240px"
          className="object-contain p-6 grayscale transition-[filter] duration-500 group-hover/logo:grayscale-0"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <span
            aria-hidden
            className={cn(
              "grid size-12 place-items-center rounded-full bg-gradient-to-br font-display text-lg font-extrabold transition-transform duration-500 group-hover/logo:scale-110 group-hover/logo:rotate-6",
              tierAccent[sponsor.tier],
            )}
          >
            {sponsor.name.split(" ").at(-1)}
          </span>
          <span className="text-sm font-semibold text-muted">
            {sponsor.name}
          </span>
        </div>
      )}
    </div>
  );
}
