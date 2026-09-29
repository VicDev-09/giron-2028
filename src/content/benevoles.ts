/**
 * Appel à bénévoles.
 *
 * ⚠️ CONTENU PROVISOIRE — avantages et missions à valider par le comité.
 */

export const perks = [
  {
    id: "repas",
    title: "Repas & boissons",
    text: "Pendant chacun de tes services (modalités à confirmer).",
  },
  {
    id: "tshirt",
    title: "Le t-shirt officiel",
    text: "Celui que tout le monde voudra avoir à la fin du Giron.",
  },
  {
    id: "soiree",
    title: "Soirée des bénévoles",
    text: "Une fête rien que pour vous, pour dire merci.",
  },
  {
    id: "equipe",
    title: "Une équipe soudée",
    text: "Des rencontres avec les jeunesses de toute la Glâne.",
  },
] as const;

export const missions = [
  "Bar & Tonnelle",
  "Cantine & service",
  "Caveau",
  "Caisse & cashless",
  "Montage & démontage",
  "Sécurité & accueil",
  "Jeux enfants",
  "Nettoyage",
] as const;

export const steps = [
  {
    title: "Annonce-toi",
    text: "Remplis le formulaire avec tes disponibilités et tes envies.",
  },
  {
    title: "Choisis tes missions",
    text: "On te recontacte pour te proposer des tranches horaires.",
  },
  {
    title: "Vis le Giron de l'intérieur",
    text: "Briefing, t-shirt, et c'est parti !",
  },
];
