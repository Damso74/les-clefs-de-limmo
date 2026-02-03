"use client";

import { Info } from "lucide-react";

export function DemoBadge() {
  return (
    <div className="h-7 bg-slate-100 text-slate-600 text-center text-xs font-medium flex items-center justify-center gap-2 border-b border-slate-200 shrink-0">
      <Info className="w-3.5 h-3.5 shrink-0 text-slate-500" />
      <span className="truncate">Démo — données fictives</span>
    </div>
  );
}
