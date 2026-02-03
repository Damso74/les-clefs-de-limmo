"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Maintenance } from "@/domain/types";
import { StatusBadge } from "@/components/cards/StatusBadge";
import { formatMoney, formatDate } from "@/lib/utils";

export const maintenanceColumns: ColumnDef<Maintenance>[] = [
  {
    accessorKey: "id",
    header: "Réf.",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Catégorie",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-xs truncate">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "vendor",
    header: "Prestataire",
    cell: ({ row }) => row.getValue("vendor") || "—",
  },
  {
    accessorKey: "costEstimate",
    header: "Estimé",
    cell: ({ row }) => formatMoney(row.getValue("costEstimate")),
  },
  {
    accessorKey: "costReal",
    header: "Réel",
    cell: ({ row }) => formatMoney(row.getValue("costReal")),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "plannedAt",
    header: "Prévu le",
    cell: ({ row }) => formatDate(row.getValue("plannedAt")),
  },
];
