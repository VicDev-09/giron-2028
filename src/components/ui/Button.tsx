import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[transform,box-shadow,background-color,color,border-color] duration-300 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-coral text-[#1b1225] shadow-[0_8px_30px_-8px_rgba(255,90,54,0.65)] hover:-translate-y-0.5 hover:bg-amber hover:shadow-[0_14px_40px_-10px_rgba(255,178,62,0.8)]",
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
  ...rest
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const hrefString = typeof href === "string" ? href : "";
  const external = /^(https?:|mailto:|tel:)/.test(hrefString);

  if (external) {
    return (
      <a href={hrefString} className={classes}>
        <Content arrow={arrow}>{children}</Content>
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </Link>
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
