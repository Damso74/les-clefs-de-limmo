import type { Maintenance, MaintenanceId, PropertyId, UnitId } from "@/domain/types";

export interface MaintenanceRepository {
  list(): Promise<Maintenance[]>;
  getById(id: MaintenanceId): Promise<Maintenance | null>;
  getByPropertyId(propertyId: PropertyId): Promise<Maintenance[]>;
  getByUnitId(unitId: UnitId): Promise<Maintenance[]>;
  create(maintenance: Omit<Maintenance, "id" | "createdAt" | "updatedAt">): Promise<Maintenance>;
  update(id: MaintenanceId, data: Partial<Maintenance>): Promise<Maintenance | null>;
}
