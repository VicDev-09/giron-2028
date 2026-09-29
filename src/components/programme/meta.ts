import {
  Beer,
  Flag,
  Music,
  Puzzle,
  Sparkles,
  Ticket,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { EventKind, VenueId } from "@/content/programme";

export const kindIcons: Record<EventKind, LucideIcon> = {
  concert: Music,
  cortege: Flag,
  loto: Ticket,
  souper: UtensilsCrossed,
  jeux: Puzzle,
  bar: Beer,
  officiel: Sparkles,
};

export const kindLabels: Record<EventKind, string> = {
  concert: "Concert",
  cortege: "Cortège",
  loto: "Loto",
  souper: "Repas",
  jeux: "Jeux",
  bar: "Bar",
  officiel: "Officiel",
};

/** Classes de couleur par lieu (tokens définis dans globals.css). */
export const venueStyles: Record<
  VenueId,
  { dot: string; bar: string; soft: string; glow: string }
> = {
  cantine: {
    dot: "bg-cantine",
    bar: "from-cantine",
    soft: "bg-cantine/15",
    glow: "rgba(255, 90, 54, 0.22)",
  },
  tonnelle: {
    dot: "bg-tonnelle",
    bar: "from-tonnelle",
    soft: "bg-tonnelle/20",
    glow: "rgba(255, 178, 62, 0.25)",
  },
  caveau: {
    dot: "bg-caveau",
    bar: "from-caveau",
    soft: "bg-caveau/15",
    glow: "rgba(181, 92, 255, 0.22)",
  },
  jeux: {
    dot: "bg-jeux",
    bar: "from-jeux",
    soft: "bg-jeux/15",
    glow: "rgba(47, 212, 165, 0.22)",
  },
};
