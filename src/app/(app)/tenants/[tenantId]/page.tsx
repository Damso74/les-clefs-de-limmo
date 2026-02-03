import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  FileText,
  StickyNote,
  Home,
  CreditCard,
  FolderOpen,
} from "lucide-react";
import {
  tenantMockRepo,
  leaseMockRepo,
  unitMockRepo,
  propertyMockRepo,
  paymentMockRepo,
  documentMockRepo,
} from "@/domain/repositories";
import { formatMoney, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/cards/StatusBadge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface TenantDetailPageProps {
  params: {
    tenantId: string;
  };
}

export default async function TenantDetailPage({
  params,
}: TenantDetailPageProps) {
  const tenant = await tenantMockRepo.getById(params.tenantId);

  if (!tenant) {
    notFound();
  }

  const [leases, documents] = await Promise.all([
    leaseMockRepo.getByTenantId(params.tenantId),
    documentMockRepo.getByScope("TENANT", params.tenantId),
  ]);

  // Enrich leases with unit and property
  const leasesWithUnit = await Promise.all(
    leases.map(async (lease) => {
      const unit = await unitMockRepo.getById(lease.unitId);
      const property = unit
        ? await propertyMockRepo.getById(unit.propertyId)
        : null;
      return { lease, unit, property };
    })
  );

  // Recent payments from all leases of this tenant
  const allPayments = await Promise.all(
    leases.map((l) => paymentMockRepo.getByLeaseId(l.id))
  );
  const recentPayments = allPayments
    .flat()
    .sort(
      (a, b) =>
        new Date(b.period).getTime() - new Date(a.period).getTime()
    )
    .slice(0, 8);

  const fullName = `${tenant.firstName} ${tenant.lastName}`.trim();
  const activeLeases = leases.filter((l) => l.status === "Actif");

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Locataires", href: "/tenants" },
          { label: fullName },
        ]}
      />

      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/tenants"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Retour à la liste des locataires"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <span className="font-mono text-sm">{tenant.id}</span>
          </div>
        </div>
      </div>

      {/* Contact & infos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <User className="w-4 h-4" />
            Locataire
          </div>
          <div className="text-lg font-medium mt-1">{fullName}</div>
          {tenant.birthDate && (
            <div className="text-sm text-gray-500">
              Né(e) le {formatDate(tenant.birthDate)}
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Téléphone
          </div>
          <div className="text-lg font-medium mt-1">
            {tenant.phone ?? "—"}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </div>
          <div className="text-lg font-medium mt-1 truncate">
            {tenant.email ?? "—"}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Baux
          </div>
          <div className="text-lg font-medium mt-1">
            {leases.length} bail(aux) • {activeLeases.length} actif(s)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Baux */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Baux
            </h2>
            <Link
              href="/leases"
              className="text-sm text-primary hover:underline"
            >
              Voir tous
            </Link>
          </div>

          {leasesWithUnit.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun bail enregistré
            </div>
          ) : (
            <div className="space-y-3">
              {leasesWithUnit.map(({ lease, unit, property }) => (
                <div
                  key={lease.id}
                  className="p-3 rounded-lg border space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-500">
                      {lease.id}
                    </span>
                    <StatusBadge status={lease.status} />
                  </div>
                  {unit && (
                    <Link
                      href={`/units/${unit.id}`}
                      className="flex items-center gap-2 text-primary hover:underline font-medium"
                    >
                      <Home className="w-4 h-4" />
                      {unit.label}
                      {property && (
                        <span className="text-gray-500 font-normal">
                          · {property.name}
                        </span>
                      )}
                    </Link>
                  )}
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>
                      {formatDate(lease.startDate)} →{" "}
                      {lease.endDate ? formatDate(lease.endDate) : "—"}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatMoney(lease.monthlyRent)}
                      <span className="text-gray-500 font-normal">/mois</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Paiements récents */}
        <div className="lg:col-span-2 bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Paiements récents
            </h2>
            <Link
              href="/payments"
              className="text-sm text-primary hover:underline"
            >
              Voir tous
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun paiement
            </div>
          ) : (
            <div className="space-y-2">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <div className="font-medium">{payment.period}</div>
                    <div className="text-sm text-gray-500">
                      Échéance : {formatDate(payment.dueDate)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">
                        {formatMoney(payment.amountPaid)} /{" "}
                        {formatMoney(payment.amountDue)}
                      </div>
                      {payment.paidAt && (
                        <div className="text-xs text-gray-500">
                          Payé le {formatDate(payment.paidAt)}
                        </div>
                      )}
                    </div>
                    <StatusBadge
                      status={payment.computedStatus || "Non payé"}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Documents ({documents.length})
          </h2>
          <Link
            href="/documents"
            className="text-sm text-primary hover:underline"
          >
            Voir tous
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun document rattaché à ce locataire
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div>
                  <div className="font-medium text-sm">{doc.type}</div>
                  <div className="text-xs text-gray-500">
                    {doc.received ? "Reçu" : "En attente"}
                    {doc.receivedAt && ` · ${formatDate(doc.receivedAt)}`}
                  </div>
                </div>
                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline"
                  >
                    Voir
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      {tenant.notes && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Notes
          </h2>
          <p className="text-gray-600">{tenant.notes}</p>
        </div>
      )}

      {tenant.dossierUrl && (
        <div className="bg-white rounded-lg border p-6">
          <a
            href={tenant.dossierUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Ouvrir le dossier locataire (Drive) →
          </a>
        </div>
      )}
    </div>
  );
}
