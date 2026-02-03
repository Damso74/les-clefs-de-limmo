"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import type { Payment, Lease } from "@/domain/types";
import { DataTable } from "@/components/tables/DataTable";
import { paymentColumns } from "@/components/tables/columns";
import { FilterButton } from "@/components/ui/FilterButton";
import { Modal } from "@/components/ui/Modal";
import { PaymentForm } from "@/components/forms";
import type { PaymentFormData } from "@/lib/validation";

interface PaymentsClientProps {
  payments: Payment[];
  leases: Lease[];
}

type FilterType = "all" | "paid" | "late" | "unpaid";

export function PaymentsClient({ payments: initialPayments, leases }: PaymentsClientProps) {
  const [payments, setPayments] = useState(initialPayments);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPayments = useMemo(() => {
    switch (filter) {
      case "paid":
        return payments.filter((p) => p.computedStatus === "Payé");
      case "late":
        return payments.filter((p) => p.computedStatus === "En retard");
      case "unpaid":
        return payments.filter((p) => 
          p.computedStatus === "Non payé" || p.computedStatus === "Partiel"
        );
      default:
        return payments;
    }
  }, [payments, filter]);

  const counts = {
    all: payments.length,
    paid: payments.filter((p) => p.computedStatus === "Payé").length,
    late: payments.filter((p) => p.computedStatus === "En retard").length,
    unpaid: payments.filter((p) => 
      p.computedStatus === "Non payé" || p.computedStatus === "Partiel"
    ).length,
  };

  const handleAddPayment = (data: PaymentFormData) => {
    // Create new payment (demo mode - in-memory)
    const newPayment: Payment = {
      id: `PM${String(payments.length + 1).padStart(4, "0")}`,
      leaseId: data.leaseId,
      period: data.period,
      dueDate: data.dueDate,
      amountDue: data.amountDue,
      amountPaid: data.amountPaid,
      paidAt: data.paidAt,
      method: data.method,
      comment: data.comment,
      computedStatus: data.amountPaid >= data.amountDue ? "Payé" : 
                      data.amountPaid > 0 ? "Partiel" : "Non payé",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPayments([...payments, newPayment]);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un paiement
        </button>
      </div>

      <DataTable
        columns={paymentColumns}
        data={filteredPayments}
        searchPlaceholder="Rechercher un paiement..."
        filters={
          <>
            <FilterButton
              label="Tous"
              active={filter === "all"}
              onClick={() => setFilter("all")}
              count={counts.all}
            />
            <FilterButton
              label="Payés"
              active={filter === "paid"}
              onClick={() => setFilter("paid")}
              count={counts.paid}
            />
            <FilterButton
              label="En retard"
              active={filter === "late"}
              onClick={() => setFilter("late")}
              count={counts.late}
            />
            <FilterButton
              label="Impayés"
              active={filter === "unpaid"}
              onClick={() => setFilter("unpaid")}
              count={counts.unpaid}
            />
          </>
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un paiement"
        size="md"
      >
        <PaymentForm
          leases={leases}
          onSubmit={handleAddPayment}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
