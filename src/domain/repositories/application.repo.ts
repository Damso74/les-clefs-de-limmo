import type { Application, ApplicationId, UnitId } from "@/domain/types";

export interface ApplicationRepository {
  list(): Promise<Application[]>;
  getById(id: ApplicationId): Promise<Application | null>;
  getByUnitId(unitId: UnitId): Promise<Application[]>;
}
