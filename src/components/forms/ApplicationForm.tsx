"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, type ApplicationFormData } from "@/lib/validation";
import type { Unit } from "@/domain/types";

interface ApplicationFormProps {
  units: Unit[];
  onSubmit: (data: ApplicationFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<ApplicationFormData>;
}

export function ApplicationForm({
  units,
  onSubmit,
  onCancel,
  defaultValues,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      submittedAt: new Date().toISOString().split("T")[0],
      hasGuarantor: false,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Lot */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lot concerné *
        </label>
        <select
          {...register("unitId")}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">— Sélectionner un lot —</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label} ({u.id})
            </option>
          ))}
        </select>
        {errors.unitId && (
          <p className="text-red-500 text-sm mt-1">{errors.unitId.message}</p>
        )}
      </div>

      {/* Nom complet */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom complet *
        </label>
        <input
          type="text"
          {...register("fullName")}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
        )}
      </div>

      {/* Téléphone & Email */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Date de candidature */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date de candidature *
        </label>
        <input
          type="date"
          {...register("submittedAt")}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.submittedAt && (
          <p className="text-red-500 text-sm mt-1">{errors.submittedAt.message}</p>
        )}
      </div>

      {/* Revenu mensuel net */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Revenu mensuel net (€)
        </label>
        <input
          type="number"
          step="1"
          {...register("netMonthlyIncome", {
            setValueAs: (v) => (v === "" || Number.isNaN(Number(v)) ? undefined : Number(v)),
          })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.netMonthlyIncome && (
          <p className="text-red-500 text-sm mt-1">{errors.netMonthlyIncome.message}</p>
        )}
      </div>

      {/* Garant */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="hasGuarantor"
          {...register("hasGuarantor")}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="hasGuarantor" className="text-sm font-medium text-gray-700">
          Garant présent
        </label>
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
