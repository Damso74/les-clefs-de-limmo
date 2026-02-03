import { maintenanceMockRepo, propertyMockRepo, unitMockRepo } from "@/domain/repositories";
import { MaintenanceClient } from "./MaintenanceClient";

export default async function MaintenancePage() {
  const [maintenanceItems, properties, units] = await Promise.all([
    maintenanceMockRepo.list(),
    propertyMockRepo.list(),
    unitMockRepo.list(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Travaux</h1>
        <p className="text-gray-500 mt-1">
          {maintenanceItems.length} intervention(s) enregistrée(s)
        </p>
      </div>

      <MaintenanceClient items={maintenanceItems} properties={properties} units={units} />
    </div>
  );
}
