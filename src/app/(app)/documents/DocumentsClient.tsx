"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { Document } from "@/domain/types";
import { DataTable } from "@/components/tables/DataTable";
import { documentColumns } from "@/components/tables/columns";
import { FilterButton } from "@/components/ui/FilterButton";
import { Modal } from "@/components/ui/Modal";
import { DocumentForm } from "@/components/forms";
import type { DocumentFormData } from "@/lib/validation";
import { generateId } from "@/lib/utils";

interface DocumentsClientProps {
  documents: Document[];
}

type FilterType = "all" | "received" | "missing" | "expired";

export function DocumentsClient({ documents: initialDocuments }: DocumentsClientProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const now = useMemo(() => new Date(), []);

  const filteredDocuments = useMemo(() => {
    switch (filter) {
      case "received":
        return documents.filter((d) => d.received);
      case "missing":
        return documents.filter((d) => d.requested && !d.received);
      case "expired":
        return documents.filter((d) => d.expiresAt && new Date(d.expiresAt) < now);
      default:
        return documents;
    }
  }, [documents, filter, now]);

  const counts = {
    all: documents.length,
    received: documents.filter((d) => d.received).length,
    missing: documents.filter((d) => d.requested && !d.received).length,
    expired: documents.filter((d) => d.expiresAt && new Date(d.expiresAt) < now).length,
  };

  const handleAddDocument = (data: DocumentFormData) => {
    const docNow = new Date().toISOString();
    const newDocument: Document = {
      id: generateId("D", documents.map((d) => d.id)),
      scope: data.scope,
      relatedId: data.relatedId,
      type: data.type,
      requested: data.requested,
      received: data.received,
      verified: data.verified,
      receivedAt: data.receivedAt,
      expiresAt: data.expiresAt,
      notes: data.notes,
      createdAt: docNow,
      updatedAt: docNow,
    };
    setDocuments([...documents, newDocument]);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau document
        </button>
      </div>
      <DataTable
        columns={documentColumns}
        data={filteredDocuments}
        searchPlaceholder="Rechercher un document..."
        filters={
          <>
            <FilterButton label="Tous" active={filter === "all"} onClick={() => setFilter("all")} count={counts.all} />
            <FilterButton label="Reçus" active={filter === "received"} onClick={() => setFilter("received")} count={counts.received} />
            <FilterButton label="Manquants" active={filter === "missing"} onClick={() => setFilter("missing")} count={counts.missing} />
            <FilterButton label="Expirés" active={filter === "expired"} onClick={() => setFilter("expired")} count={counts.expired} />
          </>
        }
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau document" size="md">
        <DocumentForm onSubmit={handleAddDocument} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
