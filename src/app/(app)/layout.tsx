import { Sidebar, Topbar, DemoBadge } from "@/components/layout";
import { SidebarProvider } from "@/contexts/SidebarContext";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="w-full max-w-full min-h-screen min-w-0 bg-gray-50">
        {/* Header au sommet : bandeau démo + barre (sticky top-0) */}
        <header className="sticky top-0 z-20 shrink-0 bg-white shadow-sm">
          <DemoBadge />
          <Topbar />
        </header>
        <Sidebar />
        {/* Zone principale : mobile pl-16 pr-12 (plus de largeur), desktop lg:pl-72. */}
        <div className="w-full pt-0 pl-16 pr-12 lg:pl-72 lg:pr-0 min-h-screen min-w-0 overflow-x-hidden relative z-10">
          <main className="w-full max-w-screen-xl mx-auto pt-4 pr-0 pb-4 pl-0 lg:p-6 min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
