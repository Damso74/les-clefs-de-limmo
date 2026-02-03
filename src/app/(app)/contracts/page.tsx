import { contractMockRepo, propertyMockRepo, unitMockRepo } from "@/domain/repositories";
import { getContractRenewalStatus } from "@/domain/services/dashboard.service";
import { ContractsClient } from "./ContractsClient";

const CONTRACT_EXPIRY_DAYS = 30;

export default async function ContractsPage() {
  const [contractsRaw, properties, units] = await Promise.all([
    contractMockRepo.list(),
    propertyMockRepo.list(),
    unitMockRepo.list(),
  ]);

  const contracts = contractsRaw.map((c) => ({
    ...c,
    computedStatus: getContractRenewalStatus(c, CONTRACT_EXPIRY_DAYS),
  }));

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
