# Nexivo CRM

CRM interne Nexivo : dashboard, contacts, sociétés, pipeline commercial, tâches.
Appli full front, **aucune base de données à installer** : toutes les données sont
persistées dans le `localStorage` du navigateur (parfait pour démarrer, tester et
itérer avant de brancher un vrai backend).

## Stack

- [Next.js 14](https://nextjs.org/) (App Router) + React 18
- TypeScript strict
- Tailwind CSS (thème aux couleurs Nexivo : noir, bleu royal, rouge)
- Recharts pour les graphiques du tableau de bord
- Lucide-react pour les icônes

## Démarrer en local

```bash
npm install
npm run dev
```

Puis ouvrir <http://localhost:3000>.

Au premier lancement, un jeu de données de démonstration est chargé
automatiquement (sociétés, contacts, deals, tâches) pour que tout soit visible
immédiatement. Vous pouvez le recharger à tout moment via le bouton
**« Recharger la démo »** en bas de la sidebar.

## Fonctionnalités

- **Tableau de bord** : KPIs (pipeline ouvert, prévision pondérée, affaires
  gagnées, contacts), graphique en barres du pipeline par étape, répartition
  des deals, tâches à venir, deals récents.
- **Contacts** : création / modification / suppression, étiquettes, rattachement
  à une société, recherche full-text.
- **Sociétés** : fiches synthétiques avec nombre de contacts, deals ouverts et
  valeur du pipeline associé.
- **Pipeline commercial (Kanban)** : 6 étapes (Nouveau → Qualifié → Proposition
  → Négociation → Gagné / Perdu), **glisser-déposer** entre colonnes, montant,
  probabilité, date de clôture prévue, alerte retard.
- **Tâches** : priorités (basse / moyenne / haute), statut (à faire / en cours
  / terminé), liaison à un contact et/ou un deal, filtre par statut, coche
  rapide.

## Structure du projet

```
app/
  layout.tsx            # Root layout + CrmProvider
  page.tsx              # Dashboard
  contacts/page.tsx     # Module contacts
  companies/page.tsx    # Module sociétés
  deals/page.tsx        # Pipeline kanban
  tasks/page.tsx        # Module tâches
  components/           # Shell, Logo, Modal, Avatar, EmptyState, PageHeader
  globals.css           # Tailwind + classes utilitaires Nexivo
lib/
  types.ts              # Types du domaine (Company, Contact, Deal, Task)
  store.tsx             # Context + reducers + persistance localStorage
  seed.ts               # Données de démonstration
  format.ts             # Helpers d'affichage (monnaie, dates, initiales)
tailwind.config.ts      # Palette Nexivo (blue #1D4ED8, red #DC2626, black)
```

## Personnaliser la palette

Les couleurs de marque sont définies dans `tailwind.config.ts` sous la clé
`nexivo.*`. Ajustez-y les teintes exactes si besoin. Le liseré bleu/rouge
signature du logo est exposé comme classe utilitaire `.nexivo-stripe` et comme
gradient Tailwind `bg-nexivo-stripe`.

## Prochaines étapes possibles

- Brancher une vraie API (PostgreSQL + Prisma, Supabase, ou Firestore) en
  remplaçant simplement les fonctions du `CrmProvider` dans `lib/store.tsx`.
- Authentification (NextAuth / Clerk).
- Historique des interactions / notes datées par contact.
- Export CSV des contacts et deals.
- Notifications email lorsqu'une tâche arrive à échéance.
