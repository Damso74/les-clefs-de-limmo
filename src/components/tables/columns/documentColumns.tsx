"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FileText, ExternalLink, AlertCircle, CheckCircle } from "lucide-react";
import type { Document } from "@/domain/types";
import { StatusBadge } from "@/components/cards/StatusBadge";
import { formatDate } from "@/lib/utils";

export const documentColumns: ColumnDef<Document>[] = [
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
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-gray-400" />
        {row.getValue("type")}
      </div>
    ),
  },
  {
    accessorKey: "scope",
    header: "Portée",
    cell: ({ row }) => (
      <span className="text-xs uppercase bg-gray-100 px-2 py-1 rounded">
        {row.getValue("scope")}
      </span>
    ),
  },
  {
    accessorKey: "received",
    header: "Reçu",
    cell: ({ row }) => {
      const received = row.getValue("received");
      const requested = row.original.requested;
      
      if (received) {
        return (
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" />
            Oui
          </span>
        );
      }
      if (requested) {
        return (
          <span className="flex items-center gap-1 text-amber-600">
            <AlertCircle className="w-4 h-4" />
            En attente
          </span>
        );
      }
      return <span className="text-gray-400">—</span>;
    },
  },
  {
    accessorKey: "expiresAt",
    header: "Expire le",
    cell: ({ row }) => {
      const expiresAt = row.getValue("expiresAt") as string | undefined;
      if (!expiresAt) return "—";
      
      const isExpired = new Date(expiresAt) < new Date();
      return (
        <span className={isExpired ? "text-red-600 font-medium" : ""}>
          {formatDate(expiresAt)}
          {isExpired && " (Expiré)"}
        </span>
      );
    },
  },
  {
    accessorKey: "fileUrl",
    header: "Fichier",
    cell: ({ row }) => {
      const url = row.getValue("fileUrl") as string | undefined;
      if (!url) return <span className="text-gray-400">—</span>;
      
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <ExternalLink className="w-4 h-4" />
          Voir
        </a>
      );
    },
  },
];
