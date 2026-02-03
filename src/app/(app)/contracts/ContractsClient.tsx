"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { Contract, Property, Unit } from "@/domain/types";
import { DataTable } from "@/components/tables/DataTable";
import { contractColumns } from "@/components/tables/columns";
import { FilterButton } from "@/components/ui/FilterButton";
import { Modal } from "@/components/ui/Modal";
import { ContractForm } from "@/components/forms";
import type { ContractFormData } from "@/lib/validation";

interface ContractsClientProps {
  contracts: Contract[];
  properties: Property[];
  units: Unit[];
}

type FilterType = "all" | "hp" | "expiring" | "expired";

export function ContractsClient({ contracts: initialContracts, properties, units }: ContractsClientProps) {
  const [contracts, setContracts] = useState(initialContracts);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredContracts = useMemo(() => {
    switch (filter) {
      case "hp":
        return contracts.filter((c) => c.type === "HP");
      case "expiring":
        return contracts.filter((c) => c.computedStatus === "Expire <30j");
      case "expired":
        return contracts.filter((c) => c.computedStatus === "Expiré");
      default:
        return contracts;
    }
  }, [contracts, filter]);

  const counts = {
    all: contracts.length,
    hp: contracts.filter((c) => c.type === "HP").length,
    expiring: contracts.filter((c) => c.computedStatus === "Expire <30j").length,
    expired: contracts.filter((c) => c.computedStatus === "Expiré").length,
  };

  const handleAddContract = (data: ContractFormData) => {
    // Compute status based on dates
    const today = new Date().toISOString().split("T")[0];
    const threshold30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    let computedStatus: "OK" | "Expire <30j" | "Expiré" = "OK";
    if (data.endDate) {
      if (data.endDate < today) {
        computedStatus = "Expiré";
      } else if (data.endDate <= threshold30Days) {
        computedStatus = "Expire <30j";
      }
    }

    const newContract: Contract = {
      id: `C${String(contracts.length + 1).padStart(4, "0")}`,
      propertyId: data.propertyId || undefined,
      unitId: data.unitId || undefined,
      type: data.type,
      vendor: data.vendor,
      startDate: data.startDate,
      endDate: data.endDate,
      renewalDate: data.renewalDate,
      annualCost: data.annualCost,
      computedStatus,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setContracts([...contracts, newContract]);
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
          Ajouter un contrat
        </button>
      </div>

      <DataTable
        columns={contractColumns}
        data={filteredContracts}
        searchPlaceholder="Rechercher un contrat..."
        filters={
          <>
            <FilterButton
              label="Tous"
              active={filter === "all"}
              onClick={() => setFilter("all")}
              count={counts.all}
            />
            <FilterButton
              label="HP"
              active={filter === "hp"}
              onClick={() => setFilter("hp")}
              count={counts.hp}
            />
            <FilterButton
              label="Expire <30j"
              active={filter === "expiring"}
              onClick={() => setFilter("expiring")}
              count={counts.expiring}
            />
            <FilterButton
              label="Expiré"
              active={filter === "expired"}
              onClick={() => setFilter("expired")}
              count={counts.expired}
            />
          </>
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un contrat"
        size="md"
      >
        <ContractForm
          properties={properties}
          units={units}
          onSubmit={handleAddContract}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
