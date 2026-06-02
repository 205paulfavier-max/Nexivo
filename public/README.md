# Dossier `public/`

Place ici les fichiers utilisés par la vidéo (ils sont accessibles via `staticFile("...")`).

## Voix-off

Quand l'enregistrement de la voix sera prêt :

1. Dépose le fichier ici, par exemple `voix-off.mp3` (ou `.wav`, `.m4a`).
2. Lance le rendu avec la voix :
   ```bash
   npm run render:audio
   ```
   (ce script lit `src/data/render-props.json`, qui pointe vers `voix-off.mp3`).

Ou, dans le Studio (`npm run dev`), renseigne le champ `voiceoverFile` dans le
panneau de droite.

## Musique d'ambiance (optionnel)

Dépose un fichier (ex. `musique.mp3`) et indique-le dans `voiceoverFile`/`musicFile`.
Le volume de la musique est réglé bas (18 %) pour rester sous la voix.

## Images d'archives (optionnel)

Tu peux remplacer les visuels vectoriels (portrait, avion, etc.) par de vraies
images d'archives : dépose-les ici et utilise `<Img src={staticFile("...")} />`
dans le composant visuel correspondant (`src/components/visuals/`).
