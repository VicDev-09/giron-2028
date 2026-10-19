# CONTRIBUTING — Giron 2028

Guide de collaboration du projet. **À lire avant de contribuer.** Avec `CLAUDE.md`, c'est la référence commune (humains + instances Claude Code).

---

## 1. Principes

- **GitHub est la source officielle.** Le dépôt local est une copie de travail.
- Chaque développeur travaille sur **sa** machine, **son** compte GitHub, **ses** branches.
- `main` est **toujours stable et déployable**.
- Rôles : **Claude Desktop** orchestre · **Claude Code** développe · **Cursor** = IDE.
- Le **développeur principal** valide et effectue les merges dans `main`.

---

## 2. 🔒 Règle d'or — jamais de merge direct sur `main`

Pour **toute** modification, même minime :

1. brancher depuis un `main` à jour ;
2. committer sur la branche ;
3. la pousser (**push libre** sur ses propres branches, pas besoin de demander) ;
4. ouvrir une **Pull Request** vers `main` ;
5. merge **uniquement après relecture et validation du développeur principal**.

Jamais de commit direct sur `main`. Jamais de merge sans relecture. Jamais de `push --force` sur une branche partagée. `main` est protégée côté GitHub (PR obligatoire, push direct et force-push bloqués).

---

## 3. 🔄 Reprise de session (obligatoire)

Avant toute modification, à chaque reprise :

1. `git fetch`
2. Regarder ce que l'autre a fait depuis la dernière fois (commits sur `main`, PR mergées, branches).
3. Résumer les changements (fichiers, fonctionnalités, points d'attention).
4. Mettre `main` à jour localement de façon sûre.
5. Mettre à jour / rebaser sa branche de travail si besoin.
6. Vérifier l'absence de chevauchement avec la tâche prévue → sinon **coordination préalable**.

But : ne jamais repartir d'une base périmée, ne jamais refaire ce qui existe, éviter les conflits.

---

## 4. Branches

| Préfixe      | Usage                                  | Exemple                      |
| ------------ | -------------------------------------- | ---------------------------- |
| `feature/`   | nouvelle fonctionnalité                | `feature/billetterie`        |
| `fix/`       | correction de bug                      | `fix/hero-hydration`         |
| `chore/`     | maintenance, config, dépendances       | `chore/upgrade-eslint`       |
| `docs/`      | documentation                          | `docs/contributing`          |

- Nom court, en minuscules, mots séparés par des tirets.
- Une branche = un sujet. Préférer **plusieurs petites PR** à une grosse.
- Toujours brancher depuis un `main` à jour.

---

## 5. Commits

- Style **Conventional Commits** : `type(scope): description` — ex. `feat(boutique): sélecteur produit`.
- Types : `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`.
- Messages clairs, au présent, par étapes logiques. Pas de commit « fourre-tout ».
- **Examiner le diff** avant de committer.

---

## 6. Pull Requests

1. Pousser la branche sur GitHub.
2. Ouvrir une PR vers `main` avec un résumé (quoi, pourquoi, comment tester) + captures si rendu visuel.
3. **Vérifications avant de demander la revue** : `npm run lint` · `npm run format:check` · `npm run build` OK.
4. Le **développeur principal relit** (code + rendu) et **merge** après validation.
5. Supprimer la branche après merge (sauf besoin contraire).

---

## 7. Répartition du travail (anti-doublon)

- Avant de démarrer une tâche, vérifier que l'autre n'est pas déjà dessus.
- Éviter de **toucher les mêmes fichiers** en parallèle ; sinon se coordonner et séquencer.
- Les gros chantiers sont annoncés (branche + but) pour que l'autre sache quoi éviter.

| Zone / module                    | Responsable | Branche active        |
| -------------------------------- | ----------- | --------------------- |
| _(à remplir au fil du projet)_   |             |                       |

---

## 8. Conflits Git

- En cas de conflit : **expliquer les différences** et valider la résolution avant de l'appliquer (ne pas résoudre « à l'aveugle »).
- Ne jamais écraser le travail d'un autre développeur.
- En cas de doute sur un `git pull` risqué (modifications locales) : analyser d'abord, ne pas forcer.

---

## 9. Sécurité

- **Aucun secret** dans le repo ni dans un prompt (`.env`, clés, jetons). Seul `.env.example` est versionné, sans vraie valeur.
- Variables d'environnement : partir de `.env.example`. Accès externes transmis par un **canal sécurisé**, hors GitHub.
- Pas de déploiement en production ni de migration sans accord explicite.
- Pas de suppression/réinitialisation de base de données sans validation.

---

## 10. Mise en route (nouveau collaborateur)

Voir le prompt d'onboarding dédié. En résumé : vérifier les outils → configurer son compte GitHub → cloner le dépôt officiel (pas de ZIP, pas de nouveau repo) → ouvrir dans Cursor → lire `CLAUDE.md` + ce fichier → installer les dépendances (`npm ci` / `npm install`, respecter le lockfile) → lancer en local → faire une PR de test.
