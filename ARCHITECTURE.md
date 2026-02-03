````md
# ARCHITECTURE — Next.js “Parc Immobilier” (DEMO)

Objectif : architecture **simple, scalable**, qui permet de passer **mock → DB** (Prisma/Postgres) sans réécrire l’app.

---

## 1) Tech stack
- Next.js (App Router) + TypeScript
- TailwindCSS (UI)
- Optionnel : shadcn/ui (composants), lucide-react (icônes)
- Zod (validation)
- React Hook Form (forms)
- TanStack Table (tables)

---

## 2) Structure de dossiers (référence)
```txt
src/
  app/
    (app)/
      layout.tsx
      page.tsx                   # redirect -> /dashboard
      dashboard/page.tsx

      properties/page.tsx
      properties/[propertyId]/page.tsx

      units/page.tsx
      units/[unitId]/page.tsx

      applications/page.tsx
      leases/page.tsx
      payments/page.tsx
      maintenance/page.tsx
      contracts/page.tsx
      documents/page.tsx

      settings/page.tsx

    api/
      dashboard/route.ts          # optionnel si besoin
      properties/route.ts
      properties/[propertyId]/route.ts
      units/route.ts
      units/[unitId]/route.ts
      applications/route.ts
      leases/route.ts
      payments/route.ts
      maintenance/route.ts
      contracts/route.ts
      documents/route.ts

  components/
    layout/
      Sidebar.tsx
      Topbar.tsx
      DemoBadge.tsx
    cards/
      KpiCard.tsx
      AlertCard.tsx
      StatusBadge.tsx
    tables/
      DataTable.tsx
      columns/
        propertyColumns.ts
        unitColumns.ts
        paymentColumns.ts
        contractColumns.ts
        maintenanceColumns.ts
    forms/
      PaymentForm.tsx
      ContractForm.tsx
      MaintenanceForm.tsx
    ui/                           # shadcn/ui si utilisé
      ...

  domain/
    types/
      property.ts
      unit.ts
      tenant.ts
      application.ts
      lease.ts
      payment.ts
      maintenance.ts
      contract.ts
      document.ts
      index.ts
    repositories/
      property.repo.ts            # interface
      unit.repo.ts
      application.repo.ts
      lease.repo.ts
      payment.repo.ts
      maintenance.repo.ts
      contract.repo.ts
      document.repo.ts

      impl/
        property.mock.repo.ts
        unit.mock.repo.ts
        application.mock.repo.ts
        lease.mock.repo.ts
        payment.mock.repo.ts
        maintenance.mock.repo.ts
        contract.mock.repo.ts
        document.mock.repo.ts

    services/
      dashboard.service.ts         # KPI + alertes
      finance.service.ts           # helpers calculs
      alert.service.ts             # règles alertes (optionnel)
      link.service.ts              # relations (optionnel)

  lib/
    mock/
      data.ts                      # seed fictif (source de vérité du mock)
      index.ts                     # exports (optionnel)
    validation/
      property.schema.ts
      unit.schema.ts
      payment.schema.ts
      contract.schema.ts
      maintenance.schema.ts
    utils/
      dates.ts
      money.ts
      id.ts
      format.ts

  styles/
    globals.css

  middleware.ts                    # optionnel (ex: bannière DEMO)
````

---

## 3) Conventions & principes

### 3.1 “Domain-first”

* **domain/types** = modèle métier
* **domain/services** = logique de calcul (KPI, alertes)
* **domain/repositories** = accès aux données (mock puis DB)
* **app/** = routes + pages (présentation)

### 3.2 Repositories

Chaque entité a :

* une **interface** `*.repo.ts`
* une implémentation `impl/*.mock.repo.ts`

> Plus tard : `impl/*.db.repo.ts` (Prisma) sans changer les pages.

### 3.3 Source de données mock

* `lib/mock/data.ts` exporte des arrays : `properties`, `units`, `leases`, …
* Les repositories mock lisent/écrivent dans ces arrays.

### 3.4 Services

* `dashboard.service.ts` calcule **KPI + alertes**
* aucune dépendance UI
* doit être testable facilement

---

## 4) Flux de données (MVP)

### Option A (simple) : Server Components direct repo

Pages (Server Components) appellent `repo.list()` / `repo.getById()` directement.

✅ Rapide, moins de boilerplate.

### Option B (API + fetch)

Routes `/api/*` exposent JSON ; pages utilisent `fetch`.

✅ Plus proche prod / future app multi-client.

> Choix recommandé : **Option A** pour aller vite en démo.

---

## 5) Relations (ID & linking)

### IDs

* Property: `P0001`
* Unit: `U0001`
* Tenant: `T0001`
* Application: `A0001`
* Lease: `L0001`
* Payment: `PM0001`
* Maintenance: `W0001`
* Contract: `C0001`
* Document: `D0001`

### Liens

* `Unit.propertyId -> Property.id`
* `Lease.unitId -> Unit.id`
* `Lease.tenantId -> Tenant.id`
* `Payment.leaseId -> Lease.id`
* `Maintenance.propertyId` ou `Maintenance.unitId`
* `Contract.propertyId` ou `Contract.unitId`
* `Document.scope + relatedId`

---

## 6) UI patterns

### Navigation

* Sidebar fixe desktop, drawer mobile
* Topbar : search + badge DEMO

### Tables

* `DataTable` générique (TanStack)
* Colonnes séparées dans `components/tables/columns/*`

### Badges de statut

* `StatusBadge` centralise couleurs/labels
* Normalise enums (ex: `"Occupé"|"Vacant"|...`)

---

## 7) Validation

* Zod schemas dans `lib/validation/*`
* Utilisés par :

  * forms (client)
  * routes api (si Option B)

---

## 8) Déploiement

* Vercel (default)
* Afficher `DEMO — données fictives` globalement
* Optionnel : page `/settings` pour config `vacantDaysThreshold`, `contractExpiryDays`

---

## 9) Qualité (règles)

* Pas de logique de calcul dans les composants UI
* Tous les calculs KPI/alertes passent par `domain/services`
* Pas de `any`
* Commit par sprint (messages clairs)

---

## 10) Roadmap après démo (non bloquant)

* Auth + RBAC
* Prisma + Postgres
* Audit log (qui modifie quoi)
* Exports CSV/PDF
* Carte avec geocoding (si souhaité)

```
::contentReference[oaicite:0]{index=0}
```
