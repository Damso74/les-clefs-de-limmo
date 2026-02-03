import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export utils folder so @/lib/utils provides cn + dates/money/id/format
export * from "./utils/dates";
export * from "./utils/money";
export * from "./utils/id";
export * from "./utils/format";
