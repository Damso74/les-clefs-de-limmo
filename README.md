# Les Clefs de l'Immo - Démo Parc Immobilier

Application de démonstration pour le pilotage d'un parc immobilier communal.

**Mode DEMO : Toutes les données sont fictives.**

## Fonctionnalités

- **Dashboard** : KPI en temps réel, alertes proactives, graphique facturé/encaissé
- **Biens** : Liste et détail des propriétés avec lots, travaux, contrats et documents
- **Lots** : Gestion des unités locatives (appartements, garages, locaux)
- **Candidatures** : Suivi des demandes de location
- **Baux** : Gestion des contrats de location
- **Paiements** : Suivi des loyers (payé, partiel, en retard, impayé)
- **Travaux** : Planification et suivi des interventions
- **Contrats** : Gestion des contrats HP, assurances, entretien
- **Documents** : Checklist des pièces justificatives

## Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript (strict)
- **Styling** : TailwindCSS
- **Tables** : TanStack React Table
- **Forms** : React Hook Form + Zod
- **Charts** : Recharts
- **Icons** : Lucide React

## Logo

Pour afficher le logo du village (Village des Clefs – Haute-Savoie) dans la barre latérale : copiez **Logo village des Clefs.png** (à la racine) vers **public/logo.png**, ou exécutez `node scripts/copy-logo.js`.

## Installation

```bash
# Cloner le repo
git clone <url>
cd les-clefs-de-limmo

# Installer les dépendances
pnpm install

# Lancer en développement
pnpm dev

# Build production
pnpm build

# Lancer en production
pnpm start
```

## Déploiement Vercel

L'application est prête à être déployée sur Vercel :

1. Connecter le repo à Vercel
2. Vercel détectera automatiquement Next.js
3. Déployer !

Aucune variable d'environnement requise pour la démo (données mock).

## Structure du Projet

```
src/
├── app/                    # Routes Next.js (App Router)
│   └── (app)/              # Routes avec layout principal
│       ├── dashboard/
│       ├── properties/
│       ├── units/
│       ├── payments/
│       ├── maintenance/
│       ├── contracts/
│       └── ...
├── components/
│   ├── layout/             # Sidebar, Topbar, DemoBadge
│   ├── cards/              # KpiCard, AlertCard, StatusBadge
│   ├── tables/             # DataTable + colonnes
│   ├── forms/              # Formulaires CRUD
│   ├── charts/             # Graphiques
│   └── ui/                 # Composants génériques
├── domain/
│   ├── types/              # Modèle de données TypeScript
│   ├── repositories/       # Interfaces + implémentations mock
│   └── services/           # Logique métier (KPI, alertes)
└── lib/
    ├── mock/               # Données fictives
    ├── validation/         # Schémas Zod
    └── utils/              # Helpers (dates, money, format)
```

## Données de Démo

L'application contient :
- 5 biens immobiliers
- 15 lots (appartements, garages, locaux)
- 10 locataires
- 10 candidatures
- 8 baux actifs
- 24 paiements (sur 3 mois)
- 8 travaux
- 6 contrats (dont 2 HP)
- 20 documents

## Alertes

Le système génère automatiquement des alertes pour :
- Contrats expirés ou expirant dans 30 jours
- Logements vacants depuis plus de 30 jours
- Paiements en retard
- Dépassement de budget travaux (>10%)
- Documents manquants ou expirés

## Parcours Démo "5 minutes"

1. **Dashboard** : Vue d'ensemble avec KPI et alertes
2. **Biens** : Cliquer sur un bien pour voir ses lots
3. **Lots** : Consulter un lot pour voir le bail et paiements
4. **Paiements** : Filtrer par "En retard" pour voir les impayés
5. **Contrats** : Voir les contrats HP et leurs statuts

## Licence

Projet de démonstration - Données fictives uniquement.
