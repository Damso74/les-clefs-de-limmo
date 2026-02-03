import { unitMockRepo, propertyMockRepo } from "@/domain/repositories";
import { UnitsClient } from "./UnitsClient";

export default async function UnitsPage() {
  const [units, properties] = await Promise.all([
    unitMockRepo.list(),
    propertyMockRepo.list(),
  ]);

  const stats = {
    total: units.length,
    occupied: units.filter((u) => u.status === "Occupé").length,
    vacant: units.filter((u) => u.status === "Vacant").length,
    inWorks: units.filter((u) => u.status === "En travaux").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lots</h1>
        <p className="text-gray-500 mt-1">
          {stats.total} lot(s) • {stats.occupied} occupé(s) • {stats.vacant} vacant(s) • {stats.inWorks} en travaux
        </p>
      </div>

      <UnitsClient units={units} properties={properties} />
    </div>
  );
}
