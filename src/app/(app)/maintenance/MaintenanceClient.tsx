"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { Maintenance, Property, Unit } from "@/domain/types";
import { DataTable } from "@/components/tables/DataTable";
import { maintenanceColumns } from "@/components/tables/columns";
import { FilterButton } from "@/components/ui/FilterButton";
import { Modal } from "@/components/ui/Modal";
import { MaintenanceForm } from "@/components/forms";
import type { MaintenanceFormData } from "@/lib/validation";

interface MaintenanceClientProps {
  items: Maintenance[];
  properties: Property[];
  units: Unit[];
}

type FilterType = "all" | "planned" | "inProgress" | "completed";

export function MaintenanceClient({ items: initialItems, properties, units }: MaintenanceClientProps) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    switch (filter) {
      case "planned":
        return items.filter((m) => m.status === "Planifié");
      case "inProgress":
        return items.filter((m) => m.status === "En cours");
      case "completed":
        return items.filter((m) => m.status === "Terminé");
      default:
        return items;
    }
  }, [items, filter]);

  const counts = {
    all: items.length,
    planned: items.filter((m) => m.status === "Planifié").length,
    inProgress: items.filter((m) => m.status === "En cours").length,
    completed: items.filter((m) => m.status === "Terminé").length,
  };

  const handleAddMaintenance = (data: MaintenanceFormData) => {
    const newItem: Maintenance = {
      id: `W${String(items.length + 1).padStart(4, "0")}`,
      propertyId: data.propertyId || undefined,
      unitId: data.unitId || undefined,
      category: data.category,
      description: data.description,
      vendor: data.vendor,
      requestedAt: new Date().toISOString().split("T")[0],
      plannedAt: data.plannedAt,
      completedAt: data.completedAt,
      status: data.status,
      costEstimate: data.costEstimate,
      costReal: data.costReal,
      invoiceStatus: data.invoiceStatus,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems([...items, newItem]);
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
          Ajouter un travail
        </button>
      </div>

      <DataTable
        columns={maintenanceColumns}
        data={filteredItems}
        searchPlaceholder="Rechercher un travail..."
        filters={
          <>
            <FilterButton
              label="Tous"
              active={filter === "all"}
              onClick={() => setFilter("all")}
              count={counts.all}
            />
            <FilterButton
              label="Planifiés"
              active={filter === "planned"}
              onClick={() => setFilter("planned")}
              count={counts.planned}
            />
            <FilterButton
              label="En cours"
              active={filter === "inProgress"}
              onClick={() => setFilter("inProgress")}
              count={counts.inProgress}
            />
            <FilterButton
              label="Terminés"
              active={filter === "completed"}
              onClick={() => setFilter("completed")}
              count={counts.completed}
            />
          </>
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un travail"
        size="lg"
      >
        <MaintenanceForm
          properties={properties}
          units={units}
          onSubmit={handleAddMaintenance}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
