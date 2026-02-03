import type { Tenant, TenantId } from "@/domain/types";
import type { TenantRepository } from "../tenant.repo";
import { tenants } from "@/lib/mock/data";

class TenantMockRepository implements TenantRepository {
  private data: Tenant[] = [...tenants];

  async list(): Promise<Tenant[]> {
    return this.data;
  }

  async getById(id: TenantId): Promise<Tenant | null> {
    return this.data.find((t) => t.id === id) ?? null;
  }
}

export const tenantMockRepo = new TenantMockRepository();
