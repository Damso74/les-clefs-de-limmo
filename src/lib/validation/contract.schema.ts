import { z } from "zod";

export const contractSchema = z.object({
  propertyId: z.string().optional(),
  unitId: z.string().optional(),
  type: z.enum(["HP", "Assurance", "Entretien", "Syndic", "Autre"]),
  vendor: z.string().min(1, "Le prestataire est requis"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  renewalDate: z.string().optional(),
  annualCost: z.number().min(0, "Le coût doit être positif").optional(),
  notes: z.string().optional(),
});

export type ContractFormData = z.infer<typeof contractSchema>;

export const contractUpdateSchema = contractSchema.partial().extend({
  id: z.string().min(1),
});

export type ContractUpdateData = z.infer<typeof contractUpdateSchema>;
