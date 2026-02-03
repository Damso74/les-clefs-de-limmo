export type { PropertyRepository } from "./property.repo";
export type { UnitRepository } from "./unit.repo";
export type { TenantRepository } from "./tenant.repo";
export type { ApplicationRepository } from "./application.repo";
export type { LeaseRepository } from "./lease.repo";
export type { PaymentRepository } from "./payment.repo";
export type { MaintenanceRepository } from "./maintenance.repo";
export type { ContractRepository } from "./contract.repo";
export type { DocumentRepository } from "./document.repo";

// Re-export mock implementations
export { propertyMockRepo } from "./impl/property.mock.repo";
export { unitMockRepo } from "./impl/unit.mock.repo";
export { tenantMockRepo } from "./impl/tenant.mock.repo";
export { applicationMockRepo } from "./impl/application.mock.repo";
export { leaseMockRepo } from "./impl/lease.mock.repo";
export { paymentMockRepo } from "./impl/payment.mock.repo";
export { maintenanceMockRepo } from "./impl/maintenance.mock.repo";
export { contractMockRepo } from "./impl/contract.mock.repo";
export { documentMockRepo } from "./impl/document.mock.repo";
