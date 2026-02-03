import type { Payment, PaymentId, LeaseId, YearMonth } from "@/domain/types";
import type { PaymentRepository } from "../payment.repo";
import { payments } from "@/lib/mock/data";
import { generateId, ID_PREFIXES } from "@/lib/utils";

class PaymentMockRepository implements PaymentRepository {
  private data: Payment[] = [...payments];

  async list(): Promise<Payment[]> {
    return this.data;
  }

  async getById(id: PaymentId): Promise<Payment | null> {
    return this.data.find((p) => p.id === id) ?? null;
  }

  async getByLeaseId(leaseId: LeaseId): Promise<Payment[]> {
    return this.data.filter((p) => p.leaseId === leaseId);
  }

  async getByPeriod(period: YearMonth): Promise<Payment[]> {
    return this.data.filter((p) => p.period === period);
  }

  async create(payment: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> {
    const now = new Date().toISOString();
    const newPayment: Payment = {
      ...payment,
      id: generateId(ID_PREFIXES.payment, this.data.map((p) => p.id)),
      createdAt: now,
      updatedAt: now,
    };
    this.data.push(newPayment);
    return newPayment;
  }

  async update(id: PaymentId, data: Partial<Payment>): Promise<Payment | null> {
    const index = this.data.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updated: Payment = {
      ...this.data[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.data[index] = updated;
    return updated;
  }
}

export const paymentMockRepo = new PaymentMockRepository();
