import Link from "next/link";
import { FileQuestion, LayoutDashboard, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
          <FileQuestion className="w-7 h-7 text-amber-600" aria-hidden />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Page introuvable
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <LayoutDashboard className="w-4 h-4" />
            Tableau de bord
          </Link>
          <Link
            href="/properties"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <Home className="w-4 h-4" />
            Voir les biens
          </Link>
        </div>
      </div>
    </div>
  );
}
