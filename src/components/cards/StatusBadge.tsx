"use client";

import { cn } from "@/lib/utils";

type StatusVariant = 
  | "success" 
  | "warning" 
  | "danger" 
  | "info" 
  | "neutral"
  | "occupé"
  | "vacant"
  | "en_travaux"
  | "payé"
  | "partiel"
  | "non_payé"
  | "en_retard"
  | "actif"
  | "préavis"
  | "terminé"
  | "ok"
  | "expire_30j"
  | "expiré"
  | "nouveau"
  | "en_analyse"
  | "approuvé"
  | "refusé"
  | "planifié"
  | "en_cours"
  | "annulé";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  danger: "bg-red-100 text-red-800 border-red-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  neutral: "bg-gray-100 text-gray-800 border-gray-200",
  // Unit statuses
  occupé: "bg-green-100 text-green-800 border-green-200",
  vacant: "bg-amber-100 text-amber-800 border-amber-200",
  en_travaux: "bg-orange-100 text-orange-800 border-orange-200",
  // Payment statuses
  payé: "bg-green-100 text-green-800 border-green-200",
  partiel: "bg-amber-100 text-amber-800 border-amber-200",
  non_payé: "bg-gray-100 text-gray-800 border-gray-200",
  en_retard: "bg-red-100 text-red-800 border-red-200",
  // Lease statuses
  actif: "bg-green-100 text-green-800 border-green-200",
  préavis: "bg-amber-100 text-amber-800 border-amber-200",
  terminé: "bg-gray-100 text-gray-800 border-gray-200",
  // Contract statuses
  ok: "bg-green-100 text-green-800 border-green-200",
  expire_30j: "bg-amber-100 text-amber-800 border-amber-200",
  expiré: "bg-red-100 text-red-800 border-red-200",
  // Application statuses
  nouveau: "bg-blue-100 text-blue-800 border-blue-200",
  en_analyse: "bg-purple-100 text-purple-800 border-purple-200",
  approuvé: "bg-green-100 text-green-800 border-green-200",
  refusé: "bg-red-100 text-red-800 border-red-200",
  // Maintenance statuses
  planifié: "bg-blue-100 text-blue-800 border-blue-200",
  en_cours: "bg-purple-100 text-purple-800 border-purple-200",
  annulé: "bg-gray-100 text-gray-800 border-gray-200",
};

function normalizeVariant(status: string): StatusVariant {
  const normalized = status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/<30j/g, "30j");

  // Map common variations
  const mapping: Record<string, StatusVariant> = {
    occupe: "occupé",
    "en travaux": "en_travaux",
    "en_travaux": "en_travaux",
    indispo: "neutral",
    paye: "payé",
    "non paye": "non_payé",
    "non_paye": "non_payé",
    "en retard": "en_retard",
    "en_retard": "en_retard",
    partiel: "partiel",
    preavis: "préavis",
    termine: "terminé",
    "expire_30j": "expire_30j",
    "expire <30j": "expire_30j",
    "expire_<30j": "expire_30j",
    expire: "expiré",
    nouveau: "nouveau",
    "en analyse": "en_analyse",
    "en_analyse": "en_analyse",
    approuve: "approuvé",
    refuse: "refusé",
    abandon: "neutral",
    planifie: "planifié",
    "en cours": "en_cours",
    "en_cours": "en_cours",
    annule: "annulé",
  };

  return mapping[normalized] || (normalized as StatusVariant) || "neutral";
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const resolvedVariant = variant || normalizeVariant(status);
  const styles = variantStyles[resolvedVariant] || variantStyles.neutral;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles,
        className
      )}
    >
      {status}
    </span>
  );
}
