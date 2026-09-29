# CLAUDE.md — Giron 2028

Contexte projet pour Claude Code. À lire au début de chaque session.

@AGENTS.md

## Projet

Site officiel du Giron glânois 2028. Le développement avance par phases ;
chaque phase a son brief dans `docs/` (ex. `docs/PHASE-1-FONDATION.md`).
L'architecture cible est décrite dans `docs/ARCHITECTURE.html`.

## Stack

| Brique          | Choix                                     |
| --------------- | ----------------------------------------- |
| Framework       | Next.js 16 (App Router)                   |
| Langage         | TypeScript, mode `strict`                 |
| Style           | Tailwind CSS 4                            |
| ORM             | Prisma 7 (`prisma.config.ts` + `prisma/`) |
| Base de données | PostgreSQL 16 (Docker en dev)             |
| Paquets         | npm                                       |
| Qualité         | ESLint (config Next) + Prettier           |

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

## Règles Git

- `main` est stable : on n'y travaille jamais directement.
- Une branche par phase / fonctionnalité (`feature/<nom>`).
- Commits par étapes logiques, style Conventional Commits (`feat:`, `chore:`, `docs:`, `fix:`).
- Toute intégration dans `main` passe par une PR relue par l'orchestrateur.

## Interdits

- ❌ Pousser directement sur `main`.
- ❌ Committer un `.env` ou le moindre secret / clé (seul `.env.example` est versionné, sans vraie valeur).
- ❌ Modifier ou écraser le contenu existant de `docs/`.
- ❌ Ajouter des dépendances lourdes hors du périmètre de la phase en cours.
- ❌ Écrire de la logique métier ou des modèles de données en dehors de la phase prévue.
