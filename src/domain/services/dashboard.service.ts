/**
 * Dashboard Service
 * Calcule les KPI et génère les alertes pour le tableau de bord
 */

import type {
  Unit,
  Payment,
  Maintenance,
  Contract,
  Document,
  KpiData,
  Alert,
  MonthlyFinance,
  YearMonth,
} from "@/domain/types";
import { today, daysBetween, addDays, getLastMonths } from "@/lib/utils";

interface DashboardConfig {
  vacantDaysThreshold: number;
  contractExpiryDays: number;
}

const DEFAULT_CONFIG: DashboardConfig = {
  vacantDaysThreshold: 30,
  contractExpiryDays: 30,
};

/**
 * Compute KPIs for a given month
 */
export function computeKpis(
  units: Unit[],
  payments: Payment[],
  maintenance: Maintenance[],
  month: YearMonth
): KpiData {
  const totalUnits = units.length;
  const occupiedUnits = units.filter((u) => u.status === "Occupé").length;
  const occupancyRate =
    totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  // Filter payments for the selected month
  const monthPayments = payments.filter((p) => p.period === month);

  const rentBilled = monthPayments.reduce((sum, p) => sum + p.amountDue, 0);
  const rentCollected = monthPayments.reduce((sum, p) => sum + p.amountPaid, 0);
  const unpaidRent = rentBilled - rentCollected;

  // Maintenance cost YTD (current year)
  const currentYear = month.split("-")[0];
  const maintenanceCostYTD = maintenance
    .filter(
      (m) =>
        m.status === "Terminé" &&
        m.completedAt &&
        m.completedAt.startsWith(currentYear)
    )
    .reduce((sum, m) => sum + (m.costReal || 0), 0);

  // Simple cashflow calculation
  const netCashflow = rentCollected - maintenanceCostYTD / 12;

  return {
    totalUnits,
    occupiedUnits,
    occupancyRate,
    rentBilled,
    rentCollected,
    unpaidRent,
    maintenanceCostYTD,
    netCashflow,
  };
}

/**
 * Compute alerts based on current data
 */
export function computeAlerts(
  units: Unit[],
  payments: Payment[],
  maintenance: Maintenance[],
  contracts: Contract[],
  documents: Document[],
  config: DashboardConfig = DEFAULT_CONFIG
): Alert[] {
  const alerts: Alert[] = [];
  const todayStr = today();
  const threshold30Days = addDays(todayStr, config.contractExpiryDays);

  let alertId = 1;

  // Contract alerts
  contracts.forEach((contract) => {
    if (!contract.endDate) return;

    if (contract.endDate < todayStr) {
      alerts.push({
        id: `alert-${alertId++}`,
        type: "contract_expired",
        severity: "critical",
        title: `Contrat expiré: ${contract.vendor}`,
        description: `${contract.type} expiré depuis le ${contract.endDate}`,
        link: "/contracts",
        relatedId: contract.id,
      });
    } else if (contract.endDate <= threshold30Days) {
      alerts.push({
        id: `alert-${alertId++}`,
        type: "contract_expiring",
        severity: "warning",
        title: `Contrat expire bientôt: ${contract.vendor}`,
        description: `${contract.type} expire le ${contract.endDate}`,
        link: "/contracts",
        relatedId: contract.id,
      });
    }
  });

  // Vacant unit alerts
  units.forEach((unit) => {
    if (unit.status === "Vacant" && unit.vacantSince) {
      const daysVacant = daysBetween(unit.vacantSince, todayStr);
      if (daysVacant > config.vacantDaysThreshold) {
        alerts.push({
          id: `alert-${alertId++}`,
          type: "unit_vacant",
          severity: "warning",
          title: `Logement vacant: ${unit.label}`,
          description: `Vacant depuis ${daysVacant} jours`,
          link: `/units/${unit.id}`,
          relatedId: unit.id,
        });
      }
    }
  });

  // Payment late alerts
  payments.forEach((payment) => {
    if (
      payment.computedStatus === "En retard" ||
      (payment.dueDate < todayStr && payment.amountPaid < payment.amountDue)
    ) {
      const daysLate = daysBetween(payment.dueDate, todayStr);
      const amountDue = payment.amountDue - payment.amountPaid;
      alerts.push({
        id: `alert-${alertId++}`,
        type: "payment_late",
        severity: daysLate > 30 ? "critical" : "warning",
        title: `Impayé: ${payment.period}`,
        description: `${amountDue.toFixed(0)}€ en retard de ${daysLate} jours`,
        link: "/payments",
        relatedId: payment.id,
      });
    }
  });

  // Maintenance budget overrun alerts
  maintenance.forEach((m) => {
    if (
      m.status === "Terminé" &&
      m.costEstimate &&
      m.costReal &&
      m.costReal > m.costEstimate
    ) {
      const overrun = m.costReal - m.costEstimate;
      const overrunPercent = Math.round((overrun / m.costEstimate) * 100);
      if (overrunPercent > 10) {
        // Only alert if >10% overrun
        alerts.push({
          id: `alert-${alertId++}`,
          type: "maintenance_overbudget",
          severity: overrunPercent > 25 ? "warning" : "info",
          title: `Dépassement travaux: ${m.category}`,
          description: `+${overrun.toFixed(0)}€ (+${overrunPercent}%)`,
          link: "/maintenance",
          relatedId: m.id,
        });
      }
    }
  });

  // Document alerts
  documents.forEach((doc) => {
    if (doc.requested && !doc.received) {
      alerts.push({
        id: `alert-${alertId++}`,
        type: "document_missing",
        severity: "info",
        title: `Document manquant: ${doc.type}`,
        description: `${doc.scope} - En attente de réception`,
        link: "/documents",
        relatedId: doc.id,
      });
    }

    if (doc.expiresAt && doc.expiresAt < todayStr) {
      alerts.push({
        id: `alert-${alertId++}`,
        type: "document_expired",
        severity: "warning",
        title: `Document expiré: ${doc.type}`,
        description: `Expiré le ${doc.expiresAt}`,
        link: "/documents",
        relatedId: doc.id,
      });
    }
  });

  // Sort by severity (critical first, then warning, then info)
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return alerts;
}

/**
 * Compute monthly finances for the chart
 */
export function computeMonthlyFinances(
  payments: Payment[],
  months: YearMonth[]
): MonthlyFinance[] {
  return months.map((month) => {
    const monthPayments = payments.filter((p) => p.period === month);
    const billed = monthPayments.reduce((sum, p) => sum + p.amountDue, 0);
    const collected = monthPayments.reduce((sum, p) => sum + p.amountPaid, 0);
    return { month, billed, collected };
  });
}

/**
 * Get dashboard data (KPIs + alerts + chart data)
 */
export function getDashboardData(
  units: Unit[],
  payments: Payment[],
  maintenance: Maintenance[],
  contracts: Contract[],
  documents: Document[],
  selectedMonth: YearMonth,
  config?: Partial<DashboardConfig>
) {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const last3Months = getLastMonths(3);

  return {
    kpis: computeKpis(units, payments, maintenance, selectedMonth),
    alerts: computeAlerts(
      units,
      payments,
      maintenance,
      contracts,
      documents,
      fullConfig
    ),
    monthlyFinances: computeMonthlyFinances(payments, last3Months),
  };
}
