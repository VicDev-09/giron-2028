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
        className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-amber to-coral text-sm text-night shadow-[0_0_24px_-4px_rgba(255,90,54,0.8)]"
      >
        28
      </span>
      Giron
    </span>
  );
}
