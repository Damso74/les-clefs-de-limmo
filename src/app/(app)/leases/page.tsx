import { leaseMockRepo, tenantMockRepo, unitMockRepo } from "@/domain/repositories";
import type { TenantId } from "@/domain/types";
import { LeasesClient } from "./LeasesClient";

export default async function LeasesPage() {
  const [leases, tenants, units] = await Promise.all([
    leaseMockRepo.list(),
    tenantMockRepo.list(),
    unitMockRepo.list(),
  ]);

  const tenantNameById: Record<TenantId, string> = Object.fromEntries(
    tenants.map((t) => [t.id, `${t.firstName} ${t.lastName}`.trim()])
  );

  const leasesWithTenantNames = leases.map((l) => ({
    ...l,
    tenantName: tenantNameById[l.tenantId] ?? l.tenantId,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Baux</h1>
        <p className="text-gray-500 mt-1">
          {leases.length} bail(aux) enregistré(s)
        </p>
      </div>

      <LeasesClient leases={leasesWithTenantNames} units={units} tenants={tenants} />
    </div>
  );
}
