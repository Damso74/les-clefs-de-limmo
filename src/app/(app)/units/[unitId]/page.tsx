import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  User,
  Calendar,
  CreditCard,
  Wrench,
  FileText,
} from "lucide-react";
import {
  unitMockRepo,
  propertyMockRepo,
  leaseMockRepo,
  paymentMockRepo,
  maintenanceMockRepo,
  documentMockRepo,
  tenantMockRepo,
} from "@/domain/repositories";
import { formatMoney, formatDate, formatArea, formatFloor } from "@/lib/utils";
import { StatusBadge } from "@/components/cards/StatusBadge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface UnitDetailPageProps {
  params: {
    unitId: string;
  };
}

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  const unit = await unitMockRepo.getById(params.unitId);

  if (!unit) {
    notFound();
  }

  const [property, activeLease, maintenanceItems, documents] = await Promise.all(
    [
      propertyMockRepo.getById(unit.propertyId),
      leaseMockRepo.getActiveByUnitId(params.unitId),
      maintenanceMockRepo.getByUnitId(params.unitId),
      documentMockRepo.getByScope("UNIT", params.unitId),
    ]
  );

  // Get tenant and payments if there's an active lease
  let tenant = null;
  let recentPayments: Awaited<ReturnType<typeof paymentMockRepo.list>> = [];

  if (activeLease) {
    const [tenantData, leasePayments] = await Promise.all([
      tenantMockRepo.getById(activeLease.tenantId),
      paymentMockRepo.getByLeaseId(activeLease.id),
    ]);
    tenant = tenantData;
    recentPayments = leasePayments.slice(-6).reverse();
  }

  // Also get documents related to the lease
  let leaseDocuments: Awaited<ReturnType<typeof documentMockRepo.list>> = [];
  if (activeLease) {
    leaseDocuments = await documentMockRepo.getByScope("LEASE", activeLease.id);
  }

  const allDocuments = [...documents, ...leaseDocuments];

  const breadcrumbItems = [
    { label: "Lots", href: "/units" },
    ...(property
      ? [
          { label: property.name, href: `/properties/${property.id}` },
          { label: unit.label },
        ]
      : [{ label: unit.label }]),
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/units"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Retour à la liste des lots"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{unit.label}</h1>
          {property && (
            <Link
              href={`/properties/${property.id}`}
              className="flex items-center gap-2 text-gray-500 mt-1 hover:text-primary"
            >
              <Building2 className="w-4 h-4" />
              {property.name}
            </Link>
          )}
        </div>
        <StatusBadge status={unit.status} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Type</div>
          <div className="text-xl font-bold text-gray-900 mt-1">{unit.type}</div>
          <div className="text-sm text-gray-500">
            {formatArea(unit.areaM2)} • {formatFloor(unit.floor)}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Loyer cible</div>
          <div className="text-xl font-bold text-gray-900 mt-1">
            {formatMoney(unit.targetRentExclCharges)}
            <span className="text-sm font-normal text-gray-500">/mois</span>
          </div>
          <div className="text-sm text-gray-500">
            +{formatMoney(unit.monthlyCharges)} charges
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Statut</div>
          <div className="text-xl font-bold text-gray-900 mt-1">
            {unit.status}
          </div>
          {unit.vacantSince && (
            <div className="text-sm text-amber-600">
              Vacant depuis le {formatDate(unit.vacantSince)}
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Dernière rénovation</div>
          <div className="text-xl font-bold text-gray-900 mt-1">
            {formatDate(unit.lastRefurbishedAt) || "—"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Lease */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Bail actif
          </h2>
          {activeLease && tenant ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-full bg-primary/10">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">
                    {tenant.firstName} {tenant.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{tenant.email}</div>
                </div>
              </div>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Début</dt>
                  <dd className="font-medium">
                    {formatDate(activeLease.startDate)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Fin</dt>
                  <dd className="font-medium">
                    {formatDate(activeLease.endDate)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Loyer</dt>
                  <dd className="font-medium">
                    {formatMoney(activeLease.monthlyRent)}/mois
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Charges</dt>
                  <dd className="font-medium">
                    {formatMoney(activeLease.monthlyCharges)}/mois
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Dépôt</dt>
                  <dd className="font-medium">
                    {formatMoney(activeLease.deposit)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Échéance</dt>
                  <dd className="font-medium">
                    Le {activeLease.dueDay} du mois
                  </dd>
                </div>
              </dl>

              <div className="pt-2">
                <StatusBadge status={activeLease.status} />
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <FileText className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-500">Aucun bail actif</p>
              <p className="text-sm text-gray-400 mt-1">
                Ce lot est actuellement disponible
              </p>
            </div>
          )}
        </div>

        {/* Recent Payments */}
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
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun paiement</p>
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
                      Échéance: {formatDate(payment.dueDate)}
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
                    <StatusBadge status={payment.computedStatus || "Non payé"} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Maintenance & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Travaux ({maintenanceItems.length})
            </h2>
            <Link
              href="/maintenance"
              className="text-sm text-primary hover:underline"
            >
              Voir tous
            </Link>
          </div>

          {maintenanceItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun travail enregistré</p>
            </div>
          ) : (
            <div className="space-y-3">
              {maintenanceItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <div className="font-medium">{item.category}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {item.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm">
                      {formatMoney(item.costReal || item.costEstimate)}
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Documents ({allDocuments.length})
            </h2>
            <Link
              href="/documents"
              className="text-sm text-primary hover:underline"
            >
              Voir tous
            </Link>
          </div>

          {allDocuments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun document</p>
            </div>
          ) : (
            <div className="space-y-2">
              {allDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <div className="font-medium text-sm">{doc.type}</div>
                    <div className="text-xs text-gray-500">
                      {doc.scope} • {doc.received ? "Reçu" : "En attente"}
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
      </div>

      {/* Notes */}
      {unit.notes && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-2">Notes</h2>
          <p className="text-gray-600">{unit.notes}</p>
        </div>
      )}
    </div>
  );
}
