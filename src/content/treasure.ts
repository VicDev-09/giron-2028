/**
 * La Chasse au Trésor du Giron 2028 — CONFIGURATION UNIQUE.
 *
 * Tout ce que le comité peut modifier se trouve ici : textes, ordre des
 * étapes, valeurs chiffrées, fausses pistes et lot.
 *
 * ── Philosophie ──────────────────────────────────────────────────────────
 *  Difficile et lente : le carnet ne donne QUE l'énoncé cryptique de l'étape
 *  en cours (jamais la page ni la cachette). Chaque énoncé ne se dévoile
 *  qu'après avoir résolu la précédente. Les fausses pistes (`decoys`)
 *  affichent « Fausse piste » sans faire progresser.
 *  ⚠️ Les emplacements des cachettes sont décrits UNIQUEMENT dans les
 *  commentaires ci-dessous (retirés du site publié) : ne jamais les mettre
 *  dans un texte affiché.
 *
 * ── Les deux types d'étapes ──────────────────────────────────────────────
 *  • "enigme" : le joueur répond dans le carnet (/chasse). Les réponses sont
 *    normalisées : minuscules, sans accents, sans article initial, pluriel
 *    simple retiré, chiffres recollés (« La Glâne » = « glane »,
 *    « 2'052 » = « 2052 »).
 *  • "indice" : une cachette sur le site. Le composant de la cachette
 *    construit un « secret » à partir de l'interaction du joueur (nombre de
 *    coups, séquence, choix…) ; seul le bon secret valide l'étape. Le
 *    format de chaque secret est indiqué en commentaire de l'étape.
 *
 * ── Remplacer une énigme, un secret, un fragment ou une fausse piste ─────
 *  Réponses et code final ne figurent JAMAIS en clair ici : seulement des
 *  hash SHA-256 (`check`, `decoys`) et des fragments chiffrés (`fragment`).
 *  1. Copier treasure.secrets.example.json → treasure.secrets.json
 *     (ignoré par git) ; y saisir, DANS L'ORDRE : id, type, secret (réponse
 *     ou secret de cachette), fragment (morceau du code), decoys.
 *  2. npm run treasure:generate
 *  3. Recopier ci-dessous `check`, `fragment`, `decoys` de chaque étape et
 *     `finalCodeHash`. Modifier aussi `clue` / `success` (textes affichés).
 *  ⚠️ Les clés sont chaînées : changer une étape impose de régénérer toutes
 *  les étapes suivantes (le script le fait d'un coup).
 *  Le code final = concaténation des fragments ; `codeGroups` règle son
 *  découpage à l'affichage (la somme doit égaler sa longueur).
 *
 * ⚠️ CONTENU PROVISOIRE — les énigmes marquées PLACEHOLDER sont des
 * exemples « dans l'esprit » (logique + Glâne), à remplacer par les vraies
 * énigmes du comité. Lot et lieu de remise à valider.
 */

export type TreasureStepType = "indice" | "enigme";

export interface TreasureStep {
  id: string;
  type: TreasureStepType;
  /** Titre affiché dans le carnet une fois l'étape atteinte */
  title: string;
  /** Énoncé cryptique affiché pour l'étape en cours (sans emplacement !) */
  clue: string;
  /** Texte affiché quand l'étape est résolue */
  success: string;
  /** SHA-256("ok|" + clé de chaîne) — généré */
  check: string;
  /** Fragment du code final, chiffré — généré */
  fragment: string;
  /** Empreintes des fausses pistes — générées */
  decoys: string[];
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
    "Neuf fragments d'un code secret sont dispersés dans ce site. Certains se méritent par la réflexion, d'autres dorment dans des recoins que personne ne regarde. Le carnet ne te dira jamais où chercher : il te parlera par énigmes. À toi de déduire.",
  rules: [
    "Les étapes s'ouvrent l'une après l'autre : chaque énoncé ne se dévoile qu'une fois le précédent résolu.",
    "Rien ne brille pour te guider. Ce qui brille trop pourrait bien être un leurre.",
    "Des fausses pistes ont été semées : méfie-toi des réponses trop évidentes.",
    "Ta progression est enregistrée dans ce navigateur. Prends ton temps : on ne termine pas ce carnet en un jour.",
    "Le premier ou la première à présenter le code complet au Giron remporte le trésor.",
  ],
  // PLACEHOLDER — lot et lieu de remise à confirmer par le comité
  prize: "Un lot surprise de la jeunesse organisatrice",
  claim:
    "Présente ce code (et cette page) au stand d'accueil pendant le Giron. Le premier code présenté remporte le trésor.",

  /** Le code final est découpé ainsi à l'affichage : XXXX-XXXX-XXXX */
  codeGroups: [4, 4, 4],
  finalCodeHash:
    "ebcf050154d5ce1ff8a531d16bab5e128bce79b76a7bbb5cc84586b2419b86b9",

  steps: [
    // PLACEHOLDER — énigme de culture locale, à remplacer par le comité.
    // Format : réponse libre (normalisée). Leurres : la rivière elle-même,
    // le chef-lieu du canton, la rivière d'arrivée, le musée…
    {
      id: "cite",
      type: "enigme",
      title: "La cité du verre",
      clue: "Je descends vers la Sarine et je prête mon nom à tout un district. Mais ce n'est pas moi que l'on cherche : nomme la cité perchée qui veille sur mon district, celle où le verre se met à parler.",
      success: "Du haut des remparts, la cité désigne une colline au loin.",
      check: "727feed7ab583db3ea7d2516a6472b9904dbf6d669bfba13a108a7484bfac8ec",
      fragment: "d31c",
      decoys: [
        "e86ae7f1bd1bb3f4b8d149d711f1cbe371838f08e8c5d7940bf6e06777ee16eb",
        "778047b2f8dbc66d2afb7e7f0253bbf6c3552c843b7de8c2165ee337d5ce76bf",
        "f0d0f0c779f5871043699a403eb976a5b7259ecbb3cdcd14d07d1cdbf9b862b7",
        "af56656da180fe04442e9f192c12bac50595b12d0ad25c747772999f92727066",
        "76ebe1e78da3f4dc022fd3d376df4428daf62abce28ddf30ca00206ac0da13da",
      ],
    },
    // CACHETTE — Accueil, illustration du héros : la petite tente de fête
    // dessinée au pied de la colline au premier plan (zone invisible,
    // components/treasure/TentKnock.tsx). Le joueur frappe N fois ;
    // secret envoyé : "toile-<N>". Leurres : nombre de jours, de lieux…
    {
      id: "toile",
      type: "indice",
      title: "La toile",
      clue: "Au premier regard, au pied de la colline la plus proche, une toile abrite le village. Frappe-la autant de fois que la Cantine connaît de grandes soirées.",
      success: "La toile frémit. Un billet était glissé dessous.",
      check: "742398955a9b69153c0792232ccbe50608bbee4e1c636ebf106475aad200b104",
      fragment: "65",
      decoys: [
        "cb7aca1e292c1097b787ceffea7375c5a4f519bddcedf1db669589903b916410",
        "5d03bd895c2a0775f39898366a240666997fb146e7a43f809c34c84ec2ae675d",
        "6c8680836f45a4c9226112cb753a4a09a3f02bddf3a80ec20e683e5dc4254f4b",
      ],
    },
    // CACHETTE — Accueil, compte à rebours du héros : toucher la case des
    // secondes au bon moment (components/ui/Countdown.tsx).
    // Secret envoyé : "seconde-<valeur affichée sur 2 chiffres>".
    {
      id: "sablier",
      type: "indice",
      title: "Le sablier",
      clue: "Le temps qui reste ne ment jamais. Quand sa plus petite part prononce l'année de la fête, fige-le d'un geste.",
      success:
        "Le temps s'est figé. Dans le silence, une rumeur court sur ceux qu'on attend.",
      check: "d320f810d89709eabc5d9f9b146093e7c69be748bd55f8dc95370bb6fc536df7",
      fragment: "3d",
      decoys: [
        "58332726f76c52b67057f5875a4cd7a48baccbe71c983278f7df2e4a2e2fa71e",
        "3b64e3737e27bde945a98ea18c1b7daba811a3ce41150e8b98855a38d24703a0",
      ],
    },
    // CACHETTE — Accueil, affiche lineup : double-clic / double-tap sur la
    // tête d'affiche du samedi → elle se retourne et montre 4 sceaux colorés
    // (couleurs des lieux, sans nom). Secret envoyé : "sceau-<lieu>"
    // (components/home/LineupPoster.tsx). Leurres : autres lieux du samedi.
    {
      id: "revers",
      type: "indice",
      title: "Le revers",
      clue: "Ceux que l'on attend le plus ont deux visages. Appelle deux fois celui du grand samedi ; à son revers, scelle ta trouvaille de la couleur du lieu qui s'endort le dernier ce soir-là.",
      success: "Le sceau a pris. Au revers, quelques mots à l'encre pâle.",
      check: "c92502f810d376293219b338a11bf52b9dbcc155cee5bbaf8a0eb3762c44fd67",
      fragment: "818c",
      decoys: [
        "d9337efbb88f86668fd562c1a374ea9c76b5c65224765dfccec4692c4a0aef6b",
        "c397facdfd4471553fa1d6d82b197ab58998cdec9f466a0e4f1588c33566c379",
      ],
    },
    // PLACEHOLDER — énigme de tradition, à remplacer par le comité.
    // Format : réponse libre (normalisée). Leurres : objets qui « passent »
    // aussi de main en main (flambeau, témoin…).
    {
      id: "passage",
      type: "enigme",
      title: "Ce qui passe",
      clue: "On me hisse quand tout commence et l'on me confie quand tout s'achève. Je ne marche pas, pourtant je voyage de jeunesse en jeunesse, d'un Giron à l'autre. Nomme-moi.",
      success:
        "Hissé haut, il dévoile la place vue du ciel : elle se lit comme un chemin.",
      check: "7dee976a7e700807c845f4c4997b01c676d4dc6df22d3aabfa5e93e8f206fd0f",
      fragment: "27",
      decoys: [
        "d1a7de0d95001f20c754bb3e9d0ec2187af799cdec3666d01b3e74b994fad020",
        "4712b47e700ace6edbd57d3338b80855d0ed6f3ee2666489397fcc37d7523d0a",
        "7c1147f8227c231537575d6435c29a98e60e1c3a29a315168286fcfa54590404",
        "cce9b03341a93131f3fa0b993fbdcd44c2c5ff4d1c13dd17f905a77ef11bc9f0",
        "97160d830ffda302fc80551c1e57d5bb5851ba75b4c6ef9ad269b82d57559a70",
      ],
    },
    // CACHETTE — Infos pratiques, plan de la place : toucher 4 zones (sur le
    // plan ou dans la légende) dans le bon ordre (components/infos/SitePlan.tsx).
    // Secret envoyé : "chemin-<id1>><id2>><id3>><id4>" (4 dernières zones).
    // Leurres : variantes plausibles (parking, vélos, autre bar…).
    {
      id: "chemin",
      type: "indice",
      title: "Le chemin du fêtard",
      clue: "D'un lieu à l'autre, refais la soirée du fêtard sage : il arrive sans moteur à lui ni pédale, va chercher de quoi payer sans monnaie, trinque à ciel ouvert, puis s'endort sous la toile.",
      success:
        "Au bout du chemin, un voisin de tente marmonne quelque chose sur une cave.",
      check: "6e96751fc1e3c756d9be04f0397c61ddd5ed77475c8fec0f73576c6adf2fa739",
      fragment: "b1",
      decoys: [
        "c4209f8dfa0f206b51b59a93d40d40ac38fba6e771f3d75fed81f8be27be8c68",
        "658d22eaf63ca22f81116ad2b16b18d070d619066e62d3dba93d81da65d59584",
        "0a3ed0fb1cb1593920f70072c5fedb015bfbef3c296debe341d00e447fa96772",
        "eca204135dbb83c449d085e4ecc859daa3f937984e8876bc7f158c3e6157dca2",
      ],
    },
    // CACHETTE — La Fête, programme interactif : choisir le seul jour et le
    // seul lieu qui ne donnent « rien », puis toucher ce vide
    // (components/programme/ProgrammeExplorer.tsx).
    // Secret envoyé : "silence-<jour>-<lieux triés, joints par +>".
    // Leurres : les autres combinaisons vides.
    {
      id: "silence",
      type: "indice",
      title: "Le silence",
      clue: "Le dernier jour, la cave reste muette. Là où chacun compose sa fête, fais parler ce silence.",
      success: "Au fond de la cave vide, une étiquette griffonnée.",
      check: "ffa76bbde9107801f568551f320b59281443b4838635d244d63f85233e463411",
      fragment: "285a",
      decoys: [
        "84857cfb3fbeb66be9c661d1d0b56a69e7da502102bd8e64948cf7bec73f0a7f",
        "3c4def50d9900a766cc55047507017859f5fcb2066b972504d56a34cdc28efba",
      ],
    },
    // PLACEHOLDER — énigme de logique qui réutilise une réponse précédente.
    // Format : nombre (espaces et apostrophes ignorés). Leurres : calculs
    // faits avec la mauvaise cité, sans multiplication, sans l'année…
    {
      id: "etiquette",
      type: "enigme",
      title: "L'étiquette",
      clue: "Prends les lettres de la cité où le verre parle. Compte-les autant de fois que la fête a de jours, puis ajoute l'année du Giron. Le nombre ouvre la cave.",
      success:
        "La cave s'ouvre. Un dernier mot y attend : là où tout s'achève.",
      check: "eb38e8af948a75125d587616c18b3651f908e611b1ec30de5a9d0bab8d92dc2c",
      fragment: "4e",
      decoys: [
        "f83cc3ebf1c1d1e8a924a5dda1943700a56dbc289fd82cd8e62f307868d7fbff",
        "71bb1bca45aeacdca8e8f1b7473a4d09b3132c8e1787ccbee55477a752b68da1",
        "f36496414436092303f29878c9b1bbef7cf2bc069219938d1bf5f6d234b72a05",
        "d0eba6294ac0a01d8369de7ec3787c97095965ee28deee971db7d630145bb0c0",
        "bdee595c9e078387fd6facf31975be5cd2012b9680f34f45b3bb093751b67572",
      ],
    },
    // CACHETTE — Pied de page, grand filigrane « Giron 28 » : toucher ses
    // deux parties dans un certain ordre (components/treasure/TreasureTrigger.tsx).
    // Secret envoyé : "rebours-<partie1>><partie2>" (parties : giron, 28).
    {
      id: "rebours",
      type: "indice",
      title: "À rebours",
      clue: "Là où tout s'achève, le Giron tient en un mot et deux nombres. Lis-les à rebours, du bout du doigt.",
      success: "Le dernier fragment est à toi. Le trésor t'attend.",
      check: "4ce2ac78c13da6d5e52a7cecb2802df4fe8f363fc0fa6d83c62b0ed35fa4f09e",
      fragment: "5a",
      decoys: [
        "c5e9442b2ea76130bba1b437126ecd2c5548f3e6aa1c961971df3a5645ea8c41",
      ],
    },
  ],
};
