"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Application } from "@/domain/types";
import { StatusBadge } from "@/components/cards/StatusBadge";
import { formatMoney, formatDate } from "@/lib/utils";

export const applicationColumns: ColumnDef<Application>[] = [
  {
    accessorKey: "id",
    header: "Réf.",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "fullName",
    header: "Candidat",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("fullName")}</div>
    ),
  },
  {
    accessorKey: "unitId",
    header: "Lot",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("unitId")}</span>
    ),
  },
  {
    accessorKey: "submittedAt",
    header: "Date",
    cell: ({ row }) => formatDate(row.getValue("submittedAt")),
  },
  {
    accessorKey: "netMonthlyIncome",
    header: "Revenus",
    cell: ({ row }) => formatMoney(row.getValue("netMonthlyIncome")),
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => {
      const score = row.getValue("score") as number | undefined;
      if (!score) return "—";
      
      const color = score >= 70 ? "text-green-600" : score >= 50 ? "text-amber-600" : "text-red-600";
      return <span className={`font-semibold ${color}`}>{score}/100</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
];
