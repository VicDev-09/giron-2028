import type { ReactNode } from "react";
import { NightScene } from "@/components/ui/NightScene";
import { Container } from "@/components/ui/Section";

const rise = (delay: number) => ({ animationDelay: `${delay}s` });

/** En-tête immersif des pages intérieures. */
export function PageHero({
  eyebrow,
  title,
  intro,
  children,
  ornament,
  band,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  /** Petit motif au-dessus du surtitre (accent britannique de la page) */
  ornament?: ReactNode;
  /** Bandeau décoratif au pied du héros */
  band?: "tartan";
}) {
  return (
    <section className="tone-night grain relative isolate flex min-h-[72svh] items-end overflow-hidden pt-32 pb-20 sm:min-h-[78svh] sm:pb-28">
      <NightScene intensity={0.8} className="-z-10" />
      {band === "tartan" && (
        <div
          aria-hidden
          className="tartan absolute inset-x-0 bottom-0 h-3 opacity-90 sm:h-4"
        />
      )}
      <Container>
        {ornament && (
          <div className="mb-6 animate-rise" style={rise(0)}>
            {ornament}
          </div>
        )}
        <p
          className="eyebrow mb-6 flex animate-rise items-center gap-3 text-gold"
          style={rise(0)}
        >
          <span aria-hidden className="h-px w-10 bg-current" />
          {eyebrow}
        </p>
        <h1
          className="display-xl max-w-5xl animate-rise text-[clamp(3.2rem,11vw,9rem)] text-balance"
          style={rise(0.08)}
        >
          {title}
        </h1>
        {intro && (
          <p
            className="mt-8 max-w-2xl animate-rise text-lg leading-relaxed text-pretty text-white/80 sm:text-xl"
            style={rise(0.16)}
          >
            {intro}
          </p>
        )}
        {children && (
          <div className="animate-rise" style={rise(0.24)}>
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}
