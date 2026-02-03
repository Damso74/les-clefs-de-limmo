"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { Lease } from "@/domain/types";
import { StatusBadge } from "@/components/cards/StatusBadge";
import { formatMoney, formatDate } from "@/lib/utils";

export type LeaseRow = Lease & { tenantName?: string };

export const leaseColumns: ColumnDef<LeaseRow>[] = [
  {
    accessorKey: "id",
    header: "Réf.",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("id")}</span>
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
    accessorKey: "tenantName",
    header: "Locataire",
    cell: ({ row }) => {
      const name = row.original.tenantName;
      const tenantId = row.original.tenantId;
      const fallback = tenantId;
      const label = name ?? fallback;
      return (
        <Link
          href={`/tenants/${tenantId}`}
          className={name ? "font-medium text-primary hover:underline" : "font-mono text-xs text-primary hover:underline"}
        >
          {label}
        </Link>
      );
    },
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
    accessorKey: "monthlyRent",
    header: "Loyer",
    cell: ({ row }) => formatMoney(row.getValue("monthlyRent")),
  },
  {
    accessorKey: "monthlyCharges",
    header: "Charges",
    cell: ({ row }) => formatMoney(row.getValue("monthlyCharges")),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
];
