import { contractMockRepo, propertyMockRepo, unitMockRepo } from "@/domain/repositories";
import { ContractsClient } from "./ContractsClient";

export default async function ContractsPage() {
  const [contracts, properties, units] = await Promise.all([
    contractMockRepo.list(),
    propertyMockRepo.list(),
    unitMockRepo.list(),
  ]);

  const stats = {
    total: contracts.length,
    hp: contracts.filter((c) => c.type === "HP").length,
    expiring: contracts.filter((c) => c.computedStatus === "Expire <30j").length,
    expired: contracts.filter((c) => c.computedStatus === "Expiré").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contrats</h1>
        <p className="text-gray-500 mt-1">
          {stats.total} contrat(s) • {stats.hp} HP • {stats.expiring + stats.expired} à renouveler
        </p>
      </div>

      <ContractsClient contracts={contracts} properties={properties} units={units} />
    </div>
  );
}
