import { KeyboardDefinitionSchema } from '../../gen/types/KeyboardDefinition';

type DefinitionLookup = Record<string, KeyboardDefinitionSchema>;

let cachedLookup: DefinitionLookup | null | undefined = undefined;

/**
 * Converts a numeric USB vendor/product ID to the normalized hex string used
 * as the lookup key in via-bundled.json (e.g., 18504 → "0x4848").
 */
function toNormalizedHex(n: number): string {
  return '0x' + n.toString(16);
}

function lookupKey(vendorId: number, productId: number): string {
  return `${toNormalizedHex(vendorId)}:${toNormalizedHex(productId)}`;
}

async function loadLookup(): Promise<DefinitionLookup | null> {
  if (cachedLookup !== undefined) return cachedLookup;
  try {
    const response = await fetch('/definitions/via-bundled.json');
    if (!response.ok) {
      cachedLookup = null;
      return null;
    }
    cachedLookup = (await response.json()) as DefinitionLookup;
    return cachedLookup;
  } catch {
    cachedLookup = null;
    return null;
  }
}

/**
 * Looks up a keyboard definition by USB vendor ID and product ID from the
 * bundled VIA definitions library.
 *
 * Returns the matching KeyboardDefinitionSchema, or null if no match is found
 * or the bundle cannot be loaded (e.g., missing file, network error).
 */
export async function findByDeviceInfo(
  vendorId: number,
  productId: number
): Promise<KeyboardDefinitionSchema | null> {
  const lookup = await loadLookup();
  if (!lookup) return null;
  return lookup[lookupKey(vendorId, productId)] ?? null;
}
