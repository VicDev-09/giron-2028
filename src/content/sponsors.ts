/**
 * Partenaires du Giron 2028.
 *
 * ⚠️ CONTENU PROVISOIRE — aucun partenaire n'est encore confirmé. Les entrées
 * ci-dessous sont des emplacements neutres à remplacer (nom, logo, lien).
 */

export type SponsorTier = "or" | "argent" | "bronze";

export interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  href?: string;
  /** Chemin d'un logo dans /public, ex. "/sponsors/entreprise.svg" */
  logo?: string;
}

export const tiers: ReadonlyArray<{
  id: SponsorTier;
  label: string;
  perks: string[];
}> = [
  {
    id: "or",
    label: "Or",
    perks: [
      "Logo en grand sur le site et les affiches",
      "Visibilité sur la scène principale",
      "Invitations au souper de soutien",
    ],
  },
  {
    id: "argent",
    label: "Argent",
    perks: [
      "Logo sur le site et le programme",
      "Banderole sur la place de fête",
      "Invitations à la soirée d'ouverture",
    ],
  },
  {
    id: "bronze",
    label: "Bronze",
    perks: ["Logo sur le site", "Mention sur les réseaux sociaux"],
  },
];

function placeholders(tier: SponsorTier, label: string, count: number) {
  return Array.from({ length: count }, (_, i): Sponsor => ({
    id: `${tier}-${i + 1}`,
    name: `Sponsor ${label} ${i + 1}`,
    tier,
  }));
}

export const sponsors: Sponsor[] = [
  ...placeholders("or", "Or", 3),
  ...placeholders("argent", "Argent", 6),
  ...placeholders("bronze", "Bronze", 12),
];
