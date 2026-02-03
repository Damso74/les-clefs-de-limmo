"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { Application, Unit } from "@/domain/types";
import { DataTable } from "@/components/tables/DataTable";
import { applicationColumns } from "@/components/tables/columns";
import { FilterButton } from "@/components/ui/FilterButton";
import { Modal } from "@/components/ui/Modal";
import { ApplicationForm } from "@/components/forms";
import type { ApplicationFormData } from "@/lib/validation";
import { generateId } from "@/lib/utils";

interface ApplicationsClientProps {
  applications: Application[];
  units: Unit[];
}

type FilterType = "all" | "new" | "inAnalysis" | "approved" | "rejected";

export function ApplicationsClient({ applications: initialApplications, units }: ApplicationsClientProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredApplications = useMemo(() => {
    switch (filter) {
      case "new":
        return applications.filter((a) => a.status === "Nouveau");
      case "inAnalysis":
        return applications.filter((a) => a.status === "En analyse");
      case "approved":
        return applications.filter((a) => a.status === "Approuvé");
      case "rejected":
        return applications.filter((a) => a.status === "Refusé");
      default:
        return applications;
    }
  }, [applications, filter]);

  const counts = {
    all: applications.length,
    new: applications.filter((a) => a.status === "Nouveau").length,
    inAnalysis: applications.filter((a) => a.status === "En analyse").length,
    approved: applications.filter((a) => a.status === "Approuvé").length,
    rejected: applications.filter((a) => a.status === "Refusé").length,
  };

  const handleAddApplication = (data: ApplicationFormData) => {
    const now = new Date().toISOString();
    const newApplication: Application = {
      id: generateId("A", applications.map((a) => a.id)),
      unitId: data.unitId,
      fullName: data.fullName,
      phone: data.phone || undefined,
      email: data.email && data.email.trim() ? data.email : undefined,
      submittedAt: data.submittedAt,
      netMonthlyIncome: data.netMonthlyIncome,
      hasGuarantor: data.hasGuarantor ?? false,
      status: "Nouveau",
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };
    setApplications([...applications, newApplication]);
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
          Nouvelle candidature
        </button>
      </div>

      <DataTable
        columns={applicationColumns}
        data={filteredApplications}
        searchPlaceholder="Rechercher une candidature..."
        filters={
          <>
            <FilterButton
              label="Toutes"
              active={filter === "all"}
              onClick={() => setFilter("all")}
              count={counts.all}
            />
            <FilterButton
              label="Nouvelles"
              active={filter === "new"}
              onClick={() => setFilter("new")}
              count={counts.new}
            />
            <FilterButton
              label="En analyse"
              active={filter === "inAnalysis"}
              onClick={() => setFilter("inAnalysis")}
              count={counts.inAnalysis}
            />
            <FilterButton
              label="Approuvées"
              active={filter === "approved"}
              onClick={() => setFilter("approved")}
              count={counts.approved}
            />
          </>
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvelle candidature"
        size="md"
      >
        <ApplicationForm
          units={units}
          onSubmit={handleAddApplication}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
