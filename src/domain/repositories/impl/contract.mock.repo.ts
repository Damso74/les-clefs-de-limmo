import type { Contract, ContractId, PropertyId, UnitId } from "@/domain/types";
import type { ContractRepository } from "../contract.repo";
import { contracts } from "@/lib/mock/data";
import { generateId, ID_PREFIXES } from "@/lib/utils";

class ContractMockRepository implements ContractRepository {
  private data: Contract[] = [...contracts];

  async list(): Promise<Contract[]> {
    return this.data;
  }

  async getById(id: ContractId): Promise<Contract | null> {
    return this.data.find((c) => c.id === id) ?? null;
  }

  async getByPropertyId(propertyId: PropertyId): Promise<Contract[]> {
    return this.data.filter((c) => c.propertyId === propertyId);
  }

  async getByUnitId(unitId: UnitId): Promise<Contract[]> {
    return this.data.filter((c) => c.unitId === unitId);
  }

  async create(contract: Omit<Contract, "id" | "createdAt" | "updatedAt">): Promise<Contract> {
    const now = new Date().toISOString();
    const newContract: Contract = {
      ...contract,
      id: generateId(ID_PREFIXES.contract, this.data.map((c) => c.id)),
      createdAt: now,
      updatedAt: now,
    };
    this.data.push(newContract);
    return newContract;
  }

  async update(id: ContractId, data: Partial<Contract>): Promise<Contract | null> {
    const index = this.data.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const updated: Contract = {
      ...this.data[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.data[index] = updated;
    return updated;
  }
}

export const contractMockRepo = new ContractMockRepository();
