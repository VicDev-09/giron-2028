/**
 * Génère les valeurs chiffrées de la chasse au trésor (src/content/treasure.ts).
 *
 * Usage :
 *   1. Copier treasure.secrets.example.json en treasure.secrets.json
 *      (fichier ignoré par git : il contient les réponses en clair).
 *   2. Y renseigner, DANS L'ORDRE du parcours, pour chaque étape :
 *        - id       : identifiant de l'étape (identique à la config)
 *        - secret   : réponse de l'énigme, ou jeton de l'indice caché
 *        - fragment : morceau du code final révélé par l'étape
 *        - decoys   : (facultatif) fausses pistes plausibles
 *   3. npm run treasure:generate
 *   4. Recopier les valeurs `check` / `fragment` et `finalCodeHash` affichées
 *      dans src/content/treasure.ts.
 *
 * Le code final est la concaténation des fragments, dans l'ordre.
 */
import { readFileSync } from "node:fs";
import {
  CHAIN_SEED,
  checkHash,
  decoyHash,
  encryptFragment,
  finalCodeHash,
  nextChainKey,
  normalizeAnswer,
} from "../src/lib/treasure/crypto.ts";

interface SecretStep {
  id: string;
  type: "indice" | "enigme";
  secret: string;
  fragment: string;
  /** Fausses pistes plausibles (même format que `secret`) */
  decoys?: string[];
}

const file = process.argv[2] ?? "treasure.secrets.json";
const { steps } = JSON.parse(readFileSync(file, "utf8")) as {
  steps: SecretStep[];
};

let key = CHAIN_SEED;
console.log("// Valeurs à recopier dans src/content/treasure.ts\n");
for (const step of steps) {
  // Les réponses d'énigmes sont normalisées comme dans le navigateur ;
  // les jetons d'indices sont utilisés tels quels.
  const secret =
    step.type === "enigme" ? normalizeAnswer(step.secret) : step.secret;
  key = await nextChainKey(key, secret);
  console.log(
    `// ${step.id} (${step.type}) — secret normalisé : « ${secret} »`,
  );
  console.log(`check: "${await checkHash(key)}",`);
  console.log(`fragment: "${encryptFragment(step.fragment, key)}",`);
  const decoys = await Promise.all(
    (step.decoys ?? []).map((d) =>
      decoyHash(step.id, step.type === "enigme" ? normalizeAnswer(d) : d),
    ),
  );
  console.log(`decoys: ${JSON.stringify(decoys, null, 2)},\n`);
}

const code = steps.map((s) => s.fragment).join("");
console.log(`finalCodeHash: "${await finalCodeHash(code)}",`);
console.log(`// Code final (à garder secret) : ${code}`);
