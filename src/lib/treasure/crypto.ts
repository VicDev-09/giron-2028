/**
 * Primitives cryptographiques de la chasse au trésor.
 *
 * ⚠️ Ce fichier n'importe RIEN : il est partagé tel quel par le site et par
 * le script `scripts/treasure-generate.ts` (exécuté par Node), ce qui garantit
 * que les hash générés pour le comité sont calculés exactement comme dans le
 * navigateur.
 *
 * Principe (« chaîne ») : la clé de l'étape n vaut
 *   clé(n) = SHA-256(clé(n-1) + "|" + secret(n))      avec clé(0) = CHAIN_SEED
 * où secret(n) est la réponse normalisée (énigme) ou le jeton de l'indice.
 * Le source ne contient que :
 *   - check(n)    = SHA-256("ok|" + clé(n))        → valide l'étape
 *   - fragment(n) = fragment XOR octets(clé(n))     → révélé seulement si juste
 *   - final       = SHA-256("final|" + code)       → contrôle du code complet
 * Impossible de déchiffrer une étape sans avoir résolu toutes les précédentes.
 */

export const CHAIN_SEED = "giron-2028";

const encoder = new TextEncoder();

export function toHex(bytes: Uint8Array): string {
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}

export function fromHex(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

/** SHA-256 hexadécimal : Web Crypto si dispo, sinon implémentation JS. */
export async function sha256Hex(text: string): Promise<string> {
  const data = encoder.encode(text);
  const subtle = globalThis.crypto?.subtle;
  if (subtle) {
    try {
      return toHex(new Uint8Array(await subtle.digest("SHA-256", data)));
    } catch {
      // Contexte non sécurisé (http sur IP locale…) : repli JS ci-dessous
    }
  }
  return toHex(sha256Fallback(data));
}

/**
 * Normalisation des réponses : minuscules, sans accents ni ponctuation,
 * sans article initial, pluriel simple retiré (s/x final des mots > 4 lettres),
 * chiffres recollés. « La Glâne », « glane » et « GLANES » donnent « glane » ;
 * « 2'052 » et « 2 052 » donnent « 2052 ».
 */
export function normalizeAnswer(input: string): string {
  const words = input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/(\d)['’ .](?=\d)/g, "$1")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
  const articles = new Set(["le", "la", "les", "l", "un", "une", "des", "du"]);
  while (words.length > 1 && articles.has(words[0])) words.shift();
  return words
    .map((w) => (w.length > 4 && /[sx]$/.test(w) ? w.slice(0, -1) : w))
    .join(" ");
}

export function nextChainKey(previousKey: string, secret: string) {
  return sha256Hex(`${previousKey}|${secret}`);
}

export function checkHash(chainKey: string) {
  return sha256Hex(`ok|${chainKey}`);
}

/** Empreinte d'une fausse piste (leurre) propre à une étape. */
export function decoyHash(stepId: string, secret: string) {
  return sha256Hex(`decoy|${stepId}|${secret}`);
}

export function finalCodeHash(code: string) {
  return sha256Hex(`final|${code}`);
}

/** XOR symétrique entre un texte court et les octets de la clé de chaîne. */
export function encryptFragment(fragment: string, chainKey: string): string {
  const key = fromHex(chainKey);
  const data = encoder.encode(fragment);
  return toHex(data.map((b, i) => b ^ key[i % key.length]));
}

export function decryptFragment(cipherHex: string, chainKey: string): string {
  const key = fromHex(chainKey);
  const data = fromHex(cipherHex).map((b, i) => b ^ key[i % key.length]);
  return new TextDecoder().decode(data);
}

// --- SHA-256 de repli (FIPS 180-4), sans dépendance ----------------------

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

export function sha256Fallback(data: Uint8Array): Uint8Array {
  const bitLength = data.length * 8;
  const padded = new Uint8Array((((data.length + 9 + 63) >> 6) << 6) >>> 0);
  padded.set(data);
  padded[data.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, Math.floor(bitLength / 2 ** 32));
  view.setUint32(padded.length - 4, bitLength >>> 0);

  const h = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
  ]);
  const w = new Uint32Array(64);
  const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));

  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(offset + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      hh = g;
      g = f;
      f = e;
      e = (d + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) >>> 0;
    }
    h[0] += a;
    h[1] += b;
    h[2] += c;
    h[3] += d;
    h[4] += e;
    h[5] += f;
    h[6] += g;
    h[7] += hh;
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  for (let i = 0; i < 8; i++) outView.setUint32(i * 4, h[i]);
  return out;
}
