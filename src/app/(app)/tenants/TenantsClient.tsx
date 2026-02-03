"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Tenant } from "@/domain/types";
import { DataTable } from "@/components/tables/DataTable";
import { tenantColumns } from "@/components/tables/columns";
import { Modal } from "@/components/ui/Modal";
import { TenantForm } from "@/components/forms";
import type { TenantFormData } from "@/lib/validation";
import { generateId } from "@/lib/utils";

interface TenantsClientProps {
  tenants: Tenant[];
}

export function TenantsClient({ tenants: initialTenants }: TenantsClientProps) {
  const [tenants, setTenants] = useState(initialTenants);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTenant = (data: TenantFormData) => {
    const now = new Date().toISOString();
    const newTenant: Tenant = {
      id: generateId("T", tenants.map((t) => t.id)),
      lastName: data.lastName,
      firstName: data.firstName,
      phone: data.phone || undefined,
      email: data.email && data.email.trim() ? data.email : undefined,
      birthDate: data.birthDate,
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };
    setTenants([...tenants, newTenant]);
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
          Nouveau locataire
        </button>
      </div>
      <DataTable columns={tenantColumns} data={tenants} searchPlaceholder="Rechercher un locataire..." />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau locataire" size="md">
        <TenantForm onSubmit={handleAddTenant} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
