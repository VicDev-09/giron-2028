"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { navigation, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const ease = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => {
    setOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 320 && y > previous);
  });

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.35, ease }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
      >
        <div
          className={cn(
            "tone-night mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-full border px-4 transition-[background-color,border-color,box-shadow] duration-500 sm:px-6",
            scrolled
              ? "border-white/10 bg-night/80! shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl"
              : "border-transparent bg-transparent!",
          )}
        >
          <Link
            href="/"
            className="shrink-0"
            aria-label={`${site.name} — accueil`}
          >
            <Logo />
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative isolate block rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300",
                        active
                          ? "text-white"
                          : "nav-underline text-white/75 hover:text-white",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-white/12"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.5,
                          }}
                        />
                      )}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="grid size-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white" />
            <ButtonLink href="/benevoles" wrapperClassName="max-sm:hidden">
              Devenir bénévole
            </ButtonLink>
            <button
              type="button"
              ref={menuButtonRef}
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Ouvrir le menu"
              className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 lg:hidden"
            >
              <Menu aria-hidden className="size-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && <MobileMenu onClose={closeMenu} isActive={isActive} />}
      </AnimatePresence>
    </>
  );
}

function MobileMenu({
  onClose,
  isActive,
}: {
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Verrouille le défilement, place le focus et gère Échap.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Garde le focus dans le menu tant qu'il est ouvert.
  function trapFocus(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])",
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }

  return (
    <motion.div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      onKeyDown={trapFocus}
      initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
      animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
      exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
      transition={{ duration: 0.6, ease }}
      className="tone-night grain fixed inset-0 z-[60] flex flex-col overflow-y-auto"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/4 -right-1/4 size-[80vmax] rounded-full bg-scarlet/25 blur-[120px]"
      />
      <div className="relative flex h-19 items-center justify-between px-6 pt-3">
        <Link href="/" onClick={onClose} aria-label={`${site.name} — accueil`}>
          <Logo />
        </Link>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fermer le menu"
          className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X aria-hidden className="size-5" />
        </button>
      </div>

      <nav aria-label="Navigation mobile" className="relative flex-1 px-6 py-8">
        <ul className="space-y-1">
          {[{ href: "/", label: "Accueil" }, ...navigation].map((item, i) => {
            const active = item.href === "/" ? false : isActive(item.href);
            return (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-baseline gap-4 py-1.5 font-display text-4xl font-extrabold tracking-tight transition-colors sm:text-5xl",
                    active ? "text-scarlet" : "text-white hover:text-gold",
                  )}
                >
                  <span
                    aria-hidden
                    className="font-sans text-xs font-semibold text-white/50 tabular-nums"
                  >
                    0{i + 1}
                  </span>
                  {item.label}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative space-y-5 border-t border-white/10 px-6 py-8"
      >
        <p className="text-sm text-white/70">
          {site.datesLabel} · {site.place}
        </p>
        <div className="flex gap-3">
          {site.socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              aria-label={s.name}
              className="grid size-11 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-scarlet hover:bg-scarlet hover:text-white"
            >
              <SocialIcon name={s.name} />
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
