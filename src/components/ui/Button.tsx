import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Magnetic } from "./Magnetic";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[transform,box-shadow,background-color,color,border-color] duration-300 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

// Halo lumineux du CTA principal : pseudo-élément flouté, révélé au survol
const halo =
  "isolate before:pointer-events-none before:absolute before:-inset-2 before:-z-10 before:rounded-full before:bg-amber/45 before:opacity-0 before:blur-xl before:transition-opacity before:duration-500 hover:before:opacity-100";

const variants: Record<Variant, string> = {
  primary: `${halo} bg-coral text-[#1b1225] shadow-[0_8px_30px_-8px_rgba(255,90,54,0.65)] hover:-translate-y-0.5 hover:bg-amber hover:shadow-[0_14px_40px_-10px_rgba(255,178,62,0.8)]`,
  secondary:
    "border-2 border-current text-ink hover:-translate-y-0.5 hover:bg-ink hover:text-surface",
  ghost: "text-ink underline-offset-4 hover:text-accent-strong hover:underline",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

interface LinkProps extends CommonProps {
  /** Effet magnétique au survol (desktop). Par défaut : CTA principaux. */
  magnetic?: boolean;
  /** Classes du conteneur magnétique (ex. masquage responsive) */
  wrapperClassName?: string;
}

function Content({
  children,
  arrow,
}: {
  children: ReactNode;
  arrow?: boolean;
}) {
  return (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  arrow,
  className,
  children,
  magnetic = variant === "primary",
  wrapperClassName,
  ...rest
}: LinkProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const hrefString = typeof href === "string" ? href : "";
  const external = /^(https?:|mailto:|tel:)/.test(hrefString);

  const link = external ? (
    <a href={hrefString} className={classes}>
      <Content arrow={arrow}>{children}</Content>
    </a>
  ) : (
    <Link href={href} className={classes} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </Link>
  );

  if (!magnetic) {
    return wrapperClassName ? (
      <span className={wrapperClassName}>{link}</span>
    ) : (
      link
    );
  }

  return (
    <Magnetic className={cn("inline-flex", wrapperClassName)}>{link}</Magnetic>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  arrow,
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      <Content arrow={arrow}>{children}</Content>
    </button>
  );
}
