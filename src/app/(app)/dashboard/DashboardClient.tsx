"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  Home,
  Users,
  TrendingUp,
  CreditCard,
  Wallet,
  AlertTriangle,
  Wrench,
  PiggyBank,
  Info,
  Bell,
  Compass,
} from "lucide-react";
import type { KpiData, Alert, MonthlyFinance } from "@/domain/types";
import { KpiCard } from "@/components/cards/KpiCard";
import { AlertCard } from "@/components/cards/AlertCard";
import { FinanceChart } from "@/components/charts/FinanceChart";
import { PeriodSelector } from "@/components/ui/PeriodSelector";
import { GuidedTour, type GuidedTourStep } from "@/components/ui/GuidedTour";
import { useSidebar } from "@/contexts/SidebarContext";
import { formatMoney, formatPercentage, formatMonth } from "@/lib/utils";

const TOUR_STORAGE_KEY = "les-clefs-demo-tour-done";

const DASHBOARD_TOUR_STEPS: GuidedTourStep[] = [
  {
    title: "Vue d'ensemble",
    description:
      "Ce tableau de bord résume votre parc immobilier : nombre de lots, occupation, loyers et alertes à traiter. La période affichée peut être modifiée en haut à droite.",
  },
  {
    title: "Indicateurs clés",
    description:
      "Les cartes ci-dessus affichent les chiffres essentiels : total des lots, taux d'occupation, loyers facturés et encaissés pour le mois sélectionné.",
  },
  {
    title: "Trésorerie et alertes",
    description:
      "Impayés du mois, travaux dépensés sur l'année, cashflow net et nombre d'alertes actives. Les couleurs indiquent les points de vigilance (rouge / orange).",
  },
  {
    title: "Facturé vs encaissé",
    description:
      "Le graphique montre l'évolution des loyers facturés et encaissés sur les 3 derniers mois, pour suivre les retards de paiement.",
  },
  {
    title: "Alertes à traiter",
    description:
      "Les alertes urgentes (contrats expirés, impayés, logements vacants) apparaissent ici. Consultez le détail dans le menu pour tout traiter.",
  },
  {
    title: "Aller plus loin",
    description:
      "Sur mobile, le menu s'ouvre avec le bouton en haut à gauche. Il permet d'accéder aux Biens, Lots, Locataires, Candidatures, Baux, Paiements, Travaux, Contrats et Documents.",
  },
];

interface DashboardClientProps {
  kpis: KpiData;
  alerts: Alert[];
  monthlyFinances: MonthlyFinance[];
  selectedMonth: string;
}

export function DashboardClient({
  kpis,
  alerts,
  monthlyFinances,
  selectedMonth,
}: DashboardClientProps) {
  const topAlerts = alerts.slice(0, 5);
  const [tourStep, setTourStep] = useState<number>(-1);
  const [tourCompletedThisSession, setTourCompletedThisSession] = useState(false);
  const [hasCompletedTourBefore, setHasCompletedTourBefore] = useState<boolean | null>(null);
  useEffect(() => {
    setHasCompletedTourBefore(localStorage.getItem(TOUR_STORAGE_KEY) === "1");
  }, []);

  useEffect(() => {
    const scrollToAlertes = () => {
      if (window.location.hash === "#alertes") {
        tourRefAlerts.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    scrollToAlertes();
    window.addEventListener("hashchange", scrollToAlertes);
    return () => window.removeEventListener("hashchange", scrollToAlertes);
  }, []);
  const showTourReplayLabel = hasCompletedTourBefore === true || tourCompletedThisSession;
  const { openSidebar } = useSidebar();

  useEffect(() => {
    if (tourStep === 5) openSidebar();
  }, [tourStep, openSidebar]);

  const tourRefHeader = useRef<HTMLDivElement>(null);
  const tourRefKpi1 = useRef<HTMLDivElement>(null);
  const tourRefKpi2 = useRef<HTMLDivElement>(null);
  const tourRefChart = useRef<HTMLDivElement>(null);
  const tourRefAlerts = useRef<HTMLDivElement>(null);
  const tourSectionRefs = [
    tourRefHeader,
    tourRefKpi1,
    tourRefKpi2,
    tourRefChart,
    tourRefAlerts,
    tourRefHeader,
  ];

  const startTour = () => setTourStep(0);
  const endTour = () => {
    setTourStep(-1);
    setTourCompletedThisSession(true);
    if (typeof window !== "undefined") localStorage.setItem(TOUR_STORAGE_KEY, "1");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        ref={tourRefHeader}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 min-w-0"
      >
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 break-words">Tableau de bord</h1>
          <p className="text-gray-500 mt-1 break-words">
            Vue d&apos;ensemble de votre parc immobilier
          </p>
        </div>
        <PeriodSelector selectedMonth={selectedMonth} variant="dropdown" />
      </div>

      {/* Demo Banner + CTA visite guidée */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-start gap-3 min-w-0 overflow-hidden">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-blue-800 font-medium break-words">
            Bienvenue dans la démo
          </p>
          <p className="text-sm text-blue-700 mt-1 break-words">
            Cette démo illustre un outil de pilotage du parc immobilier communal
            : inventaire, baux, paiements, travaux, contrats et documents, avec
            alertes proactives et KPI budgétaires. <strong>Données fictives.</strong>
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={startTour}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:opacity-90 shadow-sm"
            >
              <Compass className="w-4 h-4" />
              {showTourReplayLabel ? "Revoir la visite guidée" : "Commencer la visite guidée"}
            </button>
            {showTourReplayLabel && (
              <span className="text-xs text-blue-600">
                Découvrez où se trouvent les indicateurs et le menu.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div ref={tourRefKpi1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total lots"
          value={kpis.totalUnits}
          subtitle={`${kpis.occupiedUnits} occupé(s)`}
          icon={Home}
          href="/units"
        />
        <KpiCard
          title="Taux d'occupation"
          value={formatPercentage(kpis.occupancyRate)}
          subtitle={`${kpis.totalUnits - kpis.occupiedUnits} vacant(s)`}
          icon={Users}
          variant={kpis.occupancyRate >= 90 ? "success" : kpis.occupancyRate >= 70 ? "default" : "warning"}
          href="/units"
        />
        <KpiCard
          title="Loyers facturés"
          value={formatMoney(kpis.rentBilled)}
          subtitle={formatMonth(selectedMonth)}
          icon={CreditCard}
          href="/payments"
        />
        <KpiCard
          title="Loyers encaissés"
          value={formatMoney(kpis.rentCollected)}
          subtitle={`${formatPercentage(
            kpis.rentBilled > 0
              ? Math.round((kpis.rentCollected / kpis.rentBilled) * 100)
              : 0
          )} du facturé`}
          icon={Wallet}
          variant={kpis.rentCollected >= kpis.rentBilled * 0.9 ? "success" : "warning"}
          href="/payments"
        />
      </div>

      <div ref={tourRefKpi2} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Impayés (mois)"
          value={formatMoney(kpis.unpaidRent)}
          icon={AlertTriangle}
          variant={kpis.unpaidRent > 0 ? "danger" : "success"}
          href="/payments"
        />
        <KpiCard
          title="Travaux (année)"
          value={formatMoney(kpis.maintenanceCostYTD)}
          subtitle="Total dépensé"
          icon={Wrench}
          href="/maintenance"
        />
        <KpiCard
          title="Cashflow net (mois)"
          value={formatMoney(kpis.netCashflow)}
          icon={PiggyBank}
          variant={kpis.netCashflow >= 0 ? "success" : "danger"}
          href="/payments"
        />
        <KpiCard
          title="Alertes actives"
          value={alerts.length}
          subtitle={`${alerts.filter((a) => a.severity === "critical").length} urgent(es)`}
          icon={AlertTriangle}
          variant={
            alerts.filter((a) => a.severity === "critical").length > 0
              ? "danger"
              : alerts.length > 0
              ? "warning"
              : "success"
          }
          href="#alertes"
        />
      </div>

      {/* Chart and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Finance Chart */}
        <div ref={tourRefChart} className="lg:col-span-2 bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">
            Facturé vs Encaissé (3 derniers mois)
          </h2>
          <FinanceChart data={monthlyFinances} />
        </div>

        {/* Top Alerts */}
        <div id="alertes" ref={tourRefAlerts} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden scroll-mt-4">
          <div className="px-5 pt-5 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Top 5 Alertes
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {alerts.length} alerte{alerts.length > 1 ? "s" : ""} au total
                  </p>
                </div>
              </div>
              {alerts.length > 5 && (
                <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  +{alerts.length - 5} autres
                </span>
              )}
            </div>
          </div>

          <div className="p-4">
            {topAlerts.length === 0 ? (
              <div className="text-center py-10 rounded-lg bg-gray-50/80">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-gray-600 font-medium">Aucune alerte</p>
                <p className="text-sm text-gray-500 mt-1">
                  Tout est sous contrôle !
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {topAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/payments"
          className="bg-white rounded-lg border p-4 text-center transition-shadow hover:shadow-md hover:border-primary/40 cursor-pointer block"
          aria-label="Voir Total facturé (3 mois)"
        >
          <div className="text-3xl font-bold text-primary">
            {monthlyFinances.reduce((sum, m) => sum + m.billed, 0).toLocaleString("fr-FR")}€
          </div>
          <div className="text-sm text-gray-500 mt-1">Total facturé (3 mois)</div>
        </Link>
        <Link
          href="/payments"
          className="bg-white rounded-lg border p-4 text-center transition-shadow hover:shadow-md hover:border-primary/40 cursor-pointer block"
          aria-label="Voir Total encaissé (3 mois)"
        >
          <div className="text-3xl font-bold text-green-600">
            {monthlyFinances.reduce((sum, m) => sum + m.collected, 0).toLocaleString("fr-FR")}€
          </div>
          <div className="text-sm text-gray-500 mt-1">Total encaissé (3 mois)</div>
        </Link>
        <Link
          href="/contracts"
          className="bg-white rounded-lg border p-4 text-center transition-shadow hover:shadow-md hover:border-primary/40 cursor-pointer block"
          aria-label="Voir Contrats à renouveler"
        >
          <div className="text-3xl font-bold text-amber-600">
            {alerts.filter((a) => a.type === "contract_expiring" || a.type === "contract_expired").length}
          </div>
          <div className="text-sm text-gray-500 mt-1">Contrats à renouveler</div>
        </Link>
        <Link
          href="/payments"
          className="bg-white rounded-lg border p-4 text-center transition-shadow hover:shadow-md hover:border-primary/40 cursor-pointer block"
          aria-label="Voir Paiements en retard"
        >
          <div className="text-3xl font-bold text-red-600">
            {alerts.filter((a) => a.type === "payment_late").length}
          </div>
          <div className="text-sm text-gray-500 mt-1">Paiements en retard</div>
        </Link>
      </div>

      {/* Visite guidée */}
      {tourStep >= 0 && (
        <GuidedTour
          steps={DASHBOARD_TOUR_STEPS}
          sectionRefs={tourSectionRefs}
          currentStep={tourStep}
          onNext={() => setTourStep((s) => Math.min(s + 1, DASHBOARD_TOUR_STEPS.length - 1))}
          onPrev={() => setTourStep((s) => Math.max(s - 1, 0))}
          onEnd={endTour}
        />
      )}
    </div>
  );
}
