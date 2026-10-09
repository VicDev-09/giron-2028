import { DoubleDecker } from "@/components/ui/london/DoubleDecker";

/**
 * Bus rouge à impériale qui balaie l'écran lors d'un changement de thème.
 * Invisible au repos ; piloté par `driveThemeBus` (ThemeToggle).
 */
export function ThemeBus() {
  return (
    <div id="theme-bus" aria-hidden className="theme-bus">
      <DoubleDecker className="h-full w-auto drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]" />
    </div>
  );
}

const DURATION = 1000;

/**
 * Bascule de thème « signature » : le bus traverse l'écran et dévoile le
 * nouveau thème derrière lui.
 *  - View Transitions API : le bus a son propre `view-transition-name` ; le
 *    navigateur le fait glisser d'un bord à l'autre (transform, compositeur)
 *    pendant que le nouveau thème se révèle par un balayage synchronisé,
 *    toujours caché sous la carrosserie (globals.css).
 *  - Sans l'API : le bus traverse en CSS et le thème change à mi-parcours.
 *  - Mouvement réduit (ou bus absent) : bascule instantanée.
 */
export function driveThemeBus(update: () => void) {
  const root = document.documentElement;
  const bus = document.getElementById("theme-bus");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !bus || root.classList.contains("theme-bus-run")) {
    update();
    return;
  }

  root.classList.add("theme-bus-run");
  bus.dataset.pos = "start";
  const finish = () => {
    delete bus.dataset.pos;
    root.classList.remove("theme-bus-run");
  };

  if (typeof document.startViewTransition === "function") {
    const transition = document.startViewTransition(() => {
      update();
      bus.dataset.pos = "end";
    });
    transition.finished.finally(finish);
    return;
  }

  // Repli : traversée CSS, thème changé quand le bus couvre le milieu
  void bus.offsetWidth;
  bus.dataset.pos = "drive";
  window.setTimeout(update, DURATION * 0.45);
  window.setTimeout(finish, DURATION + 50);
}
