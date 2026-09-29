import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "light" | "sunken" | "night";

const tones: Record<Tone, string> = {
  light: "bg-surface text-ink",
  sunken: "bg-sunken text-ink",
  night: "tone-night grain",
};

interface SectionProps {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
}

/** Bloc de page pleine largeur avec conteneur centré. */
export function Section({
  id,
  tone = "light",
  className,
  containerClassName,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-20 sm:py-28",
        tones[tone],
        className,
      )}
      {...rest}
    >
      <Container className={cn("relative z-10", containerClassName)}>
        {children}
      </Container>
    </section>
  );
}

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}
