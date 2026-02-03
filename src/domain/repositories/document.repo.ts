import type { Document, DocumentId, EntityScope } from "@/domain/types";

export interface DocumentRepository {
  list(): Promise<Document[]>;
  getById(id: DocumentId): Promise<Document | null>;
  getByScope(scope: EntityScope, relatedId: string): Promise<Document[]>;
}
