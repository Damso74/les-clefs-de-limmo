"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leaseSchema, type LeaseFormData } from "@/lib/validation";
import type { Unit, Tenant } from "@/domain/types";

interface LeaseFormProps {
  units: Unit[];
  tenants: Tenant[];
  onSubmit: (data: LeaseFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<LeaseFormData>;
}

export function LeaseForm({ units, tenants, onSubmit, onCancel, defaultValues }: LeaseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeaseFormData>({
    resolver: zodResolver(leaseSchema),
    defaultValues: { status: "Actif", ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Lot *</label>
        <select {...register("unitId")} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">— Sélectionner un lot —</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>{u.label} ({u.id})</option>
          ))}
        </select>
        {errors.unitId && <p className="text-red-500 text-sm mt-1">{errors.unitId.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Locataire *</label>
        <select {...register("tenantId")} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">— Sélectionner un locataire —</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
          ))}
        </select>
        {errors.tenantId && <p className="text-red-500 text-sm mt-1">{errors.tenantId.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
          <input type="date" {...register("startDate")} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
          <input type="date" {...register("endDate")} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
        <select {...register("status")} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="Actif">Actif</option>
          <option value="Préavis">Préavis</option>
          <option value="Terminé">Terminé</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loyer mensuel (€)</label>
          <input type="number" step="1" {...register("monthlyRent", { setValueAs: (v) => (v === "" || Number.isNaN(Number(v)) ? undefined : Number(v)) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Charges mensuelles (€)</label>
          <input type="number" step="1" {...register("monthlyCharges", { setValueAs: (v) => (v === "" || Number.isNaN(Number(v)) ? undefined : Number(v)) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dépôt de garantie (€)</label>
          <input type="number" step="1" {...register("deposit", { setValueAs: (v) => (v === "" || Number.isNaN(Number(v)) ? undefined : Number(v)) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jour d&apos;échéance (1-28)</label>
          <input type="number" min={1} max={28} {...register("dueDay", { setValueAs: (v) => (v === "" || Number.isNaN(Number(v)) ? undefined : Number(v)) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
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
