# CLAUDE.md — Giron 2028

Contexte projet pour Claude Code. **À lire en entier au début de chaque session.**
C'est la source de vérité du projet avec `CONTRIBUTING.md` (process de collaboration).

@AGENTS.md

## 🔒 Règle d'or — jamais de merge direct sur `main`

Pour **toute** modification, même minime :

1. brancher depuis un `main` à jour (`feature/…`, `fix/…`, `chore/…`, `docs/…`) ;
2. committer sur la branche ;
3. la pousser (push **libre** sur ses propres branches) ;
4. ouvrir une **Pull Request** vers `main` ;
5. merge dans `main` **uniquement après relecture et validation du développeur principal**.

Jamais de commit direct sur `main`, jamais de merge sans relecture, jamais de `push --force` sur une branche partagée. `main` est protégée côté GitHub (PR obligatoire). Détails : `CONTRIBUTING.md`.

## 🔄 Reprise de session — avant toute modification

À chaque reprise de travail : `git fetch` → **regarder ce que l'autre développeur a fait** (commits sur `main`, PR mergées, branches nouvelles/mises à jour) → résumer les changements → mettre `main` à jour sûrement → mettre à jour / rebaser sa branche → vérifier l'absence de chevauchement avec la tâche prévue (sinon coordination). Ne jamais repartir d'une base périmée.

## Projet

Site officiel du Giron glânois 2028. Le développement avance par phases ;
chaque phase a son brief dans `docs/` (ex. `docs/PHASE-1-FONDATION.md`).
L'architecture cible est décrite dans `docs/ARCHITECTURE.html`.

Projet **collaboratif à deux** (développeur principal + 1 collaborateur), chacun sur sa machine et son compte GitHub. GitHub est la source officielle ; le dépôt local est une copie de travail.

## Stack

| Brique          | Choix                                     |
| --------------- | ----------------------------------------- |
| Framework       | Next.js 16 (App Router)                   |
| Langage         | TypeScript, mode `strict`                 |
| Style           | Tailwind CSS 4                            |
| ORM             | Prisma 7 (`prisma.config.ts` + `prisma/`) |
| Base de données | PostgreSQL 16 (Docker en dev)             |
| Paquets         | npm (lockfile `package-lock.json`)        |
| Qualité         | ESLint (config Next) + Prettier           |

> Parité d'environnement : utiliser la version de Node épinglée par le projet
> (`.nvmrc` / champ `engines` de `package.json`) sur chaque machine.

## Arborescence

```
src/
├── app/               # routes App Router (layout racine, pages)
├── components/
│   ├── ui/            # composants génériques réutilisables
│   └── layout/        # header, footer, nav
├── lib/               # clients & utils (db, auth, paiement…)
├── server/            # logique métier / actions serveur
└── styles/            # styles globaux Tailwind (globals.css)
prisma/schema.prisma   # schéma (modèles ajoutés en Phase 3)
prisma.config.ts       # config Prisma (lit DATABASE_URL via dotenv)
docs/                  # documentation — ne pas écraser
```

## Conventions

- TypeScript strict, pas de `any` sans justification.
- Imports absolus via l'alias `@/*` (→ `src/*`).
- Styles en classes Tailwind ; le CSS global reste dans `src/styles/globals.css`.
- Avant de committer : `npm run lint`, `npm run format:check`, `npm run build`.
- Next.js 16 diffère des versions antérieures : consulter
  `node_modules/next/dist/docs/` en cas de doute (voir `AGENTS.md`).

## Règles Git (résumé — détails dans `CONTRIBUTING.md`)

- `main` est stable : on n'y travaille **jamais** directement (voir Règle d'or).
- Une branche par phase / fonctionnalité (`feature/<nom>`, `fix/…`, `chore/…`, `docs/…`).
- Commits par étapes logiques, style Conventional Commits (`feat:`, `chore:`, `docs:`, `fix:`).
- Toute intégration dans `main` passe par une PR relue, mergée par le développeur principal.
- Reprise de session systématique (voir plus haut) ; coordination si on touche la même zone.

## Interdits

- ❌ Pousser / committer / merger directement sur `main`.
- ❌ `push --force` sur une branche partagée ; écraser le travail d'un autre dev.
- ❌ Committer un `.env` ou le moindre secret / clé (seul `.env.example` est versionné, sans vraie valeur).
- ❌ Modifier ou écraser le contenu existant de `docs/`.
- ❌ Ajouter des dépendances lourdes hors du périmètre de la phase en cours.
- ❌ Écrire de la logique métier ou des modèles de données en dehors de la phase prévue.
- ❌ Déployer en production ou migrer sans accord explicite.
