import type { Tenant, TenantId } from "@/domain/types";

export interface TenantRepository {
  list(): Promise<Tenant[]>;
  getById(id: TenantId): Promise<Tenant | null>;
}
