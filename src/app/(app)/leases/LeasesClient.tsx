"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { Lease, Unit, Tenant } from "@/domain/types";
import { DataTable } from "@/components/tables/DataTable";
import { leaseColumns } from "@/components/tables/columns";
import { FilterButton } from "@/components/ui/FilterButton";
import { Modal } from "@/components/ui/Modal";
import { LeaseForm } from "@/components/forms";
import type { LeaseFormData } from "@/lib/validation";
import { generateId } from "@/lib/utils";

export type LeaseWithTenantName = Lease & { tenantName: string };

interface LeasesClientProps {
  leases: LeaseWithTenantName[];
  units: Unit[];
  tenants: Tenant[];
}

type FilterType = "all" | "active" | "notice" | "terminated";

export function LeasesClient({ leases: initialLeases, units, tenants }: LeasesClientProps) {
  const [leases, setLeases] = useState(initialLeases);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tenantNameById = useMemo(
    () => Object.fromEntries(tenants.map((t) => [t.id, `${t.firstName} ${t.lastName}`.trim()])),
    [tenants]
  );

  const filteredLeases = useMemo(() => {
    switch (filter) {
      case "active":
        return leases.filter((l) => l.status === "Actif");
      case "notice":
        return leases.filter((l) => l.status === "Préavis");
      case "terminated":
        return leases.filter((l) => l.status === "Terminé");
      default:
        return leases;
    }
  }, [leases, filter]);

  const counts = {
    all: leases.length,
    active: leases.filter((l) => l.status === "Actif").length,
    notice: leases.filter((l) => l.status === "Préavis").length,
    terminated: leases.filter((l) => l.status === "Terminé").length,
  };

  const handleAddLease = (data: LeaseFormData) => {
    const now = new Date().toISOString();
    const newLease: LeaseWithTenantName = {
      id: generateId("L", leases.map((l) => l.id)),
      unitId: data.unitId,
      tenantId: data.tenantId,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      monthlyRent: data.monthlyRent,
      monthlyCharges: data.monthlyCharges,
      deposit: data.deposit,
      dueDay: data.dueDay,
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
      tenantName: tenantNameById[data.tenantId] ?? data.tenantId,
    };
    setLeases([...leases, newLease]);
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
          Nouveau bail
        </button>
      </div>
      <DataTable
        columns={leaseColumns}
        data={filteredLeases}
        searchPlaceholder="Rechercher un bail..."
        filters={
          <>
            <FilterButton label="Tous" active={filter === "all"} onClick={() => setFilter("all")} count={counts.all} />
            <FilterButton label="Actifs" active={filter === "active"} onClick={() => setFilter("active")} count={counts.active} />
            <FilterButton label="Préavis" active={filter === "notice"} onClick={() => setFilter("notice")} count={counts.notice} />
            <FilterButton label="Terminés" active={filter === "terminated"} onClick={() => setFilter("terminated")} count={counts.terminated} />
          </>
        }
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau bail" size="md">
        <LeaseForm units={units} tenants={tenants} onSubmit={handleAddLease} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
