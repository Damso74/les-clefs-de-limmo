import type { Document, DocumentId, EntityScope } from "@/domain/types";
import type { DocumentRepository } from "../document.repo";
import { documents } from "@/lib/mock/data";

class DocumentMockRepository implements DocumentRepository {
  private data: Document[] = [...documents];

  async list(): Promise<Document[]> {
    return this.data;
  }

  async getById(id: DocumentId): Promise<Document | null> {
    return this.data.find((d) => d.id === id) ?? null;
  }

  async getByScope(scope: EntityScope, relatedId: string): Promise<Document[]> {
    return this.data.filter((d) => d.scope === scope && d.relatedId === relatedId);
  }
}

export const documentMockRepo = new DocumentMockRepository();
