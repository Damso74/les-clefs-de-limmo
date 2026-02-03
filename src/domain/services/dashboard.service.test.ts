import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  computeKpis,
  computeAlerts,
  getDashboardData,
  computeMonthlyFinances,
} from "./dashboard.service";
import type { Unit, Payment, Maintenance, Contract, Document } from "@/domain/types";

const baseEntity = {
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("computeKpis", () => {
  it("computes total and occupied units", () => {
    const units: Unit[] = [
      { ...baseEntity, id: "U0001", propertyId: "P0001", label: "A1", type: "T2", status: "Occupé" },
      { ...baseEntity, id: "U0002", propertyId: "P0001", label: "A2", type: "T2", status: "Vacant" },
    ];
    const payments: Payment[] = [];
    const maintenance: Maintenance[] = [];
    const kpis = computeKpis(units, payments, maintenance, "2026-02");
    expect(kpis.totalUnits).toBe(2);
    expect(kpis.occupiedUnits).toBe(1);
    expect(kpis.occupancyRate).toBe(50);
  });

  it("aggregates rent billed and collected for the selected month", () => {
    const units: Unit[] = [
      { ...baseEntity, id: "U0001", propertyId: "P0001", label: "A1", type: "T2", status: "Occupé" },
    ];
    const payments: Payment[] = [
      {
        ...baseEntity,
        id: "PM0001",
        leaseId: "L0001",
        period: "2026-02",
        dueDate: "2026-02-05",
        amountDue: 600,
        amountPaid: 600,
        method: "Virement",
      },
      {
        ...baseEntity,
        id: "PM0002",
        leaseId: "L0002",
        period: "2026-02",
        dueDate: "2026-02-05",
        amountDue: 400,
        amountPaid: 200,
        method: "Virement",
      },
    ];
    const maintenance: Maintenance[] = [];
    const kpis = computeKpis(units, payments, maintenance, "2026-02");
    expect(kpis.rentBilled).toBe(1000);
    expect(kpis.rentCollected).toBe(800);
    expect(kpis.unpaidRent).toBe(200);
  });

  it("ignores payments from other months", () => {
    const units: Unit[] = [
      { ...baseEntity, id: "U0001", propertyId: "P0001", label: "A1", type: "T2", status: "Occupé" },
    ];
    const payments: Payment[] = [
      {
        ...baseEntity,
        id: "PM0001",
        leaseId: "L0001",
        period: "2026-01",
        dueDate: "2026-01-05",
        amountDue: 600,
        amountPaid: 600,
        method: "Virement",
      },
    ];
    const maintenance: Maintenance[] = [];
    const kpis = computeKpis(units, payments, maintenance, "2026-02");
    expect(kpis.rentBilled).toBe(0);
    expect(kpis.rentCollected).toBe(0);
  });
});

describe("computeAlerts", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-15"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns contract_expired for past endDate", () => {
    const contracts: Contract[] = [
      {
        ...baseEntity,
        id: "C0001",
        type: "HP",
        vendor: "Test",
        endDate: "2026-01-01",
      },
    ];
    const alerts = computeAlerts([], [], [], contracts, []);
    expect(alerts.some((a) => a.type === "contract_expired")).toBe(true);
    expect(alerts.some((a) => a.title.includes("Test"))).toBe(true);
  });

  it("respects vacantDaysThreshold: no alert when vacancy days below threshold", () => {
    const units: Unit[] = [
      {
        ...baseEntity,
        id: "U0001",
        propertyId: "P0001",
        label: "A1",
        type: "T2",
        status: "Vacant",
        vacantSince: "2026-02-01", // 14 days ago
      },
    ];
    const alertsDefault = computeAlerts(units, [], [], [], [], { vacantDaysThreshold: 30, contractExpiryDays: 30 });
    expect(alertsDefault.some((a) => a.type === "unit_vacant")).toBe(false);

    const alertsStrict = computeAlerts(units, [], [], [], [], { vacantDaysThreshold: 10, contractExpiryDays: 30 });
    expect(alertsStrict.some((a) => a.type === "unit_vacant")).toBe(true);
  });

  it("respects contractExpiryDays for expiring soon", () => {
    const contracts: Contract[] = [
      {
        ...baseEntity,
        id: "C0001",
        type: "Assurance",
        vendor: "AssurCo",
        endDate: "2026-02-20", // 5 days from "today" 2026-02-15
      },
    ];
    const alerts30 = computeAlerts([], [], [], contracts, [], { vacantDaysThreshold: 30, contractExpiryDays: 30 });
    expect(alerts30.some((a) => a.type === "contract_expiring")).toBe(true);

    const alerts5 = computeAlerts([], [], [], contracts, [], { vacantDaysThreshold: 30, contractExpiryDays: 5 });
    expect(alerts5.some((a) => a.type === "contract_expiring")).toBe(true);

    const alerts2 = computeAlerts([], [], [], contracts, [], { vacantDaysThreshold: 30, contractExpiryDays: 2 });
    expect(alerts2.some((a) => a.type === "contract_expiring")).toBe(false);
  });
});

describe("computeMonthlyFinances", () => {
  it("aggregates billed and collected per month", () => {
    const payments: Payment[] = [
      {
        ...baseEntity,
        id: "PM1",
        leaseId: "L1",
        period: "2026-01",
        dueDate: "2026-01-05",
        amountDue: 500,
        amountPaid: 500,
      },
      {
        ...baseEntity,
        id: "PM2",
        leaseId: "L2",
        period: "2026-01",
        dueDate: "2026-01-05",
        amountDue: 300,
        amountPaid: 100,
      },
    ];
    const result = computeMonthlyFinances(payments, ["2026-01", "2026-02"]);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ month: "2026-01", billed: 800, collected: 600 });
    expect(result[1]).toEqual({ month: "2026-02", billed: 0, collected: 0 });
  });
});

describe("getDashboardData", () => {
  it("passes config to computeAlerts", () => {
    const units: Unit[] = [
      {
        ...baseEntity,
        id: "U0001",
        propertyId: "P0001",
        label: "A1",
        type: "T2",
        status: "Vacant",
        vacantSince: "2025-11-01",
      },
    ];
    const dataDefault = getDashboardData(units, [], [], [], [], "2026-02");
    const dataStrict = getDashboardData(units, [], [], [], [], "2026-02", {
      vacantDaysThreshold: 200,
      contractExpiryDays: 30,
    });
    const vacantDefault = dataDefault.alerts.filter((a) => a.type === "unit_vacant");
    const vacantStrict = dataStrict.alerts.filter((a) => a.type === "unit_vacant");
    expect(vacantDefault.length).toBeGreaterThan(0);
    expect(vacantStrict.length).toBe(0);
  });
});
