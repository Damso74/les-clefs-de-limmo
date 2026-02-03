/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Format area in m²
 */
export function formatArea(areaM2: number | undefined): string {
  if (!areaM2) return "—";
  return `${areaM2} m²`;
}

/**
 * Format floor number
 */
export function formatFloor(floor: number | undefined): string {
  if (floor === undefined) return "—";
  if (floor === 0) return "RDC";
  return `${floor}${floor === 1 ? "er" : "e"} étage`;
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
