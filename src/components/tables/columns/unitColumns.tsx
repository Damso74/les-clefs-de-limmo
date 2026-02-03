"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Eye } from "lucide-react";
import type { Unit } from "@/domain/types";
import { StatusBadge } from "@/components/cards/StatusBadge";
import { formatMoney, formatArea } from "@/lib/utils";

export const unitColumns: ColumnDef<Unit>[] = [
  {
    accessorKey: "label",
    header: "Lot",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("label")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "areaM2",
    header: "Surface",
    cell: ({ row }) => formatArea(row.getValue("areaM2")),
  },
  {
    accessorKey: "targetRentExclCharges",
    header: "Loyer cible",
    cell: ({ row }) => formatMoney(row.getValue("targetRentExclCharges")),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link
        href={`/units/${row.original.id}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors"
      >
        <Eye className="w-4 h-4" />
        Voir
      </Link>
    ),
  },
];
