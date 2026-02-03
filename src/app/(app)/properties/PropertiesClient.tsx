"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Property } from "@/domain/types";
import { DataTable } from "@/components/tables/DataTable";
import { propertyColumns } from "@/components/tables/columns";
import { Modal } from "@/components/ui/Modal";
import { PropertyForm } from "@/components/forms";
import type { PropertyFormData } from "@/lib/validation";
import { generateId } from "@/lib/utils";

interface PropertiesClientProps {
  properties: Property[];
}

export function PropertiesClient({ properties: initialProperties }: PropertiesClientProps) {
  const [properties, setProperties] = useState(initialProperties);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProperty = (data: PropertyFormData) => {
    const now = new Date().toISOString();
    const newProperty: Property = {
      id: generateId("P", properties.map((p) => p.id)),
      name: data.name,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      type: data.type,
      purchaseDate: data.purchaseDate,
      purchasePrice: data.purchasePrice,
      estimatedValue: data.estimatedValue,
      annualPropertyTax: data.annualPropertyTax,
      annualCharges: data.annualCharges,
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };
    setProperties([...properties, newProperty]);
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
          Nouveau bien
        </button>
      </div>
      <DataTable
        columns={propertyColumns}
        data={properties}
        searchPlaceholder="Rechercher un bien..."
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau bien" size="md">
        <PropertyForm onSubmit={handleAddProperty} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
