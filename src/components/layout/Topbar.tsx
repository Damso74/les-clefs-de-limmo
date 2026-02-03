"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";
import type { Alert } from "@/domain/types";
import { AlertCard } from "@/components/cards/AlertCard";

export function Topbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/alerts")
      .then((res) => res.json())
      .then((data) => setAlerts(data.alerts ?? []))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const topAlerts = alerts.slice(0, 5);
  const hasAlerts = alerts.length > 0;

  return (
    <header className="bg-white border-b border-gray-200 h-14 shrink-0" role="banner">
      <div className="h-full pl-16 pr-12 lg:pl-72 lg:pr-6 flex items-center gap-4 min-w-0">
        {/* Mobile : logo centré dans l'espace dispo ; desktop : justify-between */}
        <div className="flex-1 flex justify-center lg:justify-start min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
            <div className="relative w-8 h-10 shrink-0 sm:w-9 sm:h-12">
              <Image
                src="/images/lesclefs-blason.png"
                alt="Les Clefs"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 32px, 36px"
                priority
              />
            </div>
            <span className="font-semibold text-gray-800 hidden sm:inline truncate min-w-0 max-w-[11rem] md:max-w-[13rem] lg:max-w-none">
              Les Clefs de l&apos;Immo
            </span>
          </Link>
        </div>

        {/* Droite : cloche + profil — même largeur que la zone burger à gauche pour équilibrer le centrage */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 w-20 lg:w-auto shrink-0">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
              aria-label="Notifications"
              aria-expanded={notifOpen}
            >
              <Bell className="w-5 h-5" />
              {hasAlerts && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-1 w-[min(90vw,380px)] bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {hasAlerts && (
                    <span className="text-xs text-gray-500">
                      {alerts.length} alerte{alerts.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {loading ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      Chargement…
                    </div>
                  ) : topAlerts.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      Aucune alerte
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {topAlerts.map((alert) => (
                        <AlertCard key={alert.id} alert={alert} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-100">
                  <Link
                    href="/dashboard#alertes"
                    onClick={() => setNotifOpen(false)}
                    className="flex items-center justify-center gap-1 py-2 text-sm font-medium text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Voir toutes les alertes
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link
            href="/settings"
            className="hidden sm:flex items-center gap-2 min-w-0 rounded-lg hover:bg-gray-100 transition-colors p-1.5 -m-1.5"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium shrink-0">
              AD
            </div>
            <span className="text-sm font-medium text-gray-700 truncate">Admin Demo</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
