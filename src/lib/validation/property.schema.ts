import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  postalCode: z.string().min(1, "Le code postal est requis"),
  type: z.enum(["Immeuble", "Maison", "Terrain", "Local", "Autre"]),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number().min(0).optional(),
  estimatedValue: z.number().min(0).optional(),
  annualPropertyTax: z.number().min(0).optional(),
  annualCharges: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
