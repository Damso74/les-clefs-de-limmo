import type { Payment, PaymentId, LeaseId, YearMonth } from "@/domain/types";

export interface PaymentRepository {
  list(): Promise<Payment[]>;
  getById(id: PaymentId): Promise<Payment | null>;
  getByLeaseId(leaseId: LeaseId): Promise<Payment[]>;
  getByPeriod(period: YearMonth): Promise<Payment[]>;
  create(payment: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment>;
  update(id: PaymentId, data: Partial<Payment>): Promise<Payment | null>;
}
