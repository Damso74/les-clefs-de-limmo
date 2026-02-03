"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Eye } from "lucide-react";
import type { Tenant } from "@/domain/types";

function fullName(tenant: Tenant): string {
  return `${tenant.firstName} ${tenant.lastName}`.trim();
}

export const tenantColumns: ColumnDef<Tenant>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "Réf.",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.id}</span>
    ),
  },
  {
    id: "name",
    accessorFn: (row) => fullName(row),
    header: "Nom",
    cell: ({ row }) => (
      <Link
        href={`/tenants/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {fullName(row.original)}
      </Link>
    ),
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: ({ row }) => (
      <span className="text-gray-600">{row.getValue("phone") ?? "—"}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-gray-600">{row.getValue("email") ?? "—"}</span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link
        href={`/tenants/${row.original.id}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors"
      >
        <Eye className="w-4 h-4" />
        Fiche
      </Link>
    ),
  },
];
