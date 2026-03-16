#!/usr/bin/env node
/**
 * scripts/fetch-via-definitions.mjs
 *
 * Downloads keyboard definitions from the VIA keyboards repository and generates
 * a bundled lookup file at public/definitions/via-bundled.json.
 *
 * VIA keyboards repository: https://github.com/the-via/keyboards
 * Pinned commit: b4b9281282c7f9406ecd477fca20a4d7a0c98315 (2026-03-11)
 *
 * To regenerate the bundled definitions, run:
 *   yarn fetch-definitions
 *
 * The generated file is committed to the repository so that normal builds
 * and CI do not require network access.
 *
 * Normalization strategy:
 * - Required fields (name, vendorId, productId, matrix, layouts.keymap) are copied as-is.
 * - VIA v2 `lighting` strings are passed through if they match Remap's allowed values.
 * - VIA v3 `menus` strings are mapped to Remap lighting strings where a simple mapping exists.
 * - VIA-specific fields (menus, keycodes, firmwareVersion) are dropped.
 * - VIA v3 `customKeycodes` (same format as Remap) are included.
 * - Definitions with missing required fields or invalid vendorId/productId are skipped.
 * - Duplicate keys (vendorId:productId) keep the first occurrence (v3 before v2).
 */

import {
  execSync,
  spawnSync,
} from 'node:child_process';
import {
  mkdtempSync,
  rmSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

// ---- Configuration --------------------------------------------------------

const VIA_REPO_URL = 'https://github.com/the-via/keyboards.git';

/**
 * Pinned commit SHA. Update this (and VIA_COMMIT_DATE) to pull in newer definitions.
 * Always pin to a specific commit for reproducible builds.
 */
const VIA_COMMIT = 'b4b9281282c7f9406ecd477fca20a4d7a0c98315';
const VIA_COMMIT_DATE = '2026-03-11';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = dirname(__dirname);
const OUTPUT_DIR = join(PROJECT_ROOT, 'public', 'definitions');
const OUTPUT_PATH = join(OUTPUT_DIR, 'via-bundled.json');

/**
 * Local directories containing additional keyboard definitions to merge into
 * the bundle. These take priority over VIA definitions for duplicate keys.
 */
const LOCAL_DEFINITION_DIRS = [join(PROJECT_ROOT, 'example-keyboard-defs')];

// ---- Lighting mapping -----------------------------------------------------

const VALID_REMAP_LIGHTING_STRINGS = new Set([
  'none',
  'qmk_backlight',
  'qmk_rgblight',
  'qmk_backlight_rgblight',
  'wt_rgb_backlight',
  'wt_mono_backlight',
]);

// Maps VIA v3 simple menu string references to Remap lighting enum values.
const VIA_MENU_TO_LIGHTING = {
  qmk_backlight: 'qmk_backlight',
  qmk_rgblight: 'qmk_rgblight',
  qmk_backlight_rgblight: 'qmk_backlight_rgblight',
};

// ---- Hex normalization ----------------------------------------------------

/**
 * Normalizes a hex string like "0x4848" or "0xA103" to a canonical lowercase
 * form without leading zeros: "0x4848" → "0x4848", "0x0001" → "0x1".
 * Returns null if the input is not a valid hex string.
 */
function normalizeHexString(s) {
  if (typeof s !== 'string') return null;
  const match = s.match(/^0x([0-9a-fA-F]{1,4})$/);
  if (!match) return null;
  return '0x' + parseInt(match[1], 16).toString(16);
}

/**
 * Builds the lookup key from a vendorId and productId hex string.
 * Both are normalized to lowercase without leading zeros.
 */
function makeLookupKey(vendorId, productId) {
  return `${normalizeHexString(vendorId)}:${normalizeHexString(productId)}`;
}

// ---- Definition normalization ---------------------------------------------

/**
 * Normalizes a raw VIA keyboard definition (v2 or v3) to Remap's
 * KeyboardDefinitionSchema format. Returns null if the definition is
 * missing required fields or has invalid vendorId/productId.
 */
function normalizeDefinition(json) {
  // Required fields
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

  const normalized = {
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
    normalized.lighting = json.lighting;
  } else if (json.lighting && typeof json.lighting === 'object') {
    // Object-form lighting (extended definitions)
    normalized.lighting = json.lighting;
  }

  // v3: map simple menu strings to Remap lighting where possible
  if (!normalized.lighting && Array.isArray(json.menus)) {
    for (const menu of json.menus) {
      if (typeof menu === 'string' && VIA_MENU_TO_LIGHTING[menu]) {
        normalized.lighting = VIA_MENU_TO_LIGHTING[menu];
        break;
      }
    }
  }

  // customKeycodes: same structure in VIA v3 and Remap
  if (Array.isArray(json.customKeycodes)) {
    const valid = json.customKeycodes.filter(
      (kc) =>
        typeof kc.name === 'string' &&
        typeof kc.title === 'string' &&
        typeof kc.shortName === 'string'
    );
    if (valid.length > 0) {
      normalized.customKeycodes = valid.map((kc) => ({
        name: kc.name,
        title: kc.title,
        shortName: kc.shortName,
      }));
    }
  }

  return normalized;
}

// ---- File utilities -------------------------------------------------------

function findJsonFiles(dir, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      findJsonFiles(fullPath, results);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      results.push(fullPath);
    }
  }
  return results;
}

// ---- Main -----------------------------------------------------------------

const tmpDir = mkdtempSync(join(tmpdir(), 'via-keyboards-'));
let added = 0;
let skipped = 0;
let duplicates = 0;
const lookup = {};

try {
  console.log(
    `Cloning VIA keyboards repository (commit ${VIA_COMMIT.slice(0, 8)}, dated ${VIA_COMMIT_DATE})...`
  );

  // Sparse checkout: only fetch v3/ (current format) and src/ (legacy v2)
  execSync(`git init "${tmpDir}"`, { stdio: 'pipe' });
  execSync(`git -C "${tmpDir}" remote add origin "${VIA_REPO_URL}"`, {
    stdio: 'pipe',
  });
  execSync(`git -C "${tmpDir}" config core.sparseCheckout true`, {
    stdio: 'pipe',
  });

  const sparseCheckoutPath = join(tmpDir, '.git', 'info', 'sparse-checkout');
  writeFileSync(sparseCheckoutPath, 'v3/\nsrc/\n');

  console.log('Fetching (this may take a moment)...');
  execSync(`git -C "${tmpDir}" fetch --depth 1 origin "${VIA_COMMIT}"`, {
    stdio: 'inherit',
  });
  execSync(`git -C "${tmpDir}" checkout FETCH_HEAD`, { stdio: 'pipe' });

  // Process v3 first (preferred over legacy v2 for duplicate keys)
  const v3Files = findJsonFiles(join(tmpDir, 'v3'));
  const srcFiles = findJsonFiles(join(tmpDir, 'src'));
  const allFiles = [...v3Files, ...srcFiles];

  console.log(
    `Found ${v3Files.length} v3 and ${srcFiles.length} v2 definitions. Processing...`
  );

  for (const filePath of allFiles) {
    let json;
    try {
      json = JSON.parse(readFileSync(filePath, 'utf8'));
    } catch {
      console.warn(`  SKIP (parse error): ${filePath}`);
      skipped++;
      continue;
    }

    const normalized = normalizeDefinition(json);
    if (!normalized) {
      const name = json?.name ?? filePath;
      console.warn(`  SKIP (invalid/incomplete): ${name}`);
      skipped++;
      continue;
    }

    const key = makeLookupKey(normalized.vendorId, normalized.productId);

    if (lookup[key]) {
      // Keep first occurrence (v3 over v2)
      duplicates++;
      continue;
    }

    lookup[key] = normalized;
    added++;
  }

  // Merge local definitions (override VIA for duplicate keys)
  const localFiles = LOCAL_DEFINITION_DIRS.flatMap((dir) =>
    findJsonFiles(dir)
  );
  if (localFiles.length > 0) {
    console.log(`\nMerging ${localFiles.length} local definition(s)...`);
    for (const filePath of localFiles) {
      let json;
      try {
        json = JSON.parse(readFileSync(filePath, 'utf8'));
      } catch {
        console.warn(`  SKIP (parse error): ${filePath}`);
        skipped++;
        continue;
      }

      const normalized = normalizeDefinition(json);
      if (!normalized) {
        const name = json?.name ?? filePath;
        console.warn(`  SKIP (invalid/incomplete): ${name}`);
        skipped++;
        continue;
      }

      const key = makeLookupKey(normalized.vendorId, normalized.productId);
      if (lookup[key]) {
        console.log(`  OVERRIDE: ${normalized.name} (replaces existing entry for ${key})`);
        duplicates++;
      } else {
        added++;
      }
      lookup[key] = normalized;
      console.log(`  Added: ${normalized.name} (${key})`);
    }
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(lookup, null, 2));

  console.log('\nDone!');
  console.log(`  Added:      ${added}`);
  console.log(`  Skipped:    ${skipped}`);
  console.log(`  Duplicates: ${duplicates}`);
  console.log(`  Output:     ${OUTPUT_PATH}`);
} finally {
  rmSync(tmpDir, { recursive: true, force: true });
}
