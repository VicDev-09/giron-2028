"use client";

import { AnimatePresence, motion } from "framer-motion";
// Contexte interne de Next : nécessaire pour « figer » la page sortante
// pendant son animation de sortie (sinon elle afficherait déjà la nouvelle).
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";
import {
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const noop = () => () => {};
/** Faux pendant le rendu serveur et l'hydratation, vrai ensuite. */
const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

/** Conserve le contexte de routage tel qu'il était au montage. */
function FrozenRouter({ children }: { children: ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const [frozen] = useState(context);
  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

/**
 * Fondu + léger glissement/zoom entre les routes. En mouvement réduit,
 * MotionProvider ne conserve que le fondu.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hydrated = useHydrated();

  return (
    // Pas de `initial={false}` ici : AnimatePresence le propagerait à TOUS
    // les descendants et désactiverait les révélations au scroll de la page.
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        // Premier chargement : page visible telle que rendue par le serveur ;
        // les navigations suivantes jouent l'entrée.
        initial={hydrated ? { opacity: 0, y: 14, scale: 0.995 } : false}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.42, ease },
        }}
        exit={{
          opacity: 0,
          y: -8,
          transition: { duration: 0.18, ease: "easeIn" },
        }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}
