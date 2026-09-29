# Giron 2028

Site officiel du **Giron glânois 2028**.

Application web Next.js (App Router, TypeScript, Tailwind CSS) avec Prisma et
PostgreSQL. Le projet est en **Phase 1 — Fondation** : seul le socle technique
est en place, sans contenu ni logique métier.

## Prérequis

- [Node.js](https://nodejs.org/) 22 et npm
- [Docker](https://www.docker.com/) avec Docker Compose (pour la base de données
  ou pour tout lancer en conteneurs)

## Installation

```bash
git clone https://github.com/VicDev-09/giron-2028.git
cd giron-2028
npm install
cp .env.example .env   # puis adapter les valeurs si besoin
```

## Lancement en développement

### Avec Node (rechargement à chaud)

```bash
docker compose up -d db   # démarre uniquement PostgreSQL
npm run dev               # http://localhost:3000
```

### Tout via Docker

```bash
docker compose up --build   # app sur http://localhost:3000 + PostgreSQL 16
```

L'image `app` est un build de production (Next.js `standalone`). Les données de
la base sont conservées dans le volume `db-data` (`docker compose down -v` pour
les supprimer).

## Scripts

| Commande               | Rôle                          |
| ---------------------- | ----------------------------- |
| `npm run dev`          | serveur de développement      |
| `npm run build`        | build de production           |
| `npm run start`        | lance le build de production  |
| `npm run lint`         | ESLint                        |
| `npm run format`       | formate le code avec Prettier |
| `npm run format:check` | vérifie le formatage          |

## Structure du projet

```
giron-2028/
├── src/
│   ├── app/               # routes (layout racine + page d'accueil)
│   ├── components/
│   │   ├── ui/            # composants génériques réutilisables
│   │   └── layout/        # header, footer, nav
│   ├── lib/               # clients & utils (db, auth, paiement)
│   ├── server/            # logique métier / actions serveur
│   └── styles/            # styles globaux Tailwind
├── prisma/
│   └── schema.prisma      # datasource PostgreSQL (modèles en Phase 3)
├── prisma.config.ts       # configuration Prisma
├── public/                # assets statiques
├── docs/                  # documentation (architecture, briefs de phase)
├── .env.example           # modèle de variables d'environnement
├── Dockerfile
├── docker-compose.yml
└── CLAUDE.md              # contexte projet pour Claude Code
```

## Contribuer

`main` est la branche stable. Travailler sur une branche `feature/<nom>` et
ouvrir une Pull Request vers `main`. Ne jamais committer de `.env` ni de secret.
