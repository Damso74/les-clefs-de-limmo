"use client";

import Link from "next/link";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronRight,
  FileX2,
  CreditCard,
  Home,
  Wrench,
  FileWarning,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@/domain/types";

interface AlertCardProps {
  alert: Alert;
}

const severityStyles = {
  critical: {
    bg: "bg-red-50/80 border-red-200",
    borderLeft: "border-l-red-500",
    icon: "text-red-600",
    badge: "bg-red-100 text-red-700",
  },
  warning: {
    bg: "bg-amber-50/80 border-amber-200",
    borderLeft: "border-l-amber-500",
    icon: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },
  info: {
    bg: "bg-blue-50/80 border-blue-200",
    borderLeft: "border-l-blue-500",
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
};

const SeverityIcon = {
  critical: AlertTriangle,
  warning: AlertCircle,
  info: Info,
};

const typeConfig: Record<
  Alert["type"],
  { label: string; icon: typeof FileX2 }
> = {
  contract_expired: { label: "Contrat expiré", icon: FileX2 },
  contract_expiring: { label: "Contrat expire bientôt", icon: FileX2 },
  unit_vacant: { label: "Logement vacant", icon: Home },
  payment_late: { label: "Impayé", icon: CreditCard },
  maintenance_overbudget: { label: "Dépassement travaux", icon: Wrench },
  document_missing: { label: "Document manquant", icon: FileWarning },
  document_expired: { label: "Document expiré", icon: FileWarning },
};

export function AlertCard({ alert }: AlertCardProps) {
  const styles = severityStyles[alert.severity];
  const SeverityIconComponent = SeverityIcon[alert.severity];
  const { label: typeLabel, icon: TypeIcon } = typeConfig[alert.type];

  const content = (
    <div
      className={cn(
        "flex items-start gap-3 pl-3 pr-3 py-3 rounded-r-lg border border-l-4 transition-all duration-200",
        styles.bg,
        styles.borderLeft,
        alert.link &&
          "hover:shadow-md hover:border-gray-300 cursor-pointer active:scale-[0.99]"
      )}
    >
      <div
        className={cn(
          "mt-0.5 shrink-0 w-9 h-9 rounded-lg flex items-center justify-center",
          alert.severity === "critical" && "bg-red-100",
          alert.severity === "warning" && "bg-amber-100",
          alert.severity === "info" && "bg-blue-100"
        )}
      >
        <TypeIcon className={cn("w-5 h-5", styles.icon)} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {typeLabel}
        </span>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="font-semibold text-gray-900 truncate">
            {alert.title}
          </span>
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full font-semibold shrink-0",
              styles.badge
            )}
          >
            {alert.severity === "critical"
              ? "Urgent"
              : alert.severity === "warning"
              ? "Attention"
              : "Info"}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {alert.description}
        </p>
      </div>
      {alert.link && (
        <ChevronRight
          className={cn("w-5 h-5 shrink-0 mt-1", styles.icon, "opacity-70")}
        />
      )}
    </div>
  );

  if (alert.link) {
    return (
      <Link href={alert.link} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-r-lg">
        {content}
      </Link>
    );
  }

  return content;
}
