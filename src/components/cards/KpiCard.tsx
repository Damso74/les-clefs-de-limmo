"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "success" | "warning" | "danger";
  /** Si fourni, la carte est cliquable et redirige vers cette URL */
  href?: string;
}

const variantStyles = {
  default: "bg-white",
  success: "bg-green-50 border-green-200",
  warning: "bg-amber-50 border-amber-200",
  danger: "bg-red-50 border-red-200",
};

const iconStyles = {
  default: "bg-primary/10 text-primary",
  success: "bg-green-100 text-green-600",
  warning: "bg-amber-100 text-amber-600",
  danger: "bg-red-100 text-red-600",
};

const cardClassName = (variant: KpiCardProps["variant"], hasHref: boolean) =>
  cn(
    "rounded-lg border p-4 transition-shadow hover:shadow-md block",
    variantStyles[variant ?? "default"],
    hasHref && "cursor-pointer hover:border-primary/40"
  );

const cardContent = (
  title: string,
  value: string | number,
  subtitle?: string,
  trend?: KpiCardProps["trend"],
  trendValue?: string,
  Icon?: LucideIcon,
  variant: KpiCardProps["variant"] = "default"
) => (
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
      )}
      {trend && trendValue && (
        <p
          className={cn(
            "text-sm mt-1 font-medium",
            trend === "up" && "text-green-600",
            trend === "down" && "text-red-600",
            trend === "neutral" && "text-gray-500"
          )}
        >
          {trend === "up" && "↑ "}
          {trend === "down" && "↓ "}
          {trendValue}
        </p>
      )}
    </div>
    {Icon && (
      <div className={cn("p-3 rounded-lg", iconStyles[variant ?? "default"])}>
        <Icon className="w-5 h-5" />
      </div>
    )}
  </div>
);

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = "default",
  href,
}: KpiCardProps) {
  const content = cardContent(title, value, subtitle, trend, trendValue, Icon, variant);
  if (href) {
    return (
      <Link
        href={href}
        className={cardClassName(variant, true)}
        aria-label={`Voir ${title}`}
      >
        {content}
      </Link>
    );
  }
  return <div className={cardClassName(variant, false)}>{content}</div>;
}
