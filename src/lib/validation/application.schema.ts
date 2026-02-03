import { z } from "zod";

export const applicationSchema = z.object({
  unitId: z.string().min(1, "Le lot est requis"),
  fullName: z.string().min(1, "Le nom complet est requis"),
  phone: z.string().optional(),
  email: z.union([z.string().email("Email invalide"), z.literal("")]).optional(),
  submittedAt: z.string().min(1, "La date de candidature est requise"),
  netMonthlyIncome: z.number().min(0, "Le revenu doit être positif").optional(),
  hasGuarantor: z.boolean().optional(),
  notes: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const applicationUpdateSchema = applicationSchema.partial().extend({
  id: z.string().min(1),
});

export type ApplicationUpdateData = z.infer<typeof applicationUpdateSchema>;
