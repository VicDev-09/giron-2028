/**
 * Informations générales du Giron 2028.
 *
 * ⚠️ CONTENU PROVISOIRE — les dates, le lieu et les contacts officiels ne sont
 * pas encore connus. Toutes les valeurs entre crochets [ ] et celles marquées
 * PLACEHOLDER sont à remplacer dès que l'information est confirmée.
 */

export const site = {
  name: "Giron 2028",
  fullName: "Giron des jeunesses glânoises 2028",
  organizer: "Jeunesse de [commune]",
  tagline: "Quatre jours de fête au cœur de la Glâne.",
  description:
    "Site officiel du Giron glânois 2028 : programme, infos pratiques, bénévoles et partenaires.",

  // PLACEHOLDER — lieu exact à confirmer
  place: "Place de fête, [commune]",
  region: "Glâne · Fribourg",

  // PLACEHOLDER — dates exactes à confirmer
  datesLabel: "Juillet 2028",
  // Date utilisée par le compte à rebours (heure suisse). PLACEHOLDER.
  startsAt: "2028-07-13T18:00:00+02:00",

  // PLACEHOLDER — objectif de bénévoles à confirmer par le comité
  volunteersGoal: 400,

  // PLACEHOLDER — adresse e-mail fictive (domaine réservé .example)
  email: "contact@giron2028.example",
  volunteersEmail: "benevoles@giron2028.example",
  sponsorsEmail: "sponsors@giron2028.example",

  // PLACEHOLDER — liens des réseaux à renseigner
  socials: [
    { name: "Instagram", href: "#", handle: "@giron2028" },
    { name: "Facebook", href: "#", handle: "Giron 2028" },
    { name: "TikTok", href: "#", handle: "@giron2028" },
  ],

  /**
   * Média de fond du héros d'accueil. Laisser vide pour la scène animée
   * générée (collines de la Glâne + guirlandes). Pour une vraie vidéo ou photo,
   * déposer le fichier dans /public et renseigner le chemin ici.
   */
  heroMedia: {
    video: "" as string, // ex. "/media/hero.mp4"
    image: "" as string, // ex. "/media/hero.jpg" (sert aussi de poster)
  },
} as const;

export type SocialName = (typeof site.socials)[number]["name"];

export const navigation = [
  { href: "/la-fete", label: "La Fête" },
  { href: "/infos-pratiques", label: "Infos pratiques" },
  { href: "/la-jeunesse", label: "La Jeunesse" },
  { href: "/benevoles", label: "Bénévoles" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/contact", label: "Contact" },
] as const;
