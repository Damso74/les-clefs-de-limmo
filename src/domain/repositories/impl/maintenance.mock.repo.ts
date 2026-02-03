import type { Maintenance, MaintenanceId, PropertyId, UnitId } from "@/domain/types";
import type { MaintenanceRepository } from "../maintenance.repo";
import { maintenance } from "@/lib/mock/data";
import { generateId, ID_PREFIXES } from "@/lib/utils";

class MaintenanceMockRepository implements MaintenanceRepository {
  private data: Maintenance[] = [...maintenance];

  async list(): Promise<Maintenance[]> {
    return this.data;
  }

  async getById(id: MaintenanceId): Promise<Maintenance | null> {
    return this.data.find((m) => m.id === id) ?? null;
  }

  async getByPropertyId(propertyId: PropertyId): Promise<Maintenance[]> {
    return this.data.filter((m) => m.propertyId === propertyId);
  }

  async getByUnitId(unitId: UnitId): Promise<Maintenance[]> {
    return this.data.filter((m) => m.unitId === unitId);
  }

  async create(item: Omit<Maintenance, "id" | "createdAt" | "updatedAt">): Promise<Maintenance> {
    const now = new Date().toISOString();
    const newItem: Maintenance = {
      ...item,
      id: generateId(ID_PREFIXES.maintenance, this.data.map((m) => m.id)),
      createdAt: now,
      updatedAt: now,
    };
    this.data.push(newItem);
    return newItem;
  }

  async update(id: MaintenanceId, data: Partial<Maintenance>): Promise<Maintenance | null> {
    const index = this.data.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const updated: Maintenance = {
      ...this.data[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.data[index] = updated;
    return updated;
  }
}

export const maintenanceMockRepo = new MaintenanceMockRepository();
