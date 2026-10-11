/**
 * Boutique — page VITRINE (démo d'expérience, pas d'e-commerce).
 *
 * ⚠️ CONTENU PROVISOIRE — aucun produit pour l'instant : la page s'affiche
 * dans son état « Produit à venir ». Aucun panier, prix, paiement ni
 * traitement serveur.
 *
 * Ajouter un produit : une entrée dans `products` suffit. Par exemple, pour
 * une séquence 360° (images dans /public/boutique/<produit>/) :
 *   {
 *     id: "t-shirt",
 *     name: "T-shirt Giron 2028",
 *     subtitle: "Coton bio — édition officielle",
 *     source: {
 *       kind: "sequence",
 *       frames: Array.from({ length: 36 }, (_, i) =>
 *         `/boutique/t-shirt/spin_${String(i).padStart(2, "0")}.png`),
 *       poster: "/boutique/t-shirt/poster.png",
 *     },
 *     detailImage: "/boutique/t-shirt/spin_00.png",
 *     detailFocus: { x: 0.5, y: 0.4 },
 *     specs: [{ label: "Matière", value: "…" }],
 *     description: "…",
 *   }
 * ou, plus tard, `source: { kind: "model", src: "/boutique/t-shirt.glb" }`.
 */
import type { ProductSource } from "@/components/boutique/ProductStage";

export interface BoutiqueProduct {
  id: string;
  name: string;
  subtitle: string;
  source: ProductSource;
  /** Image nette pour le gros plan, et point de zoom (0–1) */
  detailImage?: string;
  detailFocus?: { x: number; y: number };
  specs: ReadonlyArray<{ label: string; value: string }>;
  description: string;
}

/** Produits de la boutique — vide tant qu'aucun article n'est prêt. */
export const products: readonly BoutiqueProduct[] = [];

export const boutique = {
  eyebrow: "Boutique · Bientôt",

  /** Textes de l'état « aucun produit » */
  upcomingProduct: {
    name: "Produit à venir",
    subtitle: "Les premiers articles de l'édition arrivent bientôt.",
  },

  /** Emplacements « Bientôt » du sélecteur (icônes lucide) */
  upcoming: [
    { id: "tshirt", label: "T-shirt", icon: "shirt" },
    { id: "gourde", label: "Gourde", icon: "bottle" },
  ],

  presentation: {
    eyebrow: "Édition 2028",
    title: "Produit à venir",
    text: "Les premiers articles de l'édition arrivent bientôt. Ils seront présentés ici, sous tous les angles.",
  },

  detail: {
    eyebrow: "La finition",
    title: "Le détail qui compte",
    text: "Matières, broderies et finitions seront dévoilées avec les premiers articles.",
  },

  closing: {
    title: "Sois le premier informé",
    text: "Laisse-nous un mot : on te prévient dès l'ouverture de la boutique.",
    cta: "M'avertir au lancement",
    note: "Produits, tailles et prix à venir.",
  },
} as const;
