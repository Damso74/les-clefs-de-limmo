"use client";

import { useState } from "react";
import Link from "next/link";
import { Save, RotateCcw, Info, LayoutDashboard } from "lucide-react";

export default function SettingsPage() {
  const [vacantDaysThreshold, setVacantDaysThreshold] = useState(30);
  const [contractExpiryDays, setContractExpiryDays] = useState(30);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would persist to backend
    // For demo, we just show a confirmation
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setVacantDaysThreshold(30);
    setContractExpiryDays(30);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 mt-1">
          Configuration des seuils d&apos;alerte et préférences
        </p>
      </div>

      {/* Demo Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-amber-800 font-medium">Mode démo</p>
          <p className="text-sm text-amber-700 mt-1">
            Les paramètres modifiés ici ne sont pas persistés. Dans une version
            production, ces valeurs seraient sauvegardées en base de données.
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-6">Seuils d&apos;alerte</h2>

        <div className="space-y-6 max-w-md">
          {/* Vacant Days Threshold */}
          <div>
            <label
              htmlFor="vacantDays"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Seuil de vacance (jours)
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Déclenche une alerte si un logement est vacant depuis plus de X
              jours.
            </p>
            <input
              type="number"
              id="vacantDays"
              min={1}
              max={365}
              value={vacantDaysThreshold}
              onChange={(e) =>
                setVacantDaysThreshold(parseInt(e.target.value) || 30)
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Contract Expiry Days */}
          <div>
            <label
              htmlFor="contractExpiry"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Alerte expiration contrat (jours)
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Déclenche une alerte X jours avant l&apos;expiration d&apos;un contrat.
            </p>
            <input
              type="number"
              id="contractExpiry"
              min={1}
              max={180}
              value={contractExpiryDays}
              onChange={(e) =>
                setContractExpiryDays(parseInt(e.target.value) || 30)
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-8 pt-6 border-t">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>
          <Link
            href={`/dashboard?vacantDays=${vacantDaysThreshold}&contractExpiryDays=${contractExpiryDays}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Voir le tableau de bord avec ces paramètres
          </Link>
          {saved && (
            <span className="text-sm text-green-600 font-medium">
              ✓ Paramètres enregistrés (démo)
            </span>
          )}
        </div>
      </div>

      {/* Current Values Summary */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Valeurs actuelles</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <dt className="text-sm text-gray-500">Seuil de vacance</dt>
            <dd className="text-2xl font-bold text-gray-900 mt-1">
              {vacantDaysThreshold} jours
            </dd>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <dt className="text-sm text-gray-500">Alerte contrat</dt>
            <dd className="text-2xl font-bold text-gray-900 mt-1">
              {contractExpiryDays} jours avant
            </dd>
          </div>
        </dl>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">À propos</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Application</dt>
            <dd className="font-medium">Les Clefs de l&apos;Immo</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Version</dt>
            <dd className="font-medium">1.0.0 (Démo)</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Environnement</dt>
            <dd className="font-medium">Développement</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Données</dt>
            <dd className="font-medium text-amber-600">Fictives (Mock)</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
