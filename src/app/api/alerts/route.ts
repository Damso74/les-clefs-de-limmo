import {
  unitMockRepo,
  paymentMockRepo,
  maintenanceMockRepo,
  contractMockRepo,
  documentMockRepo,
} from "@/domain/repositories";
import { getDashboardData } from "@/domain/services/dashboard.service";
import { currentMonth } from "@/lib/utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [units, payments, maintenance, contracts, documents] =
      await Promise.all([
        unitMockRepo.list(),
        paymentMockRepo.list(),
        maintenanceMockRepo.list(),
        contractMockRepo.list(),
        documentMockRepo.list(),
      ]);
    const selectedMonth = currentMonth();
    const dashboardData = getDashboardData(
      units,
      payments,
      maintenance,
      contracts,
      documents,
      selectedMonth
    );
    return NextResponse.json({ alerts: dashboardData.alerts });
  } catch (error) {
    console.error("API alerts:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des alertes" },
      { status: 500 }
    );
  }
}
