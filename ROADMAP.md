# Roadmap

Post-MVP enhancements, classés par priorité.

## v1.1 — Quick wins

- [ ] **Mode comparaison** : afficher deux pays côte-à-côte (sub-scores,
      cartes, prompts). Réutilise `loadFromHistory` pour le second slot.
- [ ] **Web Share API** : partage natif d'un pays via le navigateur
      (`navigator.share`) avec fallback "copier le lien".
- [ ] **Export du dossier complet** : un seul PNG combinant carte +
      power score + résumé narratif, pour partage TikTok en une image.
- [ ] **Reroll d'une seule roue** : depuis la `ProfilePanel`, permettre
      de re-spinner une roue précise sans casser le pays. Préserver le
      seed des autres roues pour observer l'impact.

## v1.2 — Profondeur de jeu

- [ ] **Mode tournoi** : bracket à 4 / 8 / 16 pays sauvegardés.
      Comparaison automatique sur power score, tie-break aléatoire.
- [ ] **Sons opt-in** : effet ticking pendant la rotation, fanfare au
      résultat. Toggle persisté + respect de `prefers-reduced-motion`.
- [ ] **Mode clair / sombre** : actuellement uniquement sombre.
      Variables CSS prêtes — manque le toggle.
- [ ] **Animations stagger plus poussées** : Framer Motion enchaîne déjà
      les sub-scores ; étendre au reveal des ressources et au compteur
      du power score (animation count-up de 0 → score final).

## v1.3 — Plateforme

- [ ] **PWA installable** : manifest + service worker offline-first
      (Workbox via `vite-plugin-pwa`). Permet d'utiliser l'app sans
      réseau et de l'installer sur mobile.
- [ ] **i18n** : extraire toutes les strings dans `data/strings/fr.ts`
      (déjà partiellement fait via les data constants) et brancher
      `react-i18next` pour ouvrir la voie à l'anglais.
- [ ] **Embed widget** : variante `<iframe>`-friendly stylable via
      query params (couleurs, vitesse par défaut, masque les controls).

## v2.0 — Idées ambitieuses

- [ ] **Multiplayer "blind reveal"** : deux joueurs spinnent en
      parallèle sur le même seed, la révélation finale se fait en
      simultané. Realtime via WebSocket / WebRTC datachannel.
- [ ] **Éditeur de scénarios** : permettre à un utilisateur avancé de
      tweaker les modulations conditionnelles dans une UI dédiée et
      d'exporter sa "saison" de Country Spinner.
- [ ] **Backend de classement public** : top des power scores générés
      par la communauté. Nécessite auth et anti-abuse (rate-limit,
      seed cryptographiquement signé).
- [ ] **Génération d'image IA en direct** : appel direct à Flux /
      Replicate avec le prompt généré, retour d'un visuel intégré dans
      l'app au lieu de juste copier le prompt.

## Dette technique

- [ ] Tests de visual regression sur le SVG de la roue (Playwright /
      Chromatic) — les snapshots actuels valident la structure, pas
      l'apparence.
- [ ] Audit Lighthouse mobile cible 95+ (perf, a11y, SEO, best practices).
- [ ] Documenter les invariants du moteur dans `engine/README.md`
      (ordre des spins, contrats de chaque module, sémantique du seed).
