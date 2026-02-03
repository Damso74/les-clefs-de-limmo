"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema, type DocumentFormData } from "@/lib/validation";

const SCOPES: { value: DocumentFormData["scope"]; label: string }[] = [
  { value: "APPLICATION", label: "Candidature" },
  { value: "LEASE", label: "Bail" },
  { value: "TENANT", label: "Locataire" },
  { value: "UNIT", label: "Lot" },
  { value: "PROPERTY", label: "Bien" },
  { value: "CONTRACT", label: "Contrat" },
  { value: "MAINTENANCE", label: "Travaux" },
  { value: "PAYMENT", label: "Paiement" },
];

const DOC_TYPES: DocumentFormData["type"][] = [
  "CNI", "Justif. domicile", "Fiches de paie", "Avis d'imposition", "RIB",
  "Attestation assurance", "État des lieux", "Autre",
];

interface DocumentFormProps {
  onSubmit: (data: DocumentFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<DocumentFormData>;
}

export function DocumentForm({ onSubmit, onCancel, defaultValues }: DocumentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: { requested: false, received: false, verified: false, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contexte *</label>
        <select {...register("scope")} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          {SCOPES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Référence (ID) *</label>
        <input
          type="text"
          {...register("relatedId")}
          placeholder="ex. A0001, L0001"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.relatedId && <p className="text-red-500 text-sm mt-1">{errors.relatedId.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type de document *</label>
        <select {...register("type")} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          {DOC_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("requested")} className="rounded border-gray-300 text-primary focus:ring-primary" />
          <span className="text-sm text-gray-700">Demandé</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("received")} className="rounded border-gray-300 text-primary focus:ring-primary" />
          <span className="text-sm text-gray-700">Reçu</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("verified")} className="rounded border-gray-300 text-primary focus:ring-primary" />
          <span className="text-sm text-gray-700">Vérifié</span>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de réception</label>
          <input type="date" {...register("receivedAt")} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date d&apos;expiration</label>
          <input type="date" {...register("expiresAt")} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
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
