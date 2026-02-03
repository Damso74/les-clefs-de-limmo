import { applicationMockRepo, unitMockRepo } from "@/domain/repositories";
import { ApplicationsClient } from "./ApplicationsClient";

export default async function ApplicationsPage() {
  const [applications, units] = await Promise.all([
    applicationMockRepo.list(),
    unitMockRepo.list(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Candidatures</h1>
        <p className="text-gray-500 mt-1">
          {applications.length} candidature(s) enregistrée(s)
        </p>
      </div>

      <ApplicationsClient applications={applications} units={units} />
    </div>
  );
}
