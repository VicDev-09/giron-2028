/**
 * Programme du Giron 2028.
 *
 * ⚠️ CONTENU PROVISOIRE — horaires, artistes et animations sont des exemples
 * thématiques. Remplacer chaque entrée par le programme officiel.
 */

export const venues = [
  {
    id: "cantine",
    label: "Cantine",
    description: "La grande salle : concerts, loto et souper.",
  },
  {
    id: "tonnelle",
    label: "Tonnelle",
    description: "Le bar à ciel ouvert, cœur battant de la fête.",
  },
  {
    id: "caveau",
    label: "Caveau",
    description: "L'ambiance feutrée : vins, planchettes et musique douce.",
  },
  {
    id: "jeux",
    label: "Jeux enfants",
    description: "L'espace des plus jeunes, animé toute la journée.",
  },
] as const;

export type VenueId = (typeof venues)[number]["id"];

export const days = [
  { id: "jeudi", label: "Jeudi", short: "Jeu", date: "[jj] juillet" },
  { id: "vendredi", label: "Vendredi", short: "Ven", date: "[jj] juillet" },
  { id: "samedi", label: "Samedi", short: "Sam", date: "[jj] juillet" },
  { id: "dimanche", label: "Dimanche", short: "Dim", date: "[jj] juillet" },
] as const;

export type DayId = (typeof days)[number]["id"];

export type EventKind =
  "concert" | "cortege" | "loto" | "souper" | "jeux" | "bar" | "officiel";

export interface ProgrammeEvent {
  id: string;
  day: DayId;
  venue: VenueId;
  start: string;
  end?: string;
  title: string;
  description: string;
  kind: EventKind;
  highlight?: boolean;
}

export const programme: ProgrammeEvent[] = [
  // Jeudi
  {
    id: "jeu-ouverture",
    day: "jeudi",
    venue: "tonnelle",
    start: "18:00",
    title: "Ouverture officielle",
    description: "Coupure du ruban et premier verre de l'amitié.",
    kind: "officiel",
    highlight: true,
  },
  {
    id: "jeu-loto",
    day: "jeudi",
    venue: "cantine",
    start: "20:00",
    end: "23:30",
    title: "Grand loto du Giron",
    description: "Séries royales et lots régionaux — lots à confirmer.",
    kind: "loto",
    highlight: true,
  },
  {
    id: "jeu-caveau",
    day: "jeudi",
    venue: "caveau",
    start: "19:00",
    end: "01:00",
    title: "Caveau des encaveurs",
    description: "Dégustation de vins — encaveurs à confirmer.",
    kind: "bar",
  },

  // Vendredi
  {
    id: "ven-concert-1",
    day: "vendredi",
    venue: "cantine",
    start: "21:00",
    title: "Concert — artiste à confirmer",
    description: "La première grosse soirée du Giron sur la grande scène.",
    kind: "concert",
    highlight: true,
  },
  {
    id: "ven-dj",
    day: "vendredi",
    venue: "tonnelle",
    start: "23:00",
    end: "03:00",
    title: "DJ set — à confirmer",
    description: "Jusqu'au bout de la nuit sous la Tonnelle.",
    kind: "concert",
  },
  {
    id: "ven-caveau",
    day: "vendredi",
    venue: "caveau",
    start: "18:00",
    end: "02:00",
    title: "Apéro du Caveau",
    description: "Planchettes du terroir et vins de la région.",
    kind: "bar",
  },

  // Samedi
  {
    id: "sam-jeux",
    day: "samedi",
    venue: "jeux",
    start: "10:00",
    end: "17:00",
    title: "Village des jeux",
    description: "Château gonflable, maquillage et jeux en bois.",
    kind: "jeux",
  },
  {
    id: "sam-souper",
    day: "samedi",
    venue: "cantine",
    start: "19:00",
    title: "Souper de soutien",
    description: "Menu régional servi à table — inscription à venir.",
    kind: "souper",
    highlight: true,
  },
  {
    id: "sam-concert",
    day: "samedi",
    venue: "cantine",
    start: "22:00",
    title: "Concert — tête d'affiche à confirmer",
    description: "La grande soirée du samedi.",
    kind: "concert",
    highlight: true,
  },
  {
    id: "sam-tonnelle",
    day: "samedi",
    venue: "tonnelle",
    start: "16:00",
    end: "03:00",
    title: "Tonnelle en fête",
    description: "Bar, musique et retrouvailles entre jeunesses.",
    kind: "bar",
  },
  {
    id: "sam-caveau",
    day: "samedi",
    venue: "caveau",
    start: "17:00",
    end: "02:00",
    title: "Caveau — soirée acoustique",
    description: "Musiciens à confirmer.",
    kind: "concert",
  },

  // Dimanche
  {
    id: "dim-cortege",
    day: "dimanche",
    venue: "tonnelle",
    start: "14:00",
    title: "Grand cortège des jeunesses",
    description:
      "Chars, fanfares et groupes costumés à travers le village. Départ et arrivée près de la Tonnelle.",
    kind: "cortege",
    highlight: true,
  },
  {
    id: "dim-jeux",
    day: "dimanche",
    venue: "jeux",
    start: "11:00",
    end: "17:00",
    title: "Jeux enfants & grimage",
    description: "Animations pour les familles tout l'après-midi.",
    kind: "jeux",
  },
  {
    id: "dim-brunch",
    day: "dimanche",
    venue: "cantine",
    start: "10:00",
    end: "13:00",
    title: "Brunch campagnard",
    description: "Pour reprendre des forces avant le cortège.",
    kind: "souper",
  },
  {
    id: "dim-cloture",
    day: "dimanche",
    venue: "tonnelle",
    start: "18:00",
    title: "Clôture & remise du drapeau",
    description: "Passage de témoin à la jeunesse du prochain Giron.",
    kind: "officiel",
  },
];

/** Moments forts présentés sur la page La Fête. */
export const highlights = [
  {
    kind: "concert",
    title: "Concerts",
    text: "Deux grandes soirées sur la scène de la Cantine, et des DJ sous la Tonnelle jusqu'au bout de la nuit.",
    detail: "Artistes à confirmer",
  },
  {
    kind: "cortege",
    title: "Cortège",
    text: "Le dimanche, les jeunesses de toute la Glâne défilent avec chars, fanfares et costumes.",
    detail: "Dimanche après-midi",
  },
  {
    kind: "loto",
    title: "Loto",
    text: "Le grand classique qui remplit la Cantine : séries royales et lots du terroir.",
    detail: "Jeudi soir",
  },
  {
    kind: "souper",
    title: "Souper de soutien",
    text: "Un repas régional à partager, pour soutenir la jeunesse organisatrice.",
    detail: "Samedi soir — inscription à venir",
  },
  {
    kind: "jeux",
    title: "Jeux",
    text: "Un espace dédié aux enfants et aux familles, animé le week-end.",
    detail: "Samedi & dimanche",
  },
] as const satisfies ReadonlyArray<{
  kind: EventKind;
  title: string;
  text: string;
  detail: string;
}>;
