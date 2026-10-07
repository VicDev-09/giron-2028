/**
 * Récit du Giron, jour après jour (section scrollytelling de /la-fete).
 * Les moments affichés sont les événements `highlight` de programme.ts ;
 * ce fichier ne fournit que le fil narratif de chaque journée.
 *
 * ⚠️ CONTENU PROVISOIRE — accroches thématiques à relire et remplacer.
 */
import type { DayId } from "./programme";

export const recitIntro = {
  eyebrow: "Le récit",
  title: "Le Giron, jour après jour",
  text: "Du premier verre au passage du drapeau : fais défiler les quatre jours qui vont faire vibrer la Glâne.",
} as const;

export const recitDays: Record<DayId, { kicker: string; text: string }> = {
  jeudi: {
    kicker: "Le coup d'envoi",
    text: "La place s'allume, les jeunesses arrivent : le Giron est lancé.",
  },
  vendredi: {
    kicker: "La première grande nuit",
    text: "La Cantine se remplit pour le premier concert, la Tonnelle prend le relais.",
  },
  samedi: {
    kicker: "Le grand samedi",
    text: "Souper, tête d'affiche et fête jusqu'au petit matin.",
  },
  dimanche: {
    kicker: "Le jour du cortège",
    text: "Chars, fanfares et costumes traversent le village avant le passage du drapeau.",
  },
};
