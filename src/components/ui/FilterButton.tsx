"use client";

import { cn } from "@/lib/utils";

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}

export function FilterButton({ label, active, onClick, count }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-sm rounded-full border transition-colors",
        active
          ? "bg-primary text-white border-primary"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            "ml-1.5 px-1.5 py-0.5 text-xs rounded-full",
            active ? "bg-white/20" : "bg-gray-100"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
