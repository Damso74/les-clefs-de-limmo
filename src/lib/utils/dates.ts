import type { ISODate, YearMonth } from "@/domain/types";

/**
 * Get today's date as ISODate string
 */
export function today(): ISODate {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get current month as YearMonth string
 */
export function currentMonth(): YearMonth {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Add days to a date
 */
export function addDays(date: ISODate, days: number): ISODate {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

/**
 * Get the difference in days between two dates
 */
export function daysBetween(date1: ISODate, date2: ISODate): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if date1 is before date2
 */
export function isBefore(date1: ISODate, date2: ISODate): boolean {
  return new Date(date1) < new Date(date2);
}

/**
 * Check if date1 is after date2
 */
export function isAfter(date1: ISODate, date2: ISODate): boolean {
  return new Date(date1) > new Date(date2);
}

/**
 * Format ISODate for display (French locale)
 */
export function formatDate(date: ISODate | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Format YearMonth for display (e.g. "Février 2026")
 */
export function formatMonth(yearMonth: YearMonth): string {
  const [year, month] = yearMonth.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  const str = date.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Parse and validate a YearMonth string (YYYY-MM).
 * Returns the string if valid, null otherwise.
 */
export function parseYearMonth(value: string | null | undefined): YearMonth | null {
  if (!value || typeof value !== "string") return null;
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;
  const [, year, month] = match;
  const m = parseInt(month, 10);
  if (m < 1 || m > 12) return null;
  return value as YearMonth;
}

/**
 * Get last N months as YearMonth array
 */
export function getLastMonths(count: number): YearMonth[] {
  const months: YearMonth[] = [];
  const d = new Date();
  
  for (let i = 0; i < count; i++) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    months.unshift(`${year}-${month}`);
    d.setMonth(d.getMonth() - 1);
  }
  
  return months;
}
