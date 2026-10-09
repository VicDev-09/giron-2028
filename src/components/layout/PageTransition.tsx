"use client";

import { AnimatePresence, motion } from "framer-motion";
// Contexte interne de Next : nécessaire pour « figer » la page sortante
// pendant son animation de sortie (sinon elle afficherait déjà la nouvelle).
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";
import {
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { appState, TubeAnnounce } from "./TubeAnnounce";

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
 * Transition « métro londonien » entre les routes : la page part vers la
 * gauche comme une rame, la suivante arrive de la droite, avec l'annonce
 * « Prochain arrêt — Mind the gap ». En mouvement réduit, MotionProvider ne
 * conserve que le fondu et l'annonce est masquée.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hydrated = useHydrated();

  useEffect(() => {
    appState.hydrated = true;
  }, []);

  return (
    // Pas de `initial={false}` ici : AnimatePresence le propagerait à TOUS
    // les descendants et désactiverait les révélations au scroll de la page.
    <>
      <TubeAnnounce key={pathname} pathname={pathname} />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          // Premier chargement : page visible telle que rendue par le serveur ;
          // les navigations suivantes jouent l'entrée.
          initial={hydrated ? { opacity: 0, x: 56 } : false}
          animate={{
            opacity: 1,
            x: 0,
            transition: { duration: 0.45, ease },
          }}
          exit={{
            opacity: 0,
            x: -56,
            transition: { duration: 0.22, ease: [0.55, 0, 1, 0.45] },
          }}
        >
          <FrozenRouter>{children}</FrozenRouter>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
