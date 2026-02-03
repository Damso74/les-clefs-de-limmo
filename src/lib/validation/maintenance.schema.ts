import { z } from "zod";

export const maintenanceSchema = z.object({
  propertyId: z.string().optional(),
  unitId: z.string().optional(),
  category: z.string().min(1, "La catégorie est requise"),
  description: z.string().min(1, "La description est requise"),
  vendor: z.string().optional(),
  requestedAt: z.string().optional(),
  plannedAt: z.string().optional(),
  completedAt: z.string().optional(),
  status: z.enum(["Planifié", "En cours", "Terminé", "Annulé"]),
  costEstimate: z.number().min(0, "Le coût doit être positif").optional(),
  costReal: z.number().min(0, "Le coût doit être positif").optional(),
  invoiceStatus: z.enum(["Non payé", "Payé", "Partiel"]).optional(),
  notes: z.string().optional(),
});

export type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

export const maintenanceUpdateSchema = maintenanceSchema.partial().extend({
  id: z.string().min(1),
});

export type MaintenanceUpdateData = z.infer<typeof maintenanceUpdateSchema>;
