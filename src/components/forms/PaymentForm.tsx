"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema, type PaymentFormData } from "@/lib/validation";
import type { Lease } from "@/domain/types";

interface PaymentFormProps {
  leases: Lease[];
  onSubmit: (data: PaymentFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<PaymentFormData>;
}

export function PaymentForm({
  leases,
  onSubmit,
  onCancel,
  defaultValues,
}: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amountDue: 0,
      amountPaid: 0,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Lease */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bail *
        </label>
        <select
          {...register("leaseId")}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Sélectionner un bail</option>
          {leases.map((lease) => (
            <option key={lease.id} value={lease.id}>
              {lease.id} - Lot {lease.unitId}
            </option>
          ))}
        </select>
        {errors.leaseId && (
          <p className="text-red-500 text-sm mt-1">{errors.leaseId.message}</p>
        )}
      </div>

      {/* Period */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Période (YYYY-MM) *
        </label>
        <input
          type="month"
          {...register("period")}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.period && (
          <p className="text-red-500 text-sm mt-1">{errors.period.message}</p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date d&apos;échéance *
        </label>
        <input
          type="date"
          {...register("dueDate")}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.dueDate && (
          <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
        )}
      </div>

      {/* Amount Due */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Montant dû (€) *
        </label>
        <input
          type="number"
          step="0.01"
          {...register("amountDue", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.amountDue && (
          <p className="text-red-500 text-sm mt-1">{errors.amountDue.message}</p>
        )}
      </div>

      {/* Amount Paid */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Montant payé (€)
        </label>
        <input
          type="number"
          step="0.01"
          {...register("amountPaid", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.amountPaid && (
          <p className="text-red-500 text-sm mt-1">{errors.amountPaid.message}</p>
        )}
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Méthode de paiement
        </label>
        <select
          {...register("method")}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">—</option>
          <option value="Virement">Virement</option>
          <option value="CB">CB</option>
          <option value="Chèque">Chèque</option>
          <option value="Espèces">Espèces</option>
        </select>
      </div>

      {/* Paid At */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date de paiement
        </label>
        <input
          type="date"
          {...register("paidAt")}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Commentaire
        </label>
        <textarea
          {...register("comment")}
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
