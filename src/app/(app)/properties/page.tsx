import { propertyMockRepo } from "@/domain/repositories";
import { PropertiesClient } from "./PropertiesClient";

export default async function PropertiesPage() {
  const properties = await propertyMockRepo.list();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Biens</h1>
        <p className="text-gray-500 mt-1">
          {properties.length} bien(s) dans le patrimoine
        </p>
      </div>

      <PropertiesClient properties={properties} />
    </div>
  );
}
