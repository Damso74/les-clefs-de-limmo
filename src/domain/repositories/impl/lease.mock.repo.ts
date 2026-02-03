import type { Lease, LeaseId, UnitId, TenantId } from "@/domain/types";
import type { LeaseRepository } from "../lease.repo";
import { leases } from "@/lib/mock/data";

class LeaseMockRepository implements LeaseRepository {
  private data: Lease[] = [...leases];

  async list(): Promise<Lease[]> {
    return this.data;
  }

  async getById(id: LeaseId): Promise<Lease | null> {
    return this.data.find((l) => l.id === id) ?? null;
  }

  async getByUnitId(unitId: UnitId): Promise<Lease[]> {
    return this.data.filter((l) => l.unitId === unitId);
  }

  async getActiveByUnitId(unitId: UnitId): Promise<Lease | null> {
    return this.data.find((l) => l.unitId === unitId && l.status === "Actif") ?? null;
  }

  async getByTenantId(tenantId: TenantId): Promise<Lease[]> {
    return this.data.filter((l) => l.tenantId === tenantId);
  }
}

export const leaseMockRepo = new LeaseMockRepository();
