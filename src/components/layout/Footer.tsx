import { CalendarDays, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { TreasureTapTrigger } from "@/components/treasure/TreasureTrigger";
import { navigation, site } from "@/content/site";
import { Container } from "@/components/ui/Section";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="tone-night grain mesh relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-1/2 left-1/2 size-[70vmax] -translate-x-1/2 rounded-full bg-plum-2/60 blur-[140px]"
      />

      <Container className="relative z-10 pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo className="text-2xl" />
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-muted">
              {site.fullName}. {site.tagline}
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <CalendarDays aria-hidden className="size-4 text-amber" />
                {site.datesLabel}
              </li>
              <li className="flex items-center gap-3">
                <MapPin aria-hidden className="size-4 text-amber" />
                {site.place}
              </li>
              <li className="flex items-center gap-3">
                <Mail aria-hidden className="size-4 text-amber" />
                <a
                  href={`mailto:${site.email}`}
                  className="underline-offset-4 hover:text-amber hover:underline"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Pied de page" className="lg:col-span-3">
            <h2 className="eyebrow text-white/60">Explorer</h2>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block text-white/85 transition-[color,transform] duration-300 hover:translate-x-1 hover:text-coral"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="eyebrow text-white/60">Suivre l&apos;aventure</h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {site.socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    className="group flex items-center gap-3 rounded-full border border-white/15 py-2 pr-5 pl-2 text-sm transition-colors hover:border-coral hover:bg-coral hover:text-night"
                  >
                    <span className="grid size-9 place-items-center rounded-full bg-white/10 transition-colors group-hover:bg-night/15">
                      <SocialIcon name={s.name} className="size-4" />
                    </span>
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Entrée cachée de la chasse au trésor : toucher 5 fois */}
        <TreasureTapTrigger className="display-xl mt-20 bg-gradient-to-b from-white/15 to-white/0 bg-clip-text text-[22vw] text-transparent select-none lg:text-[17rem]">
          Giron 28
        </TreasureTapTrigger>

        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2028 {site.organizer}. Contenu provisoire — informations
            officielles à venir.
          </p>
          <p>Mentions légales et protection des données : à venir.</p>
          <p className="flex items-center gap-4">
            <a href="#top" className="hover:text-white">
              Retour en haut ↑
            </a>
            {/* Lien très discret vers la chasse au trésor */}
            <Link
              href="/chasse"
              aria-label="Carnet secret"
              className="text-white/25 transition-colors hover:text-amber"
            >
              ✦
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
