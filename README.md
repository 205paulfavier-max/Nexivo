# GENESIS, modelisation interactive

Application web autonome qui modelise et simule le systeme industriel GENESIS,
une usine fortement automatisee dont le produit est l usine modulaire complete,
native du standard MTP, et circulaire de la conception au recyclage.

> Avertissement, modele de demonstration. Les parametres et indicateurs sont
> illustratifs et configurables, ce ne sont pas des donnees d ingenierie validees.

## Stack

- Vite, React, TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Recharts (graphiques)
- lucide-react (icones)
- SVG pour les schemas de chaine et la boucle circulaire

Tout tourne cote client, simulation en memoire, sans serveur ni stockage navigateur.

## Lancer le projet

```
npm install
npm run dev
```

Ouvrez ensuite l adresse affichee dans le terminal (par defaut
http://localhost:5173).

Autres commandes :

```
npm run build     # verification des types puis build de production
npm run preview   # previsualisation du build
```

## Les six vues

1. Chaine de fabrication, schema horizontal anime des postes, mise en evidence
   du goulot et de sa redondance, rythme pilote par le takt et l automatisation.
2. Bibliotheque de modules, catalogue des modules PEA en cartes, filtre par industrie.
3. Configurateur d usine, selection de modules compatibles et assemblage MTP visuel
   avec indicateur de compatibilite d interface.
4. Boucle de cycle de vie, schema circulaire anime, flux de reemploi en vert.
5. Tableau de bord de simulation, curseurs et calcul en direct des indicateurs,
   compteurs et graphiques Recharts.
6. Passeport numerique, jumeau numerique d un module, historique, composition,
   valeur residuelle et destination de fin de vie.

## Structure des fichiers

```
src/
  main.tsx
  App.tsx
  index.css
  components/
    Sidebar.tsx
    FactoryLine.tsx
    ModuleLibrary.tsx
    PlantConfigurator.tsx
    LifecycleLoop.tsx
    SimulationDashboard.tsx
    DigitalPassport.tsx
    Disclaimer.tsx
    SectionTitre.tsx
    shared.tsx
  data/
    industries.ts
    modules.ts
  simulation/
    types.ts
    engine.ts
  styles/
    tokens.ts
```

## Hypotheses de simulation retenues

Relations volontairement simples et lisibles, pour la demonstration uniquement :

- Livraison OTIF, part d une base autour de 72 %, monte avec la taille du tampon
  (jusqu a environ 18 points) et le double sourcing (7 points), baisse avec la
  part de modules a delai long (jusqu a 24 points). Bornee entre 40 et 99,5 %.
- Delai moyen, part autour de 6 semaines, baisse avec l automatisation (jusqu a
  9 semaines) et le reemploi (jusqu a 4 semaines), monte avec la part de modules
  longs et un takt eleve. Borne entre 2 et 32 semaines.
- Rendement au premier passage, croit lineairement avec l automatisation, de 80
  a environ 97 %.
- Taux de reprise, pilote par le parametre de reemploi (environ 0,9 fois la cible).
- Taux de reemploi effectif, legerement sous la cible (facteur 0,82), aide par
  l automatisation.
- Heures de main d oeuvre par usine, de 1500 heures sans automatisation a 200
  heures a pleine automatisation, baisse forte et lineaire.
- Valeur matiere recuperee, somme de la valeur matiere des modules (composition
  par materiau fois masse fois prix indicatif au kilo) multipliee par le taux de
  reprise. Prix indicatifs, acier 0,8, inox 2,5, cuivre 8, electronique 12,
  autre 0,5 euros par kilo.
- Compatibilite MTP, deux modules se branchent s ils partagent au moins un jeton
  d interface (fluide, electrique ou donnee) dans leur signature.

Ces valeurs sont des points de depart raisonnables, pas des donnees validees.
