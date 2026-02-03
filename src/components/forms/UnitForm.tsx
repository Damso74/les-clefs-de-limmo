"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { unitSchema, type UnitFormData } from "@/lib/validation";
import type { Property } from "@/domain/types";

interface UnitFormProps {
  properties: Property[];
  onSubmit: (data: UnitFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<UnitFormData>;
}

export function UnitForm({ properties, onSubmit, onCancel, defaultValues }: UnitFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: { status: "Vacant", type: "T2", ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bien *</label>
        <select
          {...register("propertyId")}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">— Sélectionner un bien —</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {errors.propertyId && <p className="text-red-500 text-sm mt-1">{errors.propertyId.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Libellé *</label>
        <input
          type="text"
          {...register("label")}
          placeholder="ex. Apt 1A, Lot 12"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.label && <p className="text-red-500 text-sm mt-1">{errors.label.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          <select {...register("type")} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Studio">Studio</option>
            <option value="T1">T1</option>
            <option value="T2">T2</option>
            <option value="T3">T3</option>
            <option value="T4">T4</option>
            <option value="T5+">T5+</option>
            <option value="Local">Local</option>
            <option value="Garage">Garage</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
          <select {...register("status")} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Vacant">Vacant</option>
            <option value="Occupé">Occupé</option>
            <option value="En travaux">En travaux</option>
            <option value="Indispo">Indispo</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Étage</label>
          <input type="number" {...register("floor", { setValueAs: (v) => (v === "" || Number.isNaN(Number(v)) ? undefined : Number(v)) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pièces</label>
          <input type="number" {...register("rooms", { setValueAs: (v) => (v === "" || Number.isNaN(Number(v)) ? undefined : Number(v)) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Surface (m²)</label>
          <input type="number" step="0.01" {...register("areaM2", { setValueAs: (v) => (v === "" || Number.isNaN(Number(v)) ? undefined : Number(v)) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loyer cible (€/mois)</label>
          <input type="number" step="1" {...register("targetRentExclCharges", { setValueAs: (v) => (v === "" || Number.isNaN(Number(v)) ? undefined : Number(v)) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Charges (€/mois)</label>
          <input type="number" step="1" {...register("monthlyCharges", { setValueAs: (v) => (v === "" || Number.isNaN(Number(v)) ? undefined : Number(v)) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea {...register("notes")} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Annuler</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
