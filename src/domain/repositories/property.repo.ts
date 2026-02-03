import type { Property, PropertyId } from "@/domain/types";

export interface PropertyRepository {
  list(): Promise<Property[]>;
  getById(id: PropertyId): Promise<Property | null>;
  create(property: Omit<Property, "id" | "createdAt" | "updatedAt">): Promise<Property>;
  update(id: PropertyId, data: Partial<Property>): Promise<Property | null>;
}
