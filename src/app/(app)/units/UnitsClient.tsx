"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { Property, Unit } from "@/domain/types";
import { DataTable } from "@/components/tables/DataTable";
import { unitColumns } from "@/components/tables/columns";
import { FilterButton } from "@/components/ui/FilterButton";
import { Modal } from "@/components/ui/Modal";
import { UnitForm } from "@/components/forms";
import type { UnitFormData } from "@/lib/validation";
import { generateId } from "@/lib/utils";

interface UnitsClientProps {
  units: Unit[];
  properties: Property[];
}

type FilterType = "all" | "vacant" | "occupied" | "inWorks";

export function UnitsClient({ units: initialUnits, properties }: UnitsClientProps) {
  const [units, setUnits] = useState(initialUnits);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUnits = useMemo(() => {
    switch (filter) {
      case "vacant":
        return units.filter((u) => u.status === "Vacant");
      case "occupied":
        return units.filter((u) => u.status === "Occupé");
      case "inWorks":
        return units.filter((u) => u.status === "En travaux");
      default:
        return units;
    }
  }, [units, filter]);

  const counts = {
    all: units.length,
    vacant: units.filter((u) => u.status === "Vacant").length,
    occupied: units.filter((u) => u.status === "Occupé").length,
    inWorks: units.filter((u) => u.status === "En travaux").length,
  };

  const handleAddUnit = (data: UnitFormData) => {
    const now = new Date().toISOString();
    const newUnit: Unit = {
      id: generateId("U", units.map((u) => u.id)),
      propertyId: data.propertyId,
      label: data.label,
      type: data.type,
      floor: data.floor,
      rooms: data.rooms,
      areaM2: data.areaM2,
      targetRentExclCharges: data.targetRentExclCharges,
      monthlyCharges: data.monthlyCharges,
      status: data.status,
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };
    setUnits([...units, newUnit]);
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
          Nouveau lot
        </button>
      </div>
      <DataTable
        columns={unitColumns}
        data={filteredUnits}
        searchPlaceholder="Rechercher un lot..."
        filters={
          <>
            <FilterButton label="Tous" active={filter === "all"} onClick={() => setFilter("all")} count={counts.all} />
            <FilterButton label="Vacants" active={filter === "vacant"} onClick={() => setFilter("vacant")} count={counts.vacant} />
            <FilterButton label="Occupés" active={filter === "occupied"} onClick={() => setFilter("occupied")} count={counts.occupied} />
            <FilterButton label="En travaux" active={filter === "inWorks"} onClick={() => setFilter("inWorks")} count={counts.inWorks} />
          </>
        }
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau lot" size="md">
        <UnitForm properties={properties} onSubmit={handleAddUnit} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
