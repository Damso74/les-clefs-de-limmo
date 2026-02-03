import {
  unitMockRepo,
  paymentMockRepo,
  maintenanceMockRepo,
  contractMockRepo,
  documentMockRepo,
} from "@/domain/repositories";
import { getDashboardData } from "@/domain/services/dashboard.service";
import { currentMonth, parseYearMonth } from "@/lib/utils";
import { DashboardClient } from "./DashboardClient";

function parseOptionalInt(
  value: string | undefined,
  min: number,
  max: number,
  fallback: number
): number {
  if (value === undefined) return fallback;
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n < min || n > max) return fallback;
  return n;
}

interface DashboardPageProps {
  searchParams: Promise<{
    month?: string;
    vacantDays?: string;
    contractExpiryDays?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const selectedMonth =
    parseYearMonth(params.month) ?? currentMonth();
  const config = {
    vacantDaysThreshold: parseOptionalInt(
      params.vacantDays,
      1,
      365,
      30
    ),
    contractExpiryDays: parseOptionalInt(
      params.contractExpiryDays,
      1,
      180,
      30
    ),
  };

  const [units, payments, maintenance, contracts, documents] = await Promise.all([
    unitMockRepo.list(),
    paymentMockRepo.list(),
    maintenanceMockRepo.list(),
    contractMockRepo.list(),
    documentMockRepo.list(),
  ]);
  const dashboardData = getDashboardData(
    units,
    payments,
    maintenance,
    contracts,
    documents,
    selectedMonth,
    config
  );

  return (
    <DashboardClient
      kpis={dashboardData.kpis}
      alerts={dashboardData.alerts}
      monthlyFinances={dashboardData.monthlyFinances}
      selectedMonth={selectedMonth}
    />
  );
}
