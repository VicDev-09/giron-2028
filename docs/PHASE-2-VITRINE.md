# Phase 2 — Vitrine publique · Brief pour Claude Code

> **Projet :** Site officiel du Giron glânois 2028
> **Rôle de ce document :** consignes précises pour Claude Code.
> **Base :** construit SUR la fondation Phase 1 (Next.js App Router, TS strict, Tailwind, déjà en place sur `main`).
> **Statut :** à exécuter sur une branche dédiée `feature/vitrine`, PAS sur `main`.

---

## 🎯 Objectif

Construire la **vitrine publique** du Giron : les pages d'information, avec un design **sur-mesure, moderne, immersif et animé**. 

**Mot d'ordre : faire NETTEMENT mieux que les sites de référence** (`sommentier2026.ch`, `granges2026.ch`) qui sont des WordPress/Elementor conventionnels (blocs statiques, programme = simple tableau, peu d'animations). On veut un site qui se démarque.

> Périmètre = **front-end / contenu statique uniquement.** Pas de backend, base de données, auth ni paiement à cette phase (ça vient plus tard). Les formulaires sont visuels/placeholder (ou `mailto:`), sans traitement serveur.

---

## 🧩 Dépendances à ajouter

- **`framer-motion`** — animations fluides (scroll reveal, parallax, transitions)
- **`lucide-react`** — jeu d'icônes cohérent et léger
- (rien d'autre sans raison — rester léger)

---

## 🎨 Direction artistique

Ambiance voulue : **moderne & dynamique + immersif & spectaculaire** — esprit jeunesse, festif, régional (Glâne / Fribourg).

### Design system (à mettre dans les tokens Tailwind, facilement remplaçable plus tard)
- **Palette provisoire** (identité officielle pas encore fournie — proposer une palette forte et cohérente, définie en **tokens CSS/Tailwind** pour être remplaçable en 1 endroit) :
  - Sections **immersives** : fond sombre profond (nuit/prune) pour les héros et transitions
  - **Accent vif et festif** (ex. corail électrique / ambre chaud) pour l'énergie et les CTA
  - Sections **claires** lisibles pour le contenu dense (programme, infos)
- **Typographie** : une display forte et caractérielle pour les titres + une sans-serif très lisible pour le corps. Grandes tailles, letter-spacing soigné.
- **Mode sombre/clair** géré proprement via tokens.
- **Micro-interactions** soignées partout (hover, boutons, cartes).

### Différenciateurs attendus (le « mieux que les autres »)
1. **Hero plein écran** immersif (image/vidéo de fond, overlay, parallax) avec un **compte à rebours animé** jusqu'au Giron.
2. **Animations au scroll** fluides et élégantes (reveal, parallax léger, stagger) — jamais gadget, toujours au service du contenu.
3. **Programme INTERACTIF** : filtres par **jour** et par **lieu** (Cantine / Tonnelle / Caveau / Jeux enfants), cartes animées — PAS un simple tableau statique.
4. **Mur de sponsors** animé, organisé par catégories (or/argent/bronze), avec effet au survol.
5. **Mobile-first impeccable** (la majorité du trafic viendra sur téléphone) : navigation mobile soignée (menu plein écran animé).
6. **Performance** : rendu statique (SSG) pour encaisser les pics du Giron, images optimisées (`next/image`), Lighthouse visé > 90.
7. **Accessibilité** : contrastes AA, navigation clavier, `prefers-reduced-motion` respecté (couper/atténuer les animations si demandé).

---

## 🗺️ Pages & routes (App Router)

| Route | Page | Contenu clé |
|---|---|---|
| `/` | Accueil | Hero + compte à rebours, teaser fête, aperçu programme, appels bénévoles/sponsors, réseaux |
| `/la-fete` | La Fête | **Programme interactif** (filtres jour/lieu), concerts, cortège, loto, souper, jeux |
| `/infos-pratiques` | Infos pratiques | Accès, parking, plan du site, **cashless**, camping, navettes/rapatriement, FAQ |
| `/la-jeunesse` | La Jeunesse | Présentation de la jeunesse, le comité, les commissions |
| `/benevoles` | Bénévoles | Appel à bénévoles + bénéfices + formulaire **placeholder** (pas de backend) |
| `/sponsors` | Sponsors | Mur de partenaires par catégorie + devenir sponsor (placeholder) |
| `/contact` | Contact | Infos, réseaux sociaux, formulaire **placeholder** ou `mailto:` |

### Composants transverses
- **Header** sticky avec nav desktop + **menu mobile plein écran animé**
- **Footer** riche (liens, réseaux, mentions, lieu/dates)
- Composants réutilisables dans `src/components/ui/` (Button, Card, Section, Countdown, etc.) et `src/components/layout/`

---

## 📝 Contenu

- L'identité et le contenu réels ne sont **pas encore fournis**. Utiliser du **contenu placeholder cohérent et thématisé** (esprit giron glânois), clairement remplaçable.
- Dates/lieu exacts **inconnus** → utiliser des placeholders explicites (ex. « Juillet 2028 », « Place de fête, [commune] ») faciles à repérer et remplacer.
- Lieux du programme à utiliser comme catégories : **Cantine, Tonnelle, Caveau, Jeux enfants**.
- **Ne pas** inventer de faux sponsors réels, de vrais noms de personnes, ni de fausses infos officielles → placeholders neutres (« Sponsor Or 1 », « Concert — artiste à confirmer »).

---

## 🚫 Ce qu'il ne faut PAS faire

- ❌ Backend, base de données, authentification, paiement (phases ultérieures).
- ❌ Traitement serveur des formulaires (placeholder / `mailto:` uniquement).
- ❌ Toucher au dossier `docs/` ni aux fichiers de config Phase 1 sans raison.
- ❌ Committer un secret.
- ❌ Pousser sur `main` (travailler sur `feature/vitrine`).
- ❌ Design « template » générique : viser du sur-mesure.
- ❌ Animations gadget qui nuisent à la lisibilité ou à la perf.

---

## ✅ Vérifications attendues (avant la PR)

- [ ] `npm run dev` : toutes les pages s'affichent et sont navigables
- [ ] `npm run build` réussit (rendu statique)
- [ ] `npm run lint` propre + `npm audit` toujours à 0 vulnérabilité
- [ ] **Responsive** vérifié (mobile, tablette, desktop)
- [ ] Animations fluides + `prefers-reduced-motion` respecté
- [ ] Programme interactif : filtres jour/lieu fonctionnels
- [ ] Contrastes lisibles (accessibilité AA)
- [ ] Aucun secret committé, travail sur `feature/vitrine`

---

## 📦 Livrable

Branche **`feature/vitrine`** poussée + **PR vers `main`** avec résumé des changements et captures/notes sur le rendu. L'orchestrateur relit avant merge.

> 💡 Si un choix de design important se présente (ex. direction de palette, style du hero), **fais une proposition et avance** — on affinera à la relecture plutôt que de bloquer.
