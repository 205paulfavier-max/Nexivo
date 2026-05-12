# Country Spinner

> Générateur procédural de pays fictifs pour contenu TikTok viral.
> 20 roues de tirage, probabilités conditionnelles, scoring de puissance,
> carte SVG procédurale et prompt IA prêt à coller dans Midjourney / DALL-E.

[![tests](https://img.shields.io/badge/tests-174%20passing-00E676)](#tests)
[![typescript](https://img.shields.io/badge/typescript-strict-2979FF)](#)
[![react](https://img.shields.io/badge/react-18-FF2D87)](#)
[![vite](https://img.shields.io/badge/vite-6-FFD60A)](#)

---

## Installation

```bash
npm install
npm run dev      # http://localhost:5173
```

Node 22+ recommandé. Une fois lancé, ouvre l'URL puis clique sur **SPIN**
pour faire tourner la première roue. Tu peux aussi lancer `AUTO` pour
laisser l'app dérouler les 20 roues d'affilée.

## Scripts

| Script                  | Effet                                                     |
| ----------------------- | --------------------------------------------------------- |
| `npm run dev`           | Serveur de développement Vite avec HMR                    |
| `npm run build`         | Type-check (`tsc -b`) + build de production dans `dist/`  |
| `npm run preview`       | Sert le build de prod localement                          |
| `npm test`              | Suite Vitest complète (engine + composants + intégration) |
| `npm run test:watch`    | Mode watch interactif                                     |
| `npm run test:coverage` | Rapport de couverture v8                                  |
| `npm run lint`          | ESLint (0 warning toléré)                                 |
| `npm run typecheck`     | `tsc -b --noEmit` sur tous les projets                    |
| `npm run format`        | Prettier (écriture en place)                              |
| `npm run format:check`  | Prettier en mode validation                               |

## Architecture

```
src/
├── components/         # React UI — strict TS, hooks dédiés par feature
│   ├── Wheel/          # SVG rotatif + pointer + hook d'animation
│   ├── Controls/       # Spin / Auto / Reset / vitesse
│   ├── ResultPanel/    # Résultat (160 px fixe) + liste profil
│   ├── Scoring/        # Power score / sub-scores / résumé
│   ├── Map/            # Carte procédurale + ressources cachées
│   ├── AIPrompt/       # Prompt Midjourney + bouton copier
│   └── History/        # 10 derniers pays + export PNG
├── data/               # Données statiques (20 roues, biomes, ressources, tiers, palette)
├── engine/             # Cœur fonctionnel — 100 % pur, testable, sans React
│   ├── rng.ts          # Mulberry32 + hashSeed FNV-1a
│   ├── shuffle.ts      # Fisher-Yates injectable
│   ├── probability.ts  # 19 wheel-conditionals (mirror v13) + weightedRandom
│   ├── scoring.ts      # stability / economy / military / power / world rank
│   ├── narrative.ts    # Dossier en deux phrases + verdict
│   ├── aiPrompt.ts     # Prompt visuel pour Midjourney / Flux / DALL-E
│   ├── mapGenerator.ts # Polygone irrégulier + zones biome + ressources
│   └── buildCountry.ts # ResultsByWheel → Country snapshot
├── store/              # Zustand store (spin lifecycle + LocalStorage + history)
├── hooks/              # useClipboard, useExportPng
├── types/              # Types stricts, exported individuellement
├── utils/              # formatNumber, formatLabel, geometry
└── styles/             # globals.css + variables CSS + reduced-motion
```

### Principes

- **Pure engine** : aucun import React dans `engine/` ou `data/`. Le moteur
  est testable sans DOM, et la même logique se rejoue identiquement en
  Node (tests) ou dans le navigateur.
- **Strict TypeScript** : `strict`, `noUncheckedIndexedAccess`,
  `noUnusedLocals`, `noUnusedParameters`. Aucun `any` toléré.
- **Déterminisme** : la carte d'un pays donné est toujours identique —
  son seed dépend de biome × superficie × population × idéologie ×
  économies. Re-jouer un pays via l'historique reproduit la même carte.
- **Probabilités conditionnelles** : `engine/probability.ts` reflète à
  l'identique les 19 modulations du proto v13 (garde-fous physiques en
  poids 0, soft-boosts en × 0.2 → × 10), avec gaussienne pour les stats
  du dirigeant.

### Flux d'un spin

1. L'utilisateur clique **SPIN** → `startSpin()` choisit le segment cible
   via `spinWheel(wheel, results)`.
2. La roue se met à tourner via une `transition: transform Xs cubic-bezier`
   CSS. Le hook `useWheelAnimation` lit `getComputedStyle().transform`
   chaque frame pour alimenter le live indicator sous le pointeur.
3. Au bout de la durée (preset Quick / Normal / Dramatic / Epic), un
   `setTimeout` appelle `commitSpin()` qui enregistre le résultat,
   gère l'éventuelle économie supplémentaire (1, 2 ou 3 selon la taille
   du pays) et avance à la roue suivante.
4. Quand les 20 roues sont remplies, `finalizeCountry()` construit le
   `Country`, calcule `PowerScore`, génère la narrative, la carte SVG et
   le prompt IA. Le pays est ajouté à l'historique LocalStorage.

## Tests

174 tests Vitest répartis en cinq couches :

- **Engine** (75 tests) : rng / shuffle / probability / scoring /
  narrative / aiPrompt / mapGenerator / buildCountry. Coverage exhaustif
  des garde-fous (pas de pêche au désert, densité max 25 000 hab/km²,
  gaussienne des stats dirigeant, déterminisme de la carte…).
- **Données** (32 tests) : intégrité des 20 roues, ratings GDP par
  économie, mapping des tiers de score, palette couleurs.
- **Utils** (15 tests) : format, joinFr, isPointInPolygon, polygonToSvgPath.
- **Store** (13 tests) : lifecycle d'un spin, multi-économies, reveal
  resources, persistance LocalStorage.
- **Composants + intégration** (39 tests) : chaque panneau visible,
  invariants UX (panel résultat = 160 px), bouton clipboard, reveal au
  clic, parcours complet « title → 20 spins → power score / map / prompt ».

```bash
npm test                # tout
npm run test:watch      # watch
npm run test:coverage   # rapport HTML dans coverage/
```

## Déploiement

Le build sort dans `dist/` via `npm run build`. Configuration prête pour
Vercel / Netlify : aucun secret nécessaire, juste un build statique.

- **Vercel** : `vercel --prod` ou framework preset _Vite_
- **Netlify** : commande `npm run build`, dossier de publication `dist`
- **GitHub Pages** : ajouter une étape `npm run build` puis publier `dist/`

## Contribution

```bash
# 1. Forker, puis cloner ton fork
git clone … && cd country-spinner

# 2. Installer
npm install     # Husky se prépare automatiquement (pre-commit lint-staged)

# 3. Travailler sur une branche
git checkout -b feat/ton-feature

# 4. Avant de pousser
npm run typecheck && npm run lint && npm test
```

Les commits passent par un pre-commit Husky qui lance Prettier + ESLint
sur les fichiers staged via `lint-staged`. Aucun warning toléré.

## Roadmap

Voir [ROADMAP.md](./ROADMAP.md).

## Référence

Le proto historique v13 (monolithique HTML / JS) servait de référence
fonctionnelle. Cette réécriture en React + TypeScript reproduit chaque
règle de probabilité conditionnelle et chaque formule de scoring à
l'identique, mais dans une base modulaire, testable et maintenable.
