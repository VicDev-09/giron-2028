"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const listeners = new Set<() => void>();
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

function subscribe(callback: () => void) {
  listeners.add(callback);
  const m = media();
  m.addEventListener("change", callback);
  return () => {
    listeners.delete(callback);
    m.removeEventListener("change", callback);
  };
}

function getTheme(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return media().matches ? "dark" : "light";
}

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Stockage indisponible (navigation privée…) : le choix vaut pour la session.
  }
  listeners.forEach((l) => l());
}

/**
 * Script inline exécuté avant le rendu pour appliquer le thème mémorisé
 * sans flash. Sans choix explicite, le thème du système s'applique via CSS.
 */
export const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => null);
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={
        theme === null
          ? "Changer de thème"
          : `Passer au thème ${next === "dark" ? "sombre" : "clair"}`
      }
      className={className}
    >
      {theme === "dark" ? (
        <Sun aria-hidden className="size-5" />
      ) : (
        <Moon aria-hidden className="size-5" />
      )}
    </button>
  );
}
