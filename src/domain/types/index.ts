/**
 * Domain types - re-exported from DATA_MODEL.ts
 * This file serves as the main entry point for all domain types
 */

// Re-export everything from the original DATA_MODEL
export * from "../../../DATA_MODEL";

// Additional utility types for the application
export type AlertSeverity = "critical" | "warning" | "info";

export interface Alert {
  id: string;
  type: "contract_expiring" | "contract_expired" | "unit_vacant" | "payment_late" | "maintenance_overbudget" | "document_missing" | "document_expired";
  severity: AlertSeverity;
  title: string;
  description: string;
  link?: string;
  relatedId?: string;
}

export interface KpiData {
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  inWorksUnits: number;
  occupancyRate: number;
  rentBilled: number;
  rentCollected: number;
  unpaidRent: number;
  maintenanceCostYTD: number;
  netCashflow: number;
  /** Formule affichée dans le tooltip (ex: "encaissés − travaux/12") */
  netCashflowFormula?: string;
}

export interface MonthlyFinance {
  month: string; // YYYY-MM
  billed: number;
  collected: number;
}

export interface DashboardData {
  kpis: KpiData;
  alerts: Alert[];
  monthlyFinances: MonthlyFinance[];
}
