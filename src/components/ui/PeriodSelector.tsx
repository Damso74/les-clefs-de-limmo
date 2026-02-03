"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";
import type { YearMonth } from "@/domain/types";
import { formatMonth, getLastMonths } from "@/lib/utils";

const PERIOD_PARAM = "month";

interface PeriodSelectorProps {
  selectedMonth: YearMonth;
  /** Nombre de mois passés à proposer (défaut: 24) */
  pastMonthsCount?: number;
  /** Inclure quelques mois futurs dans la liste (défaut: 3) */
  futureMonthsCount?: number;
  /** Variante d'affichage: "badge" (compact) ou "dropdown" (select visible) */
  variant?: "badge" | "dropdown";
  className?: string;
}

function getAvailableMonths(
  selectedMonth: YearMonth,
  pastCount: number,
  futureCount: number
): YearMonth[] {
  const past = getLastMonths(pastCount);
  const set = new Set<YearMonth>(past);
  set.add(selectedMonth);

  const [y, m] = selectedMonth.split("-").map(Number);
  const current = new Date();
  const selectedDate = new Date(y, m - 1);

  if (selectedDate > current) {
    for (let i = 1; i <= futureCount; i++) {
      const d = new Date(current.getFullYear(), current.getMonth() + i);
      const ym: YearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      set.add(ym);
    }
  }

  return Array.from(set).sort();
}

export function PeriodSelector({
  selectedMonth,
  pastMonthsCount = 24,
  futureMonthsCount = 3,
  variant = "dropdown",
  className = "",
}: PeriodSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const availableMonths = getAvailableMonths(
    selectedMonth,
    pastMonthsCount,
    futureMonthsCount
  );

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(PERIOD_PARAM, value);
    } else {
      params.delete(PERIOD_PARAM);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const label = formatMonth(selectedMonth);

  if (variant === "badge") {
    return (
      <div
        className={`flex items-center gap-2 text-sm ${className}`}
        title="Période affichée"
      >
        <span className="text-gray-500">Période</span>
        <span className="font-medium inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg">
          <Calendar className="w-4 h-4 opacity-80" aria-hidden />
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <label
        htmlFor="period-select"
        className="flex items-center gap-1.5 text-sm text-gray-600 shrink-0"
      >
        <Calendar className="w-4 h-4 text-gray-500" aria-hidden />
        <span>Période</span>
      </label>
      <select
        id="period-select"
        value={selectedMonth}
        onChange={(e) => handleChange(e.target.value)}
        className="min-w-[180px] px-3 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
        aria-label="Choisir la période (mois)"
      >
        {availableMonths.map((ym) => (
          <option key={ym} value={ym}>
            {formatMonth(ym)}
          </option>
        ))}
      </select>
    </div>
  );
}
