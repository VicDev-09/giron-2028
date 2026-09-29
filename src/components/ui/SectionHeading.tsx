import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <p className="eyebrow mb-4 flex items-center gap-3 text-accent-strong">
            <span aria-hidden className="h-px w-8 bg-current" />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2
          id={id}
          className="font-display text-4xl leading-[0.95] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl"
        >
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p className="mt-6 text-lg leading-relaxed text-pretty text-muted">
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
