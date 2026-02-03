import { tenantMockRepo } from "@/domain/repositories";
import { TenantsClient } from "./TenantsClient";

export default async function TenantsPage() {
  const tenants = await tenantMockRepo.list();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Locataires</h1>
        <p className="text-gray-500 mt-1">
          {tenants.length} locataire(s) enregistré(s)
        </p>
      </div>

      <TenantsClient tenants={tenants} />
    </div>
  );
}
