# 🎬 Vidéo « L'Histoire de Mitsubishi » — montée avec Remotion

Projet vidéo data-driven : tout le script est dans un seul fichier, et la
vidéo (animations, transitions, durée totale) se génère automatiquement.
La voix-off pourra être ajoutée plus tard sans rien recoder.

## ⚡ Démarrage rapide

```bash
npm install          # déjà fait
npm run dev          # ouvre le Studio Remotion (prévisualisation en direct)
```

Le Studio s'ouvre dans le navigateur : tu peux scroller dans la timeline,
voir chaque séquence, et ajuster en direct.

## 🖼️ Rendre la vidéo

```bash
npm run render       # -> out/mitsubishi.mp4 (sans voix)
```

Rendre une image fixe pour tester un instant précis :

```bash
npm run still        # -> out/preview.png (frame 0)
npx remotion still MitsubishiVideo out/test.png --frame=820
```

## 🎙️ Ajouter la voix-off (quand elle sera prête)

1. Enregistre la voix qui lit le texte des sous-titres.
2. Dépose le fichier dans `public/`, ex. `public/voix-off.mp3`.
3. **Cale les durées** : dans `src/data/script.ts`, ajuste le champ `seconds`
   de chaque sous-titre pour qu'il corresponde à la diction réelle.
   La durée totale de la vidéo se recalcule toute seule.
4. Rends avec la voix :
   ```bash
   npm run render:audio
   ```
   (lit `src/data/render-props.json` qui pointe vers `voix-off.mp3`).

> Astuce : pour caler précisément, ouvre le Studio, renseigne `voiceoverFile`
> dans le panneau de droite, et ajuste les `seconds` en regardant la timeline.

## 🗂️ Comment c'est organisé

```
src/
├── index.ts                 Point d'entrée Remotion
├── Root.tsx                 Déclaration de la composition (taille, fps, durée)
├── MitsubishiVideo.tsx      Assemble les 8 séquences + transitions + audio
├── timing.ts                Calcul des durées (frames) et des fondus
├── fonts.ts                 Chargement des polices EN LOCAL (hors-ligne)
├── data/
│   ├── script.ts        ⭐  LE SCRIPT : tout le texte + timings (à éditer)
│   ├── theme.ts             Charte graphique (couleurs, polices, ton)
│   └── render-props.json    Props pour le rendu avec voix
└── components/
    ├── Scene.tsx            Rend une séquence (fond + visuel + sous-titres)
    ├── Background.tsx       Fond animé selon le ton de la séquence
    ├── Caption.tsx          Sous-titre voix-off
    ├── ChapterLabel.tsx     Étiquette « Chapitre N » en début de séquence
    ├── DiamondLogo.tsx      Logo aux trois diamants (SVG animé)
    ├── Visual.tsx           Routeur : choisit le visuel selon la caption
    └── visuals/             Tous les visuels (carte, portrait, zaibatsu…)
public/
├── fonts/                   Polices Montserrat + Inter (.ttf, hors-ligne)
└── voix-off.mp3             ← à déposer ici quand la voix est prête
```

## ✏️ Modifier le contenu

**Tout passe par `src/data/script.ts`.** Chaque séquence est une liste de
sous-titres (`captions`). Chaque sous-titre a :

| Champ      | Rôle                                                        |
|------------|-------------------------------------------------------------|
| `text`     | Le texte affiché et lu par la voix                          |
| `seconds`  | Durée d'affichage (à caler sur la voix réelle)              |
| `visual`   | Le plan affiché (`logo`, `map`, `portrait`, `war`, etc.)    |
| `source`   | Référence de source affichée discrètement (ex. `"S16"`)     |
| `emphasis` | `true` = texte plus gros, pour les phrases fortes           |

Les valeurs possibles de `visual` : `logo`, `map`, `portrait`, `montage`,
`blasons`, `tree`, `war`, `factText`, `fragment`, `modern`, `title`, `cta`.

## 🏗️ Remplacer les visuels par de vraies images d'archives (optionnel)

Les visuels actuels sont dessinés en vectoriel (placeholders soignés). Pour
mettre une vraie photo (portrait d'Iwasaki, avion Zéro…) : dépose l'image dans
`public/`, puis dans le composant correspondant de `src/components/visuals/`,
remplace le SVG par `<Img src={staticFile("mon-image.jpg")} />`.

## ⚙️ Détails techniques

- **Format** : 1920×1080, 30 fps (modifiable dans `src/data/theme.ts`).
- **Durée actuelle** : ~10 min (estimée d'après les `seconds` du script).
- **Polices** : chargées en local pour un rendu fiable et hors-ligne.
- **Vérifier que tout compile** : `npm run typecheck`.
