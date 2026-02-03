"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contractSchema, type ContractFormData } from "@/lib/validation";
import type { Property, Unit } from "@/domain/types";

interface ContractFormProps {
  properties: Property[];
  units: Unit[];
  onSubmit: (data: ContractFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<ContractFormData>;
}

export function ContractForm({
  properties,
  units,
  onSubmit,
  onCancel,
  defaultValues,
}: ContractFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      type: "Autre",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type *
        </label>
        <select
          {...register("type")}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="HP">HP (Hors-Période)</option>
          <option value="Assurance">Assurance</option>
          <option value="Entretien">Entretien</option>
          <option value="Syndic">Syndic</option>
          <option value="Autre">Autre</option>
        </select>
        {errors.type && (
          <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
        )}
      </div>

      {/* Vendor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prestataire *
        </label>
        <input
          type="text"
          {...register("vendor")}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.vendor && (
          <p className="text-red-500 text-sm mt-1">{errors.vendor.message}</p>
        )}
      </div>

      {/* Property */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bien associé
        </label>
        <select
          {...register("propertyId")}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">— Aucun —</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Unit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lot associé
        </label>
        <select
          {...register("unitId")}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">— Aucun —</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label} ({u.id})
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de début
          </label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de fin
          </label>
          <input
            type="date"
            {...register("endDate")}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Renewal Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date de renouvellement
        </label>
        <input
          type="date"
          {...register("renewalDate")}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Annual Cost */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Coût annuel (€)
        </label>
        <input
          type="number"
          step="0.01"
          {...register("annualCost", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          {...register("notes")}
          rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
