import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Building2, MapPin, Home } from "lucide-react";
import {
  propertyMockRepo,
  unitMockRepo,
  maintenanceMockRepo,
  contractMockRepo,
  documentMockRepo,
} from "@/domain/repositories";
import { formatMoney, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/cards/StatusBadge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface PropertyDetailPageProps {
  params: {
    propertyId: string;
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const property = await propertyMockRepo.getById(params.propertyId);

  if (!property) {
    notFound();
  }

  const [units, maintenanceItems, contracts, documents] = await Promise.all([
    unitMockRepo.getByPropertyId(params.propertyId),
    maintenanceMockRepo.getByPropertyId(params.propertyId),
    contractMockRepo.getByPropertyId(params.propertyId),
    documentMockRepo.getByScope("PROPERTY", params.propertyId),
  ]);

  const occupiedUnits = units.filter((u) => u.status === "Occupé").length;
  const vacantUnits = units.filter((u) => u.status === "Vacant").length;
  const totalRent = units.reduce(
    (sum, u) => sum + (u.targetRentExclCharges || 0),
    0
  );

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Biens", href: "/properties" },
          { label: property.name },
        ]}
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <Link
          href="/properties"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors self-start"
          aria-label="Retour à la liste des biens"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <MapPin className="w-4 h-4 shrink-0" />
            {property.address}, {property.postalCode} {property.city}
          </div>
        </div>
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium shrink-0">
          {property.type}
        </span>
      </div>

      {/* Photo du bien */}
      {property.photoUrl && (
        <div className="rounded-xl overflow-hidden border bg-gray-100 aspect-video max-h-80">
          <Image
            src={property.photoUrl}
            alt={property.name}
            width={800}
            height={450}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}
      {!property.photoUrl && (
        <div className="rounded-xl border bg-gray-100 aspect-video max-h-80 flex items-center justify-center text-gray-400">
          <Building2 className="w-16 h-16" />
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Valeur estimée</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {formatMoney(property.estimatedValue)}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Loyers potentiels/mois</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {formatMoney(totalRent)}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Lots</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {units.length}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({occupiedUnits} occupé(s), {vacantUnits} vacant(s))
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Charges annuelles</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {formatMoney(
              (property.annualPropertyTax || 0) + (property.annualCharges || 0)
            )}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Info */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Informations</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-500">Date d&apos;achat</dt>
              <dd className="font-medium">
                {formatDate(property.purchaseDate)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Prix d&apos;achat</dt>
              <dd className="font-medium">
                {formatMoney(property.purchasePrice)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Taxe foncière</dt>
              <dd className="font-medium">
                {formatMoney(property.annualPropertyTax)}/an
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Charges annuelles</dt>
              <dd className="font-medium">
                {formatMoney(property.annualCharges)}/an
              </dd>
            </div>
          </dl>
          {property.notes && (
            <p className="mt-4 text-sm text-gray-600 border-t pt-4">
              {property.notes}
            </p>
          )}
        </div>

        {/* Units Section */}
        <div className="lg:col-span-2 bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Lots ({units.length})</h2>
            <Link
              href="/units"
              className="text-sm text-primary hover:underline"
            >
              Voir tous
            </Link>
          </div>
          {units.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun lot</p>
          ) : (
            <div className="space-y-3">
              {units.map((unit) => (
                <Link
                  key={unit.id}
                  href={`/units/${unit.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <Home className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">{unit.label}</div>
                      <div className="text-sm text-gray-500">
                        {unit.type} • {unit.areaM2 ? `${unit.areaM2} m²` : "—"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">
                        {formatMoney(unit.targetRentExclCharges)}
                      </div>
                      <div className="text-xs text-gray-500">/mois</div>
                    </div>
                    <StatusBadge status={unit.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs-like sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
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
            <p className="text-gray-500 text-center py-8">Aucun travail</p>
          ) : (
            <div className="space-y-3">
              {maintenanceItems.slice(0, 5).map((item) => (
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

        {/* Contracts */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Contrats ({contracts.length})
            </h2>
            <Link
              href="/contracts"
              className="text-sm text-primary hover:underline"
            >
              Voir tous
            </Link>
          </div>
          {contracts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun contrat</p>
          ) : (
            <div className="space-y-3">
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {contract.type === "HP" && (
                        <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                          HP
                        </span>
                      )}
                      {contract.vendor}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(contract.startDate)} →{" "}
                      {formatDate(contract.endDate)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm">
                      {formatMoney(contract.annualCost)}/an
                    </div>
                    <StatusBadge status={contract.computedStatus || "OK"} />
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
          <h2 className="text-lg font-semibold">
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
          <p className="text-gray-500 text-center py-8">Aucun document</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div>
                  <div className="font-medium text-sm">{doc.type}</div>
                  <div className="text-xs text-gray-500">
                    {doc.received ? "Reçu" : "En attente"}
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
  );
}
