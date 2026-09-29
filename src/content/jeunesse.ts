/**
 * La jeunesse organisatrice, le comité et les commissions.
 *
 * ⚠️ CONTENU PROVISOIRE — aucun nom réel n'est publié tant que le comité ne
 * l'a pas validé. Remplacer « Nom à confirmer » par les vrais membres.
 */

export const committee = [
  { role: "Président·e" },
  { role: "Vice-président·e" },
  { role: "Caissier·ère" },
  { role: "Secrétaire" },
  { role: "Responsable constructions" },
  { role: "Responsable sponsoring" },
  { role: "Responsable communication" },
  { role: "Responsable bénévoles" },
].map((m) => ({ ...m, name: "Nom à confirmer" }));

export const commissions = [
  {
    id: "constructions",
    title: "Constructions",
    text: "Monte la Cantine, la Tonnelle, le Caveau et toute la place de fête.",
  },
  {
    id: "animations",
    title: "Animations",
    text: "Concerts, loto, cortège et jeux : c'est elle qui fait vibrer le programme.",
  },
  {
    id: "subsistance",
    title: "Subsistance",
    text: "Cuisine, bars et ravitaillement pour des milliers de visiteurs.",
  },
  {
    id: "finances",
    title: "Finances & sponsoring",
    text: "Budget, partenaires et système cashless.",
  },
  {
    id: "communication",
    title: "Communication",
    text: "Site, réseaux sociaux, affiches et relations presse.",
  },
  {
    id: "securite",
    title: "Sécurité & logistique",
    text: "Accès, parkings, navettes, secours et prévention.",
  },
] as const;

export type CommissionId = (typeof commissions)[number]["id"];
