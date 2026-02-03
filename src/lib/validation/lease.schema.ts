import { z } from "zod";

export const leaseSchema = z.object({
  unitId: z.string().min(1, "Le lot est requis"),
  tenantId: z.string().min(1, "Le locataire est requis"),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().optional(),
  status: z.enum(["Actif", "Préavis", "Terminé"]),
  monthlyRent: z.number().min(0).optional(),
  monthlyCharges: z.number().min(0).optional(),
  deposit: z.number().min(0).optional(),
  dueDay: z.number().int().min(1).max(28).optional(),
  notes: z.string().optional(),
});

export type LeaseFormData = z.infer<typeof leaseSchema>;
