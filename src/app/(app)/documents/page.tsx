import { documentMockRepo } from "@/domain/repositories";
import { DocumentsClient } from "./DocumentsClient";

export default async function DocumentsPage() {
  const documents = await documentMockRepo.list();

  const stats = {
    total: documents.length,
    received: documents.filter((d) => d.received).length,
    missing: documents.filter((d) => d.requested && !d.received).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-500 mt-1">
          {stats.total} document(s) • {stats.received} reçu(s) • {stats.missing} manquant(s)
        </p>
      </div>

      <DocumentsClient documents={documents} />
    </div>
  );
}
