/**
 * DATA_MODEL.ts — Parc Immobilier (DEMO)
 * Objectif: types stables + enums + relations par IDs
 * - Pas de logique ici, uniquement le modèle
 */

export type ISODate = string;     // "2026-02-01"
export type ISODateTime = string; // "2026-02-01T10:30:00Z"
export type YearMonth = string;   // "2026-02"

/** IDs (conventions) */
export type PropertyId = string;     // "P0001"
export type UnitId = string;         // "U0001"
export type TenantId = string;       // "T0001"
export type ApplicationId = string;  // "A0001"
export type LeaseId = string;        // "L0001"
export type PaymentId = string;      // "PM0001"
export type MaintenanceId = string;  // "W0001"
export type ContractId = string;     // "C0001"
export type DocumentId = string;     // "D0001"

/** Shared */
export type MoneyEUR = number; // store as number (EUR). Later: use cents in DB.

export type EntityScope =
  | "PROPERTY"
  | "UNIT"
  | "TENANT"
  | "APPLICATION"
  | "LEASE"
  | "PAYMENT"
  | "MAINTENANCE"
  | "CONTRACT";

export interface BaseEntity {
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** PROPERTY */
export type PropertyType = "Immeuble" | "Maison" | "Terrain" | "Local" | "Autre";

export interface Property extends BaseEntity {
  id: PropertyId;
  name: string;           // "Immeuble Centre"
  address: string;        // "1 rue Exemple"
  city: string;           // "Les Clefs"
  postalCode: string;     // "74230"
  type: PropertyType;

  purchaseDate?: ISODate;
  purchasePrice?: MoneyEUR;    // €
  estimatedValue?: MoneyEUR;   // €

  annualPropertyTax?: MoneyEUR; // taxe foncière annuelle
  annualCharges?: MoneyEUR;     // charges annuelles (assurances, syndic, etc.)

  notes?: string;
  photoUrl?: string;
  lat?: number;
  lng?: number;
}

/** UNIT */
export type UnitStatus = "Vacant" | "Occupé" | "En travaux" | "Indispo";

export type UnitType =
  | "Studio"
  | "T1"
  | "T2"
  | "T3"
  | "T4"
  | "T5+"
  | "Local"
  | "Garage"
  | "Autre";

export interface Unit extends BaseEntity {
  id: UnitId;
  propertyId: PropertyId;

  label: string;      // "Apt 1A", "Lot 12", "Garage G2"
  type: UnitType;
  floor?: number;
  rooms?: number;     // nb pièces/chambres (au choix)
  areaM2?: number;

  targetRentExclCharges?: MoneyEUR;  // loyer cible
  monthlyCharges?: MoneyEUR;

  status: UnitStatus;
  vacantSince?: ISODate;             // pour alertes vacance
  lastRefurbishedAt?: ISODate;

  notes?: string;
  photoUrl?: string;
}

/** TENANT */
export interface Tenant extends BaseEntity {
  id: TenantId;
  lastName: string;
  firstName: string;
  phone?: string;
  email?: string;
  birthDate?: ISODate;

  notes?: string;
  dossierUrl?: string; // lien Drive dossier locataire
}

/** APPLICATION (candidature) */
export type ApplicationStatus = "Nouveau" | "En analyse" | "Approuvé" | "Refusé" | "Abandon";

export interface Application extends BaseEntity {
  id: ApplicationId;
  unitId: UnitId;

  fullName: string;
  phone?: string;
  email?: string;

  submittedAt: ISODate;
  netMonthlyIncome?: MoneyEUR; // revenu mensuel net (DEMO)
  hasGuarantor?: boolean;

  status: ApplicationStatus;
  score?: number; // 0-100 (simple pour démo)
  notes?: string;
}

/** LEASE (bail) */
export type LeaseStatus = "Actif" | "Préavis" | "Terminé";

export interface Lease extends BaseEntity {
  id: LeaseId;
  unitId: UnitId;
  tenantId: TenantId;

  startDate: ISODate;
  endDate?: ISODate;

  status: LeaseStatus;

  monthlyRent?: MoneyEUR;      // loyer mensuel
  monthlyCharges?: MoneyEUR;   // charges mensuelles
  deposit?: MoneyEUR;          // dépôt de garantie
  dueDay?: number;             // 1-28

  leasePdfUrl?: string;
  inventoryPdfUrl?: string;    // état des lieux
  notes?: string;
}

/** PAYMENT */
export type PaymentMethod = "Virement" | "CB" | "Espèces" | "Chèque";
export type PaymentComputedStatus = "Payé" | "Partiel" | "Non payé" | "En retard";

export interface Payment extends BaseEntity {
  id: PaymentId;
  leaseId: LeaseId;

  period: YearMonth;           // "YYYY-MM"
  dueDate: ISODate;

  amountDue: MoneyEUR;
  amountPaid: MoneyEUR;
  paidAt?: ISODate;

  method?: PaymentMethod;

  // champs calculés (optionnels si on calcule à la volée)
  computedStatus?: PaymentComputedStatus;
  lateDays?: number;

  comment?: string;
}

/** MAINTENANCE (travaux) */
export type MaintenanceStatus = "Planifié" | "En cours" | "Terminé" | "Annulé";
export type InvoiceStatus = "Non payé" | "Payé" | "Partiel";

export interface Maintenance extends BaseEntity {
  id: MaintenanceId;

  // un travail peut être lié au bien OU au lot
  propertyId?: PropertyId;
  unitId?: UnitId;

  category: string;          // "Plomberie", "Électricité", etc.
  description: string;

  vendor?: string;           // prestataire
  requestedAt?: ISODate;
  plannedAt?: ISODate;
  completedAt?: ISODate;

  status: MaintenanceStatus;

  costEstimate?: MoneyEUR;
  costReal?: MoneyEUR;

  invoiceStatus?: InvoiceStatus;
  invoicePdfUrl?: string;

  photoBeforeUrl?: string;
  photoAfterUrl?: string;

  notes?: string;
}

/** CONTRACTS (HP, assurance, entretien...) */
export type ContractType = "HP" | "Assurance" | "Entretien" | "Syndic" | "Autre";
export type ContractComputedStatus = "OK" | "Expire <30j" | "Expiré";

export interface Contract extends BaseEntity {
  id: ContractId;

  propertyId?: PropertyId;
  unitId?: UnitId;

  type: ContractType;
  vendor: string;

  startDate?: ISODate;
  endDate?: ISODate;
  renewalDate?: ISODate;

  annualCost?: MoneyEUR;

  // calculé
  computedStatus?: ContractComputedStatus;

  contractPdfUrl?: string;
  notes?: string;
}

/** DOCUMENTS (checklist pièces + liens) */
export type DocumentType =
  | "CNI"
  | "Justif. domicile"
  | "Fiches de paie"
  | "Avis d'imposition"
  | "RIB"
  | "Attestation assurance"
  | "État des lieux"
  | "Autre";

export interface Document extends BaseEntity {
  id: DocumentId;

  scope: EntityScope;      // ex: "APPLICATION"
  relatedId: string;       // ex: ApplicationId / LeaseId etc.

  type: DocumentType;

  requested?: boolean;
  received?: boolean;
  verified?: boolean;

  receivedAt?: ISODate;
  expiresAt?: ISODate;

  fileUrl?: string;
  notes?: string;
}

/** Convenience unions */
export type AnyEntity =
  | Property
  | Unit
  | Tenant
  | Application
  | Lease
  | Payment
  | Maintenance
  | Contract
  | Document;
