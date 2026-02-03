import { z } from "zod";

export const tenantSchema = z.object({
  lastName: z.string().min(1, "Le nom est requis"),
  firstName: z.string().min(1, "Le prénom est requis"),
  phone: z.string().optional(),
  email: z.union([z.string().email("Email invalide"), z.literal("")]).optional(),
  birthDate: z.string().optional(),
  notes: z.string().optional(),
});

export type TenantFormData = z.infer<typeof tenantSchema>;
