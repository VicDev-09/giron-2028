/**
 * Boutique — page VITRINE (démo d'expérience, pas d'e-commerce).
 *
 * ⚠️ CONTENU PROVISOIRE — aucun produit, taille, prix ni stock réel. Un seul
 * produit test, aucun panier ni paiement, aucun traitement serveur.
 * Textes et caractéristiques ci-dessous : placeholders à remplacer.
 */
import type { ProductSource } from "@/components/boutique/ProductStage";

/** Séquence 360° : 36 images (une tous les 10°), fond transparent. */
const capFrames = Array.from(
  { length: 36 },
  (_, i) => `/boutique/spin/cap_${String(i).padStart(2, "0")}.png`,
);

export const boutique = {
  eyebrow: "Boutique · Bientôt",

  product: {
    id: "casquette",
    name: "Casquette Giron",
    subtitle: "Brodée, ajustable — édition test",
    source: {
      kind: "sequence",
      frames: capFrames,
      poster: "/boutique/cap-poster.png",
    } satisfies ProductSource,
    /** Frame nette utilisée pour le gros plan (cap_00) */
    detailFrame: capFrames[0],
    specs: [
      { label: "Matière", value: "Coton sergé épais" },
      { label: "Taille", value: "Unique, ajustable" },
      { label: "Édition", value: "Made for Giron 2028" },
    ],
    description:
      "La casquette officielle de l'édition : visière courbée, logo brodé et fermeture réglable. Pour le soleil de juillet comme pour les nuits sous la Tonnelle.",
  },

  /** Emplacements « Bientôt » du sélecteur (icônes lucide) */
  upcoming: [
    { id: "tshirt", label: "T-shirt", icon: "shirt" },
    { id: "gourde", label: "Gourde", icon: "bottle" },
  ],

  detail: {
    eyebrow: "La finition",
    title: "Brodé à la main",
    text: "Logo en broderie dense, coutures renforcées et intérieur doublé. Détails de fabrication définitifs à confirmer.",
  },

  closing: {
    title: "Sois le premier informé",
    text: "Laisse-nous un mot : on te prévient dès l'ouverture de la boutique.",
    cta: "M'avertir au lancement",
    note: "Produits, tailles et prix à venir.",
  },
} as const;
