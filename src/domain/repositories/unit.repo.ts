import type { Unit, UnitId, PropertyId } from "@/domain/types";

export interface UnitRepository {
  list(): Promise<Unit[]>;
  getById(id: UnitId): Promise<Unit | null>;
  getByPropertyId(propertyId: PropertyId): Promise<Unit[]>;
  create(unit: Omit<Unit, "id" | "createdAt" | "updatedAt">): Promise<Unit>;
  update(id: UnitId, data: Partial<Unit>): Promise<Unit | null>;
}
