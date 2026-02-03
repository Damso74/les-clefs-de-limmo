"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Contract } from "@/domain/types";
import { StatusBadge } from "@/components/cards/StatusBadge";
import { formatMoney, formatDate } from "@/lib/utils";

export const contractColumns: ColumnDef<Contract>[] = [
  {
    accessorKey: "id",
    header: "Réf.",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className={row.getValue("type") === "HP" ? "font-semibold text-purple-700" : ""}>
        {row.getValue("type")}
      </span>
    ),
  },
  {
    accessorKey: "vendor",
    header: "Prestataire",
  },
  {
    accessorKey: "startDate",
    header: "Début",
    cell: ({ row }) => formatDate(row.getValue("startDate")),
  },
  {
    accessorKey: "endDate",
    header: "Fin",
    cell: ({ row }) => formatDate(row.getValue("endDate")),
  },
  {
    accessorKey: "annualCost",
    header: "Coût annuel",
    cell: ({ row }) => formatMoney(row.getValue("annualCost")),
  },
  {
    accessorKey: "computedStatus",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("computedStatus") as string;
      return <StatusBadge status={status || "OK"} />;
    },
  },
];
