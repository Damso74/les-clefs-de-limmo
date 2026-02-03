"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import Image from "next/image";
import { Building2, Eye, MapPin } from "lucide-react";
import type { Property } from "@/domain/types";
import { formatMoney } from "@/lib/utils";

export const propertyColumns: ColumnDef<Property>[] = [
  {
    id: "photo",
    header: "Photo",
    cell: ({ row }) => {
      const url = row.original.photoUrl;
      return (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          {url ? (
            <Image
              src={url}
              alt=""
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Building2 className="w-6 h-6" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "address",
    header: "Adresse",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-gray-600">
        <MapPin className="w-4 h-4 shrink-0" />
        <span>
          {row.original.address}, {row.original.postalCode} {row.original.city}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "estimatedValue",
    header: "Valeur estimée",
    cell: ({ row }) => formatMoney(row.getValue("estimatedValue")),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link
        href={`/properties/${row.original.id}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors"
      >
        <Eye className="w-4 h-4" />
        Voir
      </Link>
    ),
  },
];
