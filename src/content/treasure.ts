/**
 * La Chasse au Trésor du Giron 2028 — CONFIGURATION UNIQUE.
 *
 * Tout ce que le comité peut modifier se trouve ici : textes, ordre des
 * étapes, emplacement des indices, valeurs chiffrées et lot.
 *
 * ── Les deux types d'étapes ──────────────────────────────────────────────
 *  • "indice" : un élément discret caché sur une page (`page`). Il n'apparaît
 *    QUE pour un joueur dont c'est l'étape en cours. Le placer avec
 *    <TreasureHint step="<id>" /> dans la page voulue.
 *  • "enigme" : une question ; le joueur répond dans le carnet (/chasse).
 *    Les réponses sont normalisées (minuscules, sans accents, sans article,
 *    pluriel simple retiré) : « La Glâne » = « glane ».
 *
 * ── Modifier une réponse, un jeton ou un fragment ────────────────────────
 *  Les réponses et le code final ne figurent JAMAIS en clair ici : seulement
 *  des hash SHA-256 (`check`) et des fragments chiffrés (`fragment`).
 *  1. Copier treasure.secrets.example.json → treasure.secrets.json
 *     (ignoré par git) et y saisir, dans l'ordre : id, type, secret
 *     (réponse ou jeton) et fragment (morceau du code final).
 *  2. npm run treasure:generate
 *  3. Recopier ci-dessous les `check`, `fragment` et `finalCodeHash` affichés.
 *  ⚠️ Les clés sont chaînées : changer une étape impose de régénérer toutes
 *  les étapes suivantes (le script le fait d'un coup).
 *  Les jetons des indices (`token`) restent en clair : sans les réponses des
 *  énigmes précédentes, ils ne permettent de rien déchiffrer.
 *
 * ⚠️ CONTENU PROVISOIRE — textes, lot et lieu de remise à valider.
 */

export type TreasureStepType = "indice" | "enigme";

export interface TreasureStep {
  id: string;
  type: TreasureStepType;
  /** Titre affiché dans le carnet une fois l'étape atteinte */
  title: string;
  /** Texte de l'étape : piste vers l'indice caché, ou énoncé de l'énigme */
  clue: string;
  /** Indice : page où l'élément est caché (référence pour le comité) */
  page?: string;
  /** Indice : jeton porté par l'élément caché */
  token?: string;
  /** Icône de l'élément caché */
  glyph?: "etoile" | "lanterne" | "trefle";
  /** Message affiché quand l'étape est résolue */
  success: string;
  /** SHA-256("ok|" + clé de chaîne) — généré */
  check: string;
  /** Fragment du code final, chiffré — généré */
  fragment: string;
}

export interface TreasureConfig {
  title: string;
  intro: string;
  rules: string[];
  prize: string;
  claim: string;
  /** Découpage du code final à l'affichage, ex. [4, 4, 4] */
  codeGroups: number[];
  /** SHA-256("final|" + code) — généré */
  finalCodeHash: string;
  steps: TreasureStep[];
}

export const treasure: TreasureConfig = {
  title: "La Chasse au Trésor du Giron 2028",
  intro:
    "Six fragments d'un code secret sont dispersés sur ce site. Certains se cachent dans les pages, d'autres se méritent en résolvant des énigmes. Chaque étape ouvre la suivante : rassemble-les tous pour révéler le code du trésor.",
  rules: [
    "Les étapes se débloquent dans l'ordre : impossible de sauter à la fin.",
    "Les indices cachés n'apparaissent que lorsque c'est leur tour : lis bien la piste du carnet.",
    "Ta progression est enregistrée dans ce navigateur.",
    "Le premier ou la première à présenter le code complet au Giron remporte le trésor.",
  ],
  // PLACEHOLDER — lot et lieu de remise à confirmer par le comité
  prize: "Un lot surprise de la jeunesse organisatrice",
  claim:
    "Présente ce code (et cette page) au stand d'accueil pendant le Giron. Le premier code présenté remporte le trésor.",

  /** Le code final est découpé ainsi à l'affichage : XXXX-XXXX-XXXX */
  codeGroups: [4, 4, 4],
  finalCodeHash:
    "dcd152d689ac05bf2df9661cfc0a43d066c63836c637d7f687dc47e50cb46602",

  steps: [
    {
      id: "etoile",
      type: "indice",
      title: "L'étoile égarée",
      clue: "Le premier fragment est tombé du ciel. Sur la page d'accueil, au-dessus des collines de la Glâne, une étoile brille d'un éclat qui n'est pas le sien. Trouve-la et effleure-la.",
      page: "/",
      token: "astre-egare-150a79",
      glyph: "etoile",
      success: "L'étoile s'éteint doucement et te laisse un premier fragment.",
      check: "d8c5f8150ce9aa24d5c96cc07932747900bf5c57567d5f47653076f3c927512c",
      fragment: "612e",
    },
    {
      id: "charade",
      type: "enigme",
      title: "La charade du bar",
      clue: "Mon premier pèse mille kilos. Mon second est un pronom féminin. Mon tout est le bar à ciel ouvert, cœur battant de la fête. Qui suis-je ?",
      success: "Santé ! Le bar à ciel ouvert te livre le deuxième fragment.",
      check: "7b917ad41f2e68ab83f5c5847215ef4424fc9fe8bde0e4261cc9061a6fa1ac61",
      fragment: "1df4",
    },
    {
      id: "lanterne",
      type: "indice",
      title: "La lanterne oubliée",
      clue: "Le jour où les chars défilent, quelqu'un a oublié sa lanterne au fil du récit de la fête. Remonte l'histoire jusqu'à ce jour-là.",
      page: "/la-fete",
      token: "lanterne-du-cortege-17fabd",
      glyph: "lanterne",
      success:
        "La lanterne s'allume : un troisième fragment brille à l'intérieur.",
      check: "b1c52c4bc7800dc94accfb4726da23cda71950dd61361a9e4c4361b7f4ccc13b",
      fragment: "edee",
    },
    {
      id: "drapeau",
      type: "enigme",
      title: "Ce qui voyage",
      clue: "On me hisse au premier jour, on me transmet au dernier. De jeunesse en jeunesse, je voyage de Giron en Giron. Qui suis-je ?",
      success: "Hissé haut ! Le quatrième fragment flotte au vent.",
      check: "0f108a2876d7b9ba56105c78abdec11bbda6f6fa6c217c18a7ac66976c352110",
      fragment: "1bf7",
    },
    {
      id: "trefle",
      type: "indice",
      title: "Le porte-bonheur",
      clue: "Sur le plan de la place de fête, entre les vélos et les tentes du camping, un trèfle porte-bonheur a poussé dans l'herbe.",
      page: "/infos-pratiques",
      token: "trefle-a-quatre-020891",
      glyph: "trefle",
      success:
        "Un trèfle à quatre feuilles ! Le cinquième fragment était caché dessous.",
      check: "1c0204a918da28a4524601dd76103f304e9214087554f1d2849947aea0189c4f",
      fragment: "66f8",
    },
    {
      id: "riviere",
      type: "enigme",
      title: "L'énigme finale",
      clue: "Je suis à la fois une rivière et un district. Romont est mon chef-lieu, et je donne mon nom à toutes les jeunesses de ce Giron. Qui suis-je ?",
      success: "Le dernier fragment est à toi. Le trésor t'attend !",
      check: "e58f213db25eb1a45b36cbe71053c3afd03c0ebd8617d3bfedebfbc4105ca3ba",
      fragment: "cb1e",
    },
  ],
};
