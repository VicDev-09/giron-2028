/**
 * Boutique — page VITRINE (démo d'expérience, pas d'e-commerce).
 *
 * ⚠️ CONTENU PROVISOIRE — aucun produit, prix ni stock réel. Un seul produit
 * test, aucun panier ni paiement, aucun traitement serveur.
 */
import type { ProductSource } from "@/components/boutique/ProductStage";

export const boutique = {
  eyebrow: "Boutique · Bientôt",
  title: "La collection",
  intro:
    "Les couleurs du Giron, à porter bien après la fête. Un avant-goût de la future collection officielle.",

  product: {
    name: "T-shirt Giron 2028",
    tagline: "Édition test",
    /**
     * Visuel du produit. Aujourd'hui : une image PNG détourée.
     * Demain : une séquence d'images pour un vrai 360°, par exemple
     *   { kind: "sequence", frames: ["/boutique/spin/01.webp", …], alt }
     * Voir ProductStage (point d'extension documenté).
     */
    source: {
      kind: "image",
      src: "/boutique/tshirt-test.png",
      alt: "T-shirt Giron 2028, modèle test",
    } satisfies ProductSource,
    /** Position du logo dans le visuel (0–1), pour le gros plan */
    logoFocus: { x: 0.5, y: 0.34 },
  },

  story: [
    {
      title: "Pensé pour la fête",
      text: "Une coupe ample et un coton épais qui tient du premier verre au passage du drapeau.",
    },
    {
      title: "Signé Giron 2028",
      text: "Le logo de l'édition, imprimé sur le cœur, aux couleurs de la Nuit britannique.",
    },
    {
      title: "Fait pour durer",
      text: "Un souvenir à porter longtemps après la fête — et à ressortir au prochain Giron.",
    },
  ],

  detail: {
    eyebrow: "Le détail",
    title: "Sérigraphié avec soin",
    text: "Encres à l'eau, tirage en petite série, coton biologique épais. Caractéristiques définitives à confirmer.",
  },

  /** Teintes d'ambiance de la démo (tokens de marque) */
  variants: [
    { id: "nuit", label: "Nuit marine", color: "var(--brand-royal)" },
    { id: "rouge", label: "Rouge Londres", color: "var(--brand-scarlet)" },
    { id: "or", label: "Or royal", color: "var(--brand-gold)" },
  ],

  closing: {
    title: "Sois le premier informé",
    text: "Laisse-nous un mot : on te prévient dès l'ouverture de la boutique.",
    cta: "M'avertir au lancement",
    note: "Produits et prix à venir.",
  },
} as const;
