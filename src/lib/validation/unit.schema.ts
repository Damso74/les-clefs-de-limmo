import { z } from "zod";

export const unitSchema = z.object({
  propertyId: z.string().min(1, "Le bien est requis"),
  label: z.string().min(1, "Le libellé est requis"),
  type: z.enum(["Studio", "T1", "T2", "T3", "T4", "T5+", "Local", "Garage", "Autre"]),
  floor: z.number().int().min(0).optional(),
  rooms: z.number().int().min(0).optional(),
  areaM2: z.number().min(0).optional(),
  targetRentExclCharges: z.number().min(0).optional(),
  monthlyCharges: z.number().min(0).optional(),
  status: z.enum(["Vacant", "Occupé", "En travaux", "Indispo"]),
  notes: z.string().optional(),
});

export type UnitFormData = z.infer<typeof unitSchema>;
