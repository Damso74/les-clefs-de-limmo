# PRD — Les Clefs de l'Immo (Démo)

## 1. Contexte et objectifs

### Contexte
Application de **démonstration** pour le pilotage d'un parc immobilier communal (mairie, bailleur social, petite collectivité). Données fictives, village des Clefs (74230, Haute-Savoie).

### Objectifs
- **Montrer** en 5–10 minutes les capacités d'un outil de gestion de patrimoine : inventaire, baux, paiements, travaux, contrats, documents.
- **Valider** l'intérêt métier avant un éventuel projet réel (auth, base de données, déploiement).
- Servir de **référence** d'architecture (Next.js App Router, domain-first, repositories mock → DB).

---

## 2. Personas

| Persona | Rôle | Besoin principal |
|--------|------|-------------------|
| **Responsable patrimoine** | Mairie / bailleur | Vue d'ensemble (KPI, alertes), suivi des loyers et impayés, renouvellement des contrats. |
| **Gestionnaire** | Au quotidien | Saisie des paiements, suivi des candidatures et baux, planification des travaux. |
| **Élu / décideur** | Pilotage | Tableau de bord, indicateurs (taux d'occupation, cashflow), alertes (impayés, contrats). |

---

## 3. Périmètre fonctionnel (MVP démo)

### In scope
- **Dashboard** : KPI (lots, occupation, loyers facturés/encaissés, impayés, travaux, cashflow), alertes (contrats, vacance, paiements, documents), graphique facturé vs encaissé, sélecteur de période.
- **Biens** : Liste, fiche détail (lots, travaux, contrats, documents).
- **Lots** : Liste, fiche détail (bail, locataire, paiements, travaux, documents).
- **Candidatures** : Liste et statuts.
- **Baux** : Liste et détail.
- **Paiements** : Liste, filtres (payé / retard / impayé), ajout (formulaire).
- **Travaux** : Liste et suivi (planifié / en cours / terminé).
- **Contrats** : Liste (HP, assurance, etc.) et statuts d'expiration.
- **Documents** : Checklist par scope (candidature, bail, bien, etc.).
- **Paramètres** : Seuils d'alerte (vacance, expiration contrat), lien vers le tableau de bord avec ces paramètres.

### Hors scope (démo)
- Authentification et rôles.
- Base de données réelle (données en mémoire / mock).
- Exports CSV/PDF.
- Carte géographique.
- Envoi d’emails / notifications.

---

## 4. Critères de succès

| Critère | Mesure |
|--------|--------|
| **Parcours démo fluide** | Un nouveau visiteur peut suivre le parcours "5 minutes" (README) sans blocage. |
| **Alertes cohérentes** | Les seuils (Paramètres) sont utilisés sur le tableau de bord pour les alertes vacance et expiration contrat. |
| **Données crédibles** | Inventaire et montants réalistes pour un petit parc (5 biens, 15 lots, 8 baux). |
| **Architecture claire** | Séparation domain / app / components ; passage mock → DB possible sans réécrire les écrans. |

---

## 5. Contraintes techniques

- **Stack** : Next.js 14 (App Router), TypeScript strict, TailwindCSS, TanStack Table, React Hook Form + Zod, Recharts.
- **Données** : Repositories avec implémentations mock ; une seule source de vérité (`lib/mock/data.ts`).
- **Pas de `any`** ; logique métier dans `domain/services`, pas dans les composants UI.

---

## 6. Livrables

- Application déployable (ex. Vercel).
- README (installation, parcours démo).
- ARCHITECTURE.md (structure, conventions).
- PRD (ce document).
