import type { Contract, ContractId, PropertyId, UnitId } from "@/domain/types";

export interface ContractRepository {
  list(): Promise<Contract[]>;
  getById(id: ContractId): Promise<Contract | null>;
  getByPropertyId(propertyId: PropertyId): Promise<Contract[]>;
  getByUnitId(unitId: UnitId): Promise<Contract[]>;
  create(contract: Omit<Contract, "id" | "createdAt" | "updatedAt">): Promise<Contract>;
  update(id: ContractId, data: Partial<Contract>): Promise<Contract | null>;
}
