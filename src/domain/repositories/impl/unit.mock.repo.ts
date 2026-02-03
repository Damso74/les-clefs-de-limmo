import type { Unit, UnitId, PropertyId } from "@/domain/types";
import type { UnitRepository } from "../unit.repo";
import { units } from "@/lib/mock/data";
import { generateId, ID_PREFIXES } from "@/lib/utils";

class UnitMockRepository implements UnitRepository {
  private data: Unit[] = [...units];

  async list(): Promise<Unit[]> {
    return this.data;
  }

  async getById(id: UnitId): Promise<Unit | null> {
    return this.data.find((u) => u.id === id) ?? null;
  }

  async getByPropertyId(propertyId: PropertyId): Promise<Unit[]> {
    return this.data.filter((u) => u.propertyId === propertyId);
  }

  async create(unit: Omit<Unit, "id" | "createdAt" | "updatedAt">): Promise<Unit> {
    const now = new Date().toISOString();
    const newUnit: Unit = {
      ...unit,
      id: generateId(ID_PREFIXES.unit, this.data.map((u) => u.id)),
      createdAt: now,
      updatedAt: now,
    };
    this.data.push(newUnit);
    return newUnit;
  }

  async update(id: UnitId, data: Partial<Unit>): Promise<Unit | null> {
    const index = this.data.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const updated: Unit = {
      ...this.data[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.data[index] = updated;
    return updated;
  }
}

export const unitMockRepo = new UnitMockRepository();
