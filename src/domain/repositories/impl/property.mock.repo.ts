import type { Property, PropertyId } from "@/domain/types";
import type { PropertyRepository } from "../property.repo";
import { properties } from "@/lib/mock/data";
import { generateId, ID_PREFIXES } from "@/lib/utils";

class PropertyMockRepository implements PropertyRepository {
  private data: Property[] = [...properties];

  async list(): Promise<Property[]> {
    return this.data;
  }

  async getById(id: PropertyId): Promise<Property | null> {
    return this.data.find((p) => p.id === id) ?? null;
  }

  async create(property: Omit<Property, "id" | "createdAt" | "updatedAt">): Promise<Property> {
    const now = new Date().toISOString();
    const newProperty: Property = {
      ...property,
      id: generateId(ID_PREFIXES.property, this.data.map((p) => p.id)),
      createdAt: now,
      updatedAt: now,
    };
    this.data.push(newProperty);
    return newProperty;
  }

  async update(id: PropertyId, data: Partial<Property>): Promise<Property | null> {
    const index = this.data.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updated: Property = {
      ...this.data[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.data[index] = updated;
    return updated;
  }
}

export const propertyMockRepo = new PropertyMockRepository();
