import { cn } from "@/lib/cn";

/** Logotype provisoire, en attendant l'identité officielle. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 font-display text-xl leading-none font-extrabold tracking-tight text-white uppercase",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-scarlet to-royal text-sm text-white shadow-[0_0_24px_-4px_color-mix(in_srgb,var(--brand-scarlet)_80%,transparent)]"
      >
        28
      </span>
      Giron
    </span>
  );
}
