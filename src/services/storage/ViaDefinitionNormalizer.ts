/**
 * Normalization logic for converting VIA keyboard definitions (v2 and v3)
 * to Remap's KeyboardDefinitionSchema format.
 *
 * This module is used by tests to validate the normalization strategy.
 * The build script (scripts/fetch-via-definitions.mjs) mirrors this logic
 * in a standalone Node.js implementation.
 */

import { KeyboardDefinitionSchema } from '../../gen/types/KeyboardDefinition';

// Valid Remap lighting string values (matches keyboard-definition-schema.json)
const VALID_REMAP_LIGHTING_STRINGS = new Set([
  'none',
  'qmk_backlight',
  'qmk_rgblight',
  'qmk_backlight_rgblight',
  'wt_rgb_backlight',
  'wt_mono_backlight',
]);

// Maps VIA v3 simple menu string references to Remap lighting enum values.
const VIA_MENU_TO_LIGHTING: Record<string, string> = {
  qmk_backlight: 'qmk_backlight',
  qmk_rgblight: 'qmk_rgblight',
  qmk_backlight_rgblight: 'qmk_backlight_rgblight',
};

/**
 * Normalizes a hex string like "0x4848" or "0xA103" to a canonical lowercase
 * form without leading zeros: "0x0001" → "0x1", "0x4848" → "0x4848".
 * Returns null if the input is not a valid hex string.
 */
export function normalizeHexString(s: unknown): string | null {
  if (typeof s !== 'string') return null;
  const match = s.match(/^0x([0-9a-fA-F]{1,4})$/);
  if (!match) return null;
  return '0x' + parseInt(match[1], 16).toString(16);
}

/**
 * Normalizes a raw VIA keyboard definition (v2 or v3) to Remap's
 * KeyboardDefinitionSchema format. Returns null if the definition is
 * missing required fields or has an invalid vendorId/productId format.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeViaDefinition(
  json: any
): KeyboardDefinitionSchema | null {
  if (
    !json ||
    typeof json.name !== 'string' ||
    !json.vendorId ||
    !json.productId ||
    !json.matrix ||
    !json.layouts ||
    !Array.isArray(json.layouts.keymap)
  ) {
    return null;
  }

  const vendorId = normalizeHexString(json.vendorId);
  const productId = normalizeHexString(json.productId);
  if (!vendorId || !productId) return null;

  if (
    typeof json.matrix.rows !== 'number' ||
    typeof json.matrix.cols !== 'number'
  ) {
    return null;
  }

  const normalized: KeyboardDefinitionSchema = {
    name: json.name,
    vendorId,
    productId,
    matrix: { rows: json.matrix.rows, cols: json.matrix.cols },
    layouts: { keymap: json.layouts.keymap },
  };

  if (Array.isArray(json.layouts.labels)) {
    normalized.layouts.labels = json.layouts.labels;
  }

  // v2: lighting string
  if (
    typeof json.lighting === 'string' &&
    VALID_REMAP_LIGHTING_STRINGS.has(json.lighting)
  ) {
    normalized.lighting = json.lighting as KeyboardDefinitionSchema['lighting'];
  } else if (json.lighting && typeof json.lighting === 'object') {
    normalized.lighting = json.lighting;
  }

  // v3: map simple menu string references to Remap lighting where possible
  if (!normalized.lighting && Array.isArray(json.menus)) {
    for (const menu of json.menus) {
      if (typeof menu === 'string' && VIA_MENU_TO_LIGHTING[menu]) {
        normalized.lighting = VIA_MENU_TO_LIGHTING[
          menu
        ] as KeyboardDefinitionSchema['lighting'];
        break;
      }
    }
  }

  // customKeycodes: same structure in VIA v3 and Remap
  if (Array.isArray(json.customKeycodes)) {
    const valid = json.customKeycodes.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (kc: any) =>
        typeof kc.name === 'string' &&
        typeof kc.title === 'string' &&
        typeof kc.shortName === 'string'
    );
    if (valid.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      normalized.customKeycodes = valid.map((kc: any) => ({
        name: kc.name as string,
        title: kc.title as string,
        shortName: kc.shortName as string,
      }));
    }
  }

  return normalized;
}
