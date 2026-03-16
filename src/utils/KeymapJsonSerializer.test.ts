import { describe, expect, it, vi } from 'vitest';
import {
  buildEncoderKeymapKeycodes,
  buildKeymapKeycodes,
  convertJsonDataToEncoderRemaps,
  convertJsonDataToRemaps,
  deserializeKeymapFromJson,
  KeymapJsonData,
  KEYMAP_JSON_VERSION,
  serializeKeymapToJson,
} from './KeymapJsonSerializer';
import { IKeymap } from '../services/hid/Hid';
import { MOD_LEFT } from '../services/hid/Constraints';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeKeymap(code: number): IKeymap {
  return {
    isAny: false,
    code,
    kinds: [],
    direction: MOD_LEFT,
    modifiers: [],
    keycodeInfo: {
      code,
      label: `KC_${code}`,
      name: { long: `KC_${code}`, short: `K${code}` },
      keywords: [],
    },
  };
}

const LABEL_LANG = 'en-us' as const;
const LAYOUT_OPTIONS = [{ option: 0, optionChoice: 0 }];

// ---------------------------------------------------------------------------
// serializeKeymapToJson
// ---------------------------------------------------------------------------

describe('serializeKeymapToJson', () => {
  it('produces the expected envelope shape', () => {
    const layer0 = { '0,0': makeKeymap(4), '0,1': makeKeymap(5) };
    const layer1 = { '0,0': makeKeymap(6), '0,1': makeKeymap(7) };

    const result = serializeKeymapToJson({
      keymaps: [layer0, layer1],
      encodersKeymaps: undefined,
      layerCount: 2,
      vendorId: 0xfeed,
      productId: 0x6060,
      productName: 'Test KB',
      labelLang: LABEL_LANG,
      layoutOptions: LAYOUT_OPTIONS,
    });

    expect(result.version).toBe(KEYMAP_JSON_VERSION);
    expect(result.vendorId).toBe(0xfeed);
    expect(result.productId).toBe(0x6060);
    expect(result.productName).toBe('Test KB');
    expect(result.labelLang).toBe(LABEL_LANG);
    expect(result.layoutOptions).toEqual(LAYOUT_OPTIONS);
  });

  it('includes all layers in order', () => {
    const layer0 = { '0,0': makeKeymap(4) };
    const layer1 = { '0,0': makeKeymap(6) };
    const layer2 = { '0,0': makeKeymap(8) };

    const result = serializeKeymapToJson({
      keymaps: [layer0, layer1, layer2],
      encodersKeymaps: undefined,
      layerCount: 3,
      vendorId: 1,
      productId: 2,
      productName: 'KB',
      labelLang: LABEL_LANG,
      layoutOptions: [],
    });

    expect(result.keycodes).toHaveLength(3);
    expect(result.keycodes[0]['0,0']).toBe(4);
    expect(result.keycodes[1]['0,0']).toBe(6);
    expect(result.keycodes[2]['0,0']).toBe(8);
  });

  it('includes encoder keymaps when present', () => {
    const layer0 = { '0,0': makeKeymap(4) };
    const encoderLayer0 = {
      0: {
        clockwise: makeKeymap(0x004b),
        counterclockwise: makeKeymap(0x004e),
      },
    };

    const result = serializeKeymapToJson({
      keymaps: [layer0],
      encodersKeymaps: [encoderLayer0],
      layerCount: 1,
      vendorId: 1,
      productId: 2,
      productName: 'KB',
      labelLang: LABEL_LANG,
      layoutOptions: [],
    });

    expect(result.encoderKeycodes).toHaveLength(1);
    expect(result.encoderKeycodes[0][0].clockwise).toBe(0x004b);
    expect(result.encoderKeycodes[0][0].counterclockwise).toBe(0x004e);
  });

  it('fills encoder keycodes with empty objects when encodersKeymaps is undefined', () => {
    const result = serializeKeymapToJson({
      keymaps: [{ '0,0': makeKeymap(4) }],
      encodersKeymaps: undefined,
      layerCount: 1,
      vendorId: 1,
      productId: 2,
      productName: 'KB',
      labelLang: LABEL_LANG,
      layoutOptions: [],
    });

    expect(result.encoderKeycodes).toHaveLength(1);
    expect(result.encoderKeycodes[0]).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// deserializeKeymapFromJson
// ---------------------------------------------------------------------------

function makeValidJson(overrides: Partial<KeymapJsonData> = {}): string {
  const data: KeymapJsonData = {
    version: '1',
    vendorId: 0xfeed,
    productId: 0x6060,
    productName: 'Test KB',
    labelLang: LABEL_LANG,
    layoutOptions: [],
    keycodes: [{ '0,0': 4 }],
    encoderKeycodes: [{}],
    ...overrides,
  };
  return JSON.stringify(data);
}

describe('deserializeKeymapFromJson', () => {
  it('succeeds for a valid file', () => {
    const result = deserializeKeymapFromJson(makeValidJson());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.version).toBe('1');
      expect(result.data.keycodes).toHaveLength(1);
    }
  });

  it('fails for non-JSON input', () => {
    const result = deserializeKeymapFromJson('not json at all');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/not valid JSON/i);
    }
  });

  it('fails when version field is missing', () => {
    const obj = JSON.parse(makeValidJson()) as Record<string, unknown>;
    delete obj['version'];
    const result = deserializeKeymapFromJson(JSON.stringify(obj));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/version/i);
    }
  });

  it('fails when keycodes field is missing', () => {
    const obj = JSON.parse(makeValidJson()) as Record<string, unknown>;
    delete obj['keycodes'];
    const result = deserializeKeymapFromJson(JSON.stringify(obj));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/keycodes/i);
    }
  });

  it('fails for an unsupported version', () => {
    const result = deserializeKeymapFromJson(makeValidJson({ version: '99' }));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/unsupported/i);
    }
  });
});

// ---------------------------------------------------------------------------
// Layer count handling via convertJsonDataToRemaps
// ---------------------------------------------------------------------------

describe('convertJsonDataToRemaps – layer count handling', () => {
  // Mock KeycodeList.getKeymap so tests don't depend on full keycode tables
  vi.mock('../services/hid/KeycodeList', () => ({
    KeycodeList: {
      getKeymap: (code: number) => makeKeymap(code),
    },
  }));

  const baseData: KeymapJsonData = {
    version: '1',
    vendorId: 1,
    productId: 2,
    productName: 'KB',
    labelLang: LABEL_LANG,
    layoutOptions: [],
    keycodes: [
      { '0,0': 10, '0,1': 11 }, // layer 0
      { '0,0': 20, '0,1': 21 }, // layer 1
    ],
    encoderKeycodes: [{}, {}],
  };

  it('applies only layers present in the imported JSON when fewer layers in import', () => {
    // Current keyboard has 3 layers, import only has 2
    const currentKeymaps = [
      { '0,0': makeKeymap(4), '0,1': makeKeymap(5) }, // layer 0
      { '0,0': makeKeymap(6), '0,1': makeKeymap(7) }, // layer 1
      { '0,0': makeKeymap(8), '0,1': makeKeymap(9) }, // layer 2 (not in import)
    ];

    const remaps = convertJsonDataToRemaps(baseData, currentKeymaps, undefined);

    // Layers 0 and 1 have changes; layer 2 is empty (unchanged)
    expect(remaps).toHaveLength(3);
    expect(Object.keys(remaps[0])).not.toHaveLength(0);
    expect(Object.keys(remaps[1])).not.toHaveLength(0);
    expect(Object.keys(remaps[2])).toHaveLength(0);
  });

  it('ignores extra layers in the import beyond keyboard layer count', () => {
    // Current keyboard has only 1 layer, import has 2
    const currentKeymaps = [
      { '0,0': makeKeymap(4), '0,1': makeKeymap(5) }, // layer 0 only
    ];

    const remaps = convertJsonDataToRemaps(baseData, currentKeymaps, undefined);

    // Only 1 remap entry (matching current keyboard layers)
    expect(remaps).toHaveLength(1);
    expect(Object.keys(remaps[0])).not.toHaveLength(0);
  });
});
