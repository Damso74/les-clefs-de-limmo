import type { Application, ApplicationId, UnitId } from "@/domain/types";
import type { ApplicationRepository } from "../application.repo";
import { applications } from "@/lib/mock/data";

class ApplicationMockRepository implements ApplicationRepository {
  private data: Application[] = [...applications];

  async list(): Promise<Application[]> {
    return this.data;
  }

  async getById(id: ApplicationId): Promise<Application | null> {
    return this.data.find((a) => a.id === id) ?? null;
  }

  async getByUnitId(unitId: UnitId): Promise<Application[]> {
    return this.data.filter((a) => a.unitId === unitId);
  }
}

export const applicationMockRepo = new ApplicationMockRepository();
