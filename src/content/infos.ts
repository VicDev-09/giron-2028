/**
 * Infos pratiques du Giron 2028.
 *
 * ⚠️ CONTENU PROVISOIRE — les modalités (accès, parking, cashless, camping,
 * navettes) sont des exemples à valider par le comité avant publication.
 */

export const access = [
  {
    mode: "train",
    title: "En train",
    text: "Gare la plus proche : [gare] — puis 10 min à pied, fléchage depuis le quai.",
  },
  {
    mode: "bus",
    title: "En bus",
    text: "Arrêt « [arrêt] », desservi par les lignes régionales. Horaires renforcés pendant le Giron (à confirmer).",
  },
  {
    mode: "car",
    title: "En voiture",
    text: "Sortie autoroute [sortie], puis suivre la signalisation « Giron 2028 ».",
  },
  {
    mode: "bike",
    title: "À vélo",
    text: "Parc à vélos surveillé à l'entrée de la place de fête.",
  },
] as const;

export const parking = [
  "Parkings balisés à proximité de la place de fête (emplacements à confirmer).",
  "Places réservées aux personnes à mobilité réduite près de l'entrée.",
  "Merci de privilégier les transports publics et le covoiturage.",
];

export const cashlessSteps = [
  {
    title: "Recharge",
    text: "Charge ton bracelet ou ta carte aux caisses, en espèces ou par carte (modalités à confirmer).",
  },
  {
    title: "Paie partout",
    text: "Un seul geste à la Cantine, à la Tonnelle, au Caveau et aux stands.",
  },
  {
    title: "Rembourse",
    text: "Le solde non utilisé est remboursable après la fête (procédure à venir).",
  },
];

export const camping = [
  "Zone de camping à proximité de la place de fête (ouverture et tarifs à confirmer).",
  "Sanitaires et points d'eau sur place.",
  "Surveillance nocturne et règlement à respecter.",
];

export const shuttles = [
  {
    title: "Navettes",
    text: "Des navettes relient la place de fête aux gares voisines pendant les soirées (horaires à confirmer).",
  },
  {
    title: "Rapatriement de nuit",
    text: "Des bus de retour desservent les villages de la Glâne après la fermeture (lignes à confirmer).",
  },
];

export const faq = [
  {
    q: "L'entrée est-elle payante ?",
    a: "Les modalités d'entrée seront communiquées prochainement. Certaines soirées pourraient être payantes.",
  },
  {
    q: "Y a-t-il un âge minimum ?",
    a: "La fête est ouverte à tous. La loi sur la protection de la jeunesse s'applique au bar : une pièce d'identité peut être demandée.",
  },
  {
    q: "Peut-on payer en espèces ?",
    a: "Le Giron fonctionne avec un système cashless. Les recharges seront possibles sur place (modalités à confirmer).",
  },
  {
    q: "Les chiens sont-ils admis ?",
    a: "Pour leur bien-être, les animaux ne sont pas admis sur la place de fête en soirée (règlement à confirmer).",
  },
  {
    q: "Où trouver les objets perdus ?",
    a: "Au stand d'accueil pendant la fête, puis auprès de la jeunesse organisatrice via la page Contact.",
  },
  {
    q: "Comment devenir bénévole ?",
    a: "Rendez-vous sur la page Bénévoles pour découvrir les missions et t'annoncer.",
  },
];
