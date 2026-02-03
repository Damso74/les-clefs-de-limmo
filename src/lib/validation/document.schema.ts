import { z } from "zod";

const entityScopeEnum = z.enum([
  "PROPERTY", "UNIT", "TENANT", "APPLICATION", "LEASE", "PAYMENT", "MAINTENANCE", "CONTRACT",
]);

export const documentSchema = z.object({
  scope: entityScopeEnum,
  relatedId: z.string().min(1, "La référence est requise"),
  type: z.enum([
    "CNI", "Justif. domicile", "Fiches de paie", "Avis d'imposition", "RIB",
    "Attestation assurance", "État des lieux", "Autre",
  ]),
  requested: z.boolean().optional(),
  received: z.boolean().optional(),
  verified: z.boolean().optional(),
  receivedAt: z.string().optional(),
  expiresAt: z.string().optional(),
  notes: z.string().optional(),
});

export type DocumentFormData = z.infer<typeof documentSchema>;
