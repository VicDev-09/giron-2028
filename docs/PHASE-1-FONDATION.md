# Phase 1 — Fondation · Brief pour Claude Code

> **Projet :** Site officiel du Giron glânois 2028
> **Rôle de ce document :** consignes précises pour Claude Code. À suivre tel quel.
> **Statut :** à exécuter sur une branche dédiée, PAS sur `main`.

---

## 🎯 Objectif

Poser le **squelette technique** du projet : une base Next.js propre, typée, stylable avec Tailwind, dockerisée pour le dev, et prête à accueillir les fonctionnalités des phases suivantes.

**⚠️ Aucune logique métier ni page de contenu à cette étape.** On construit uniquement les fondations.

---

## 🧱 Stack imposée

| Brique | Choix | Version cible |
|---|---|---|
| Framework | Next.js (App Router) | dernière stable |
| Langage | TypeScript (mode strict) | — |
| Style | Tailwind CSS | dernière stable |
| ORM | Prisma | dernière stable |
| Base de données | PostgreSQL (via Docker en dev) | 16 |
| Gestionnaire de paquets | npm | — |
| Lint/format | ESLint + Prettier | — |

> Animations (Framer Motion ou équivalent) : **hors périmètre Phase 1**, prévues plus tard.

---

## 📋 Tâches à réaliser (dans l'ordre)

### 1. Initialiser l'app Next.js
- `create-next-app` avec : **TypeScript**, **Tailwind**, **App Router**, **ESLint**, dossier **`src/`**, alias d'import `@/*`.
- Vérifier que `npm run dev` démarre sans erreur.

### 2. Poser l'arborescence cible
```
giron-2028/
├── src/
│   ├── app/               # routes (layout racine + page d'accueil placeholder)
│   ├── components/
│   │   ├── ui/            # composants génériques réutilisables
│   │   └── layout/        # header, footer, nav
│   ├── lib/               # clients & utils (db, auth, paiement — vides pour l'instant)
│   ├── server/            # logique métier / actions serveur (vide)
│   └── styles/            # styles globaux Tailwind
├── prisma/
│   └── schema.prisma      # datasource PostgreSQL + generator, AUCUN modèle métier
├── public/                # assets statiques
├── docs/                  # documentation (déjà présent — NE PAS écraser)
├── .env.example           # modèle de variables (voir §3)
├── Dockerfile
├── docker-compose.yml
├── CLAUDE.md              # contexte projet pour Claude Code (voir §6)
└── README.md              # enrichi (voir §7)
```
- Créer les dossiers vides avec un `.gitkeep` si nécessaire.
- Page d'accueil = simple placeholder (titre « Giron 2028 » + Tailwind fonctionnel), rien de plus.

### 3. Fichier `.env.example`
Créer un modèle **sans aucune vraie valeur** :
```
# Base de données
DATABASE_URL="postgresql://giron:giron@localhost:5432/giron?schema=public"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# (à compléter aux phases suivantes : auth, Stripe/TWINT, etc.)
```
> Le vrai `.env` est déjà ignoré par `.gitignore`. Ne jamais committer de secret.

### 4. Prisma
- `prisma init` pointant sur `DATABASE_URL`.
- `schema.prisma` : datasource `postgresql` + generator `prisma-client-js`. **Aucun modèle** (juste un commentaire « modèles ajoutés en Phase 3 »).
- Ne pas lancer de migration à ce stade.

### 5. Docker (dev local)
- **`Dockerfile`** : image Node 22, build Next.js, multi-stage propre.
- **`docker-compose.yml`** : 2 services
  - `app` (Next.js, port 3000)
  - `db` (PostgreSQL 16, volume persistant, identifiants lus depuis l'env)
- Objectif : `docker compose up` démarre l'app + la base en local.

### 6. `CLAUDE.md` (contexte projet)
Créer un fichier racine `CLAUDE.md` résumant : stack, arborescence, conventions (TS strict, Tailwind), règles Git (branches, main stable), et les **interdits** (pas de secret, pas de push direct sur main). Ce fichier sert de mémoire projet aux prochaines sessions Claude Code.

### 7. `README.md`
Enrichir avec : présentation du projet, prérequis, installation (`npm install`), lancement dev (`npm run dev` et via Docker), structure du projet.

---

## 🌿 Procédure Git (IMPORTANT)

1. Partir de `main` à jour.
2. Créer et travailler sur la branche **`feature/fondation`** (jamais sur `main`).
3. Committer par étapes logiques (messages clairs, style `feat:` / `chore:`).
4. **Ne PAS pousser sur `main`.** Ouvrir une PR `feature/fondation` → `main` pour relecture par l'orchestrateur.

---

## 🚫 Ce qu'il ne faut PAS faire

- ❌ Écrire de la logique métier, des vraies pages de contenu, des modèles de données.
- ❌ Modifier ou écraser le dossier `docs/` existant (dont `ARCHITECTURE.html`).
- ❌ Committer un `.env` ou le moindre secret / clé.
- ❌ Pousser directement sur `main`.
- ❌ Ajouter des dépendances lourdes non listées (animations, auth, paiement → phases suivantes).
- ❌ Modifications massives inutiles : rester minimal et propre.

---

## ✅ Vérifications attendues (avant la PR)

- [ ] `npm install` fonctionne
- [ ] `npm run dev` démarre l'app sur http://localhost:3000 (page placeholder + Tailwind visible)
- [ ] `npm run build` réussit sans erreur
- [ ] `npm run lint` ne remonte aucune erreur
- [ ] `docker compose up` démarre `app` + `db` sans erreur
- [ ] `.gitignore` empêche bien le suivi de `node_modules`, `.env`, `.next`
- [ ] Aucun secret dans les fichiers versionnés
- [ ] Le travail est sur `feature/fondation`, pas sur `main`

---

## 📦 Livrable

Une **branche `feature/fondation`** poussée sur GitHub + une **PR ouverte vers `main`**, avec un résumé des changements. L'orchestrateur relit les diffs avant tout merge.
