import type { MoneyEUR } from "@/domain/types";

/**
 * Format money amount for display (EUR)
 */
export function formatMoney(amount: MoneyEUR | undefined): string {
  if (amount === undefined || amount === null) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format compact money (K, M)
 */
export function formatMoneyCompact(amount: MoneyEUR | undefined): string {
  if (amount === undefined || amount === null) return "—";
  
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M €`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K €`;
  }
  return formatMoney(amount);
}

/**
 * Calculate percentage
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number): string {
  return `${value}%`;
}
