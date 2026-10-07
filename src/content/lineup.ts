/**
 * Affiche (lineup) du Giron 2028.
 *
 * ⚠️ CONTENU PROVISOIRE — aucun artiste n'est confirmé. Tous les noms
 * ci-dessous sont des emplacements neutres : remplacer `name` par l'artiste
 * officiel dès l'annonce (et retirer `note` une fois confirmé).
 */
import type { DayId, VenueId } from "./programme";

export interface LineupAct {
  name: string;
  /** Mention secondaire, ex. « à confirmer » */
  note?: string;
}

/** Les deux grandes soirées de la Cantine. */
export const lineupNights: ReadonlyArray<{
  day: DayId;
  venue: VenueId;
  time: string;
  headliner: LineupAct;
  support: LineupAct[];
}> = [
  {
    day: "vendredi",
    venue: "cantine",
    time: "21:00",
    headliner: { name: "Tête d'affiche", note: "à confirmer" },
    support: [
      { name: "Artiste 1" },
      { name: "Artiste 2" },
      { name: "Artiste 3" },
    ],
  },
  {
    day: "samedi",
    venue: "cantine",
    time: "22:00",
    headliner: { name: "Tête d'affiche", note: "à confirmer" },
    support: [
      { name: "Artiste 4" },
      { name: "Artiste 5" },
      { name: "Artiste 6" },
    ],
  },
];

/** Scènes secondaires. */
export const lineupStages: ReadonlyArray<{
  venue: VenueId;
  label: string;
  acts: LineupAct[];
}> = [
  {
    venue: "tonnelle",
    label: "Sous la Tonnelle",
    acts: [
      { name: "DJ 1" },
      { name: "DJ 2" },
      { name: "DJ 3" },
      { name: "DJ 4" },
    ],
  },
  {
    venue: "caveau",
    label: "Au Caveau",
    acts: [
      { name: "Duo acoustique", note: "à confirmer" },
      { name: "Artiste 7" },
    ],
  },
];

/** « Et aussi » — moments forts hors concerts. */
export const lineupExtras = [
  "Grand loto",
  "Cortège des jeunesses",
  "Souper de soutien",
  "Fanfares",
  "Village des jeux",
] as const;

export const lineupNote =
  "Programmation en cours — premières annonces bientôt sur nos réseaux.";
