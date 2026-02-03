"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  UserCircle,
  FileText,
  CreditCard,
  Wrench,
  FileCheck,
  FolderOpen,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/properties", label: "Biens", icon: Building2 },
  { href: "/units", label: "Lots", icon: Home },
  { href: "/tenants", label: "Locataires", icon: UserCircle },
  { href: "/applications", label: "Candidatures", icon: Users },
  { href: "/leases", label: "Baux", icon: FileText },
  { href: "/payments", label: "Paiements", icon: CreditCard },
  { href: "/maintenance", label: "Travaux", icon: Wrench },
  { href: "/contracts", label: "Contrats", icon: FileCheck },
  { href: "/documents", label: "Documents", icon: FolderOpen },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar();

  return (
    <>
      {/* Burger / Fermer — au-dessus de tout (z-50) pour rester cliquable */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-7 left-4 z-50 p-2.5 rounded-lg bg-white shadow-sm border border-gray-200 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        aria-controls="sidebar-nav"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay : sous la sidebar et le burger pour fermer au clic */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[35]"
          onClick={closeSidebar}
          aria-hidden
        />
      )}

      {/* Sidebar — au-dessus de l'overlay (z-40), burger au-dessus (z-40) */}
      <aside
        id="sidebar-nav"
        className={cn(
          "fixed left-0 w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 flex flex-col",
          "top-7 h-[calc(100vh-1.75rem)] lg:top-21 lg:h-[calc(100vh-5.25rem)]",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        aria-label="Menu de navigation"
      >
        {/* pt-12 sur mobile pour ne pas passer sous le bouton fermer (X) */}
        <div className="pt-12 px-4 pb-4 lg:pt-4 border-b border-gray-100 shrink-0">
          <p className="font-semibold text-gray-900 text-sm">Les Clefs de l&apos;Immo</p>
          <p className="text-xs text-gray-500 mt-0.5">Gestion de patrimoine</p>
        </div>

        <nav className="p-3 space-y-0.5 overflow-y-auto flex-1" aria-label="Navigation principale">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
