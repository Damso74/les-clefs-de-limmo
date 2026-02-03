import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatMonth,
  parseYearMonth,
  getLastMonths,
  daysBetween,
  addDays,
  formatDate,
} from "./dates";

describe("formatMonth", () => {
  it("formats YYYY-MM to French month and year with capital", () => {
    expect(formatMonth("2026-02")).toBe("Février 2026");
    expect(formatMonth("2025-01")).toBe("Janvier 2025");
    expect(formatMonth("2024-12")).toBe("Décembre 2024");
  });
});

describe("parseYearMonth", () => {
  it("accepts valid YYYY-MM", () => {
    expect(parseYearMonth("2026-02")).toBe("2026-02");
    expect(parseYearMonth("2025-12")).toBe("2025-12");
    expect(parseYearMonth("2024-01")).toBe("2024-01");
  });

  it("rejects invalid month", () => {
    expect(parseYearMonth("2026-00")).toBeNull();
    expect(parseYearMonth("2026-13")).toBeNull();
  });

  it("rejects invalid format", () => {
    expect(parseYearMonth("2026-2")).toBeNull();
    expect(parseYearMonth("26-02")).toBeNull();
    expect(parseYearMonth("")).toBeNull();
    expect(parseYearMonth(null)).toBeNull();
    expect(parseYearMonth(undefined)).toBeNull();
  });
});

describe("getLastMonths", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-15"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns last N months in ascending order", () => {
    const result = getLastMonths(3);
    expect(result).toEqual(["2025-12", "2026-01", "2026-02"]);
  });

  it("returns correct count", () => {
    expect(getLastMonths(1).length).toBe(1);
    expect(getLastMonths(12).length).toBe(12);
  });
});

describe("daysBetween", () => {
  it("returns positive days when date2 is after date1", () => {
    expect(daysBetween("2026-01-01", "2026-01-31")).toBe(30);
    expect(daysBetween("2026-02-01", "2026-02-10")).toBe(9);
  });

  it("returns negative days when date2 is before date1", () => {
    expect(daysBetween("2026-01-31", "2026-01-01")).toBe(-30);
  });

  it("returns 0 for same date", () => {
    expect(daysBetween("2026-02-15", "2026-02-15")).toBe(0);
  });
});

describe("addDays", () => {
  it("adds days correctly", () => {
    expect(addDays("2026-02-01", 10)).toBe("2026-02-11");
    expect(addDays("2026-01-25", 10)).toBe("2026-02-04");
  });

  it("subtracts when days is negative", () => {
    expect(addDays("2026-02-10", -5)).toBe("2026-02-05");
  });
});

describe("formatDate", () => {
  it("formats ISODate for display", () => {
    expect(formatDate("2026-02-15")).toMatch(/15\/02\/2026/);
  });

  it("returns em dash for undefined", () => {
    expect(formatDate(undefined)).toBe("—");
  });
});
