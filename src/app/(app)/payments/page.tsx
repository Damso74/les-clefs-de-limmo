import { paymentMockRepo, leaseMockRepo } from "@/domain/repositories";
import { PaymentsClient } from "./PaymentsClient";

export default async function PaymentsPage() {
  const [payments, leases] = await Promise.all([
    paymentMockRepo.list(),
    leaseMockRepo.list(),
  ]);

  const stats = {
    total: payments.length,
    paid: payments.filter((p) => p.computedStatus === "Payé").length,
    partial: payments.filter((p) => p.computedStatus === "Partiel").length,
    late: payments.filter((p) => p.computedStatus === "En retard").length,
    unpaid: payments.filter((p) => p.computedStatus === "Non payé").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
        <p className="text-gray-500 mt-1">
          {stats.total} paiement(s) • {stats.paid} payé(s) • {stats.late} en retard • {stats.partial + stats.unpaid} impayé(s)
        </p>
      </div>

      <PaymentsClient payments={payments} leases={leases} />
    </div>
  );
}
