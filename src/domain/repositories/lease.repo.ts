import type { Lease, LeaseId, UnitId, TenantId } from "@/domain/types";

export interface LeaseRepository {
  list(): Promise<Lease[]>;
  getById(id: LeaseId): Promise<Lease | null>;
  getByUnitId(unitId: UnitId): Promise<Lease[]>;
  getActiveByUnitId(unitId: UnitId): Promise<Lease | null>;
  getByTenantId(tenantId: TenantId): Promise<Lease[]>;
}
