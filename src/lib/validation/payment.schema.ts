import { z } from "zod";

export const paymentSchema = z.object({
  leaseId: z.string().min(1, "Le bail est requis"),
  period: z.string().regex(/^\d{4}-\d{2}$/, "Format YYYY-MM requis"),
  dueDate: z.string().min(1, "La date d'échéance est requise"),
  amountDue: z.number().min(0, "Le montant doit être positif"),
  amountPaid: z.number().min(0, "Le montant doit être positif"),
  paidAt: z.string().optional(),
  method: z.enum(["Virement", "CB", "Espèces", "Chèque"]).optional(),
  comment: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

export const paymentUpdateSchema = paymentSchema.partial().extend({
  id: z.string().min(1),
});

export type PaymentUpdateData = z.infer<typeof paymentUpdateSchema>;
