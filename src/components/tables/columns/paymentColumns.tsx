"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { Payment } from "@/domain/types";
import { StatusBadge } from "@/components/cards/StatusBadge";
import { formatMoney, formatDate, formatMonth } from "@/lib/utils";

export const paymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Réf.",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "period",
    header: "Période",
    cell: ({ row }) => formatMonth(row.getValue("period")),
  },
  {
    accessorKey: "dueDate",
    header: "Échéance",
    cell: ({ row }) => formatDate(row.getValue("dueDate")),
  },
  {
    accessorKey: "amountDue",
    header: "Montant dû",
    cell: ({ row }) => formatMoney(row.getValue("amountDue")),
  },
  {
    accessorKey: "amountPaid",
    header: "Payé",
    cell: ({ row }) => formatMoney(row.getValue("amountPaid")),
  },
  {
    accessorKey: "computedStatus",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("computedStatus") as string;
      return <StatusBadge status={status || "Non payé"} />;
    },
  },
  {
    accessorKey: "method",
    header: "Méthode",
    cell: ({ row }) => row.getValue("method") || "—",
  },
];
