/**
 * Generate a unique ID with prefix
 */
export function generateId(prefix: string, existingIds: string[] = []): string {
  const maxNum = existingIds
    .filter((id) => id.startsWith(prefix))
    .map((id) => parseInt(id.replace(prefix, ""), 10))
    .reduce((max, num) => (num > max ? num : max), 0);
  
  return `${prefix}${String(maxNum + 1).padStart(4, "0")}`;
}

/**
 * ID prefixes by entity type
 */
export const ID_PREFIXES = {
  property: "P",
  unit: "U",
  tenant: "T",
  application: "A",
  lease: "L",
  payment: "PM",
  maintenance: "W",
  contract: "C",
  document: "D",
} as const;
