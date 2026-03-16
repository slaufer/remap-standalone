import { describe, it, expect } from 'vitest';
import {
  normalizeViaDefinition,
  normalizeHexString,
} from './ViaDefinitionNormalizer';

const MINIMAL_KEYMAP = [['0,0', '0,1']];

describe('ViaDefinitionNormalizer', () => {
  describe('normalizeHexString', () => {
    it('normalizes a 4-digit hex string without leading zeros', () => {
      expect(normalizeHexString('0x4848')).toBe('0x4848');
    });

    it('strips leading zeros', () => {
      expect(normalizeHexString('0x0001')).toBe('0x1');
    });

    it('normalizes uppercase to lowercase', () => {
      expect(normalizeHexString('0xA103')).toBe('0xa103');
    });

    it('returns null for invalid input', () => {
      expect(normalizeHexString('not-a-hex')).toBeNull();
      expect(normalizeHexString(12345)).toBeNull();
      expect(normalizeHexString(null)).toBeNull();
    });
  });

  describe('normalizeViaDefinition', () => {
    it('normalizes a valid v2 definition with lighting string', () => {
      const v2 = {
        name: 'My Keyboard v2',
        vendorId: '0x4848',
        productId: '0x0001',
        matrix: { rows: 5, cols: 14 },
        lighting: 'qmk_backlight_rgblight',
        layouts: {
          labels: [['Backspace', 'Unified', 'Split']],
          keymap: MINIMAL_KEYMAP,
        },
      };

      const result = normalizeViaDefinition(v2);

      expect(result).not.toBeNull();
      expect(result!.name).toBe('My Keyboard v2');
      expect(result!.vendorId).toBe('0x4848');
      expect(result!.productId).toBe('0x1'); // leading zero stripped
      expect(result!.matrix).toEqual({ rows: 5, cols: 14 });
      expect(result!.lighting).toBe('qmk_backlight_rgblight');
      expect(result!.layouts.labels).toEqual([
        ['Backspace', 'Unified', 'Split'],
      ]);
    });

    it('normalizes a valid v3 definition and maps menus to lighting', () => {
      const v3 = {
        name: 'My Keyboard v3',
        vendorId: '0xa103',
        productId: '0x0002',
        matrix: { rows: 5, cols: 14 },
        keycodes: ['qmk_lighting'],
        menus: ['qmk_rgblight'],
        layouts: {
          labels: [['Enter', 'ANSI', 'ISO']],
          keymap: MINIMAL_KEYMAP,
        },
        customKeycodes: [
          { name: 'MY_KEY', title: 'My Custom Key', shortName: 'MCK' },
        ],
      };

      const result = normalizeViaDefinition(v3);

      expect(result).not.toBeNull();
      expect(result!.name).toBe('My Keyboard v3');
      expect(result!.vendorId).toBe('0xa103');
      expect(result!.productId).toBe('0x2');
      expect(result!.lighting).toBe('qmk_rgblight');
      expect(result!.customKeycodes).toEqual([
        { name: 'MY_KEY', title: 'My Custom Key', shortName: 'MCK' },
      ]);
      // VIA-specific fields should NOT be present
      expect((result as any).menus).toBeUndefined();
      expect((result as any).keycodes).toBeUndefined();
    });

    it('returns null when name is missing', () => {
      const def = {
        vendorId: '0x4848',
        productId: '0x0001',
        matrix: { rows: 5, cols: 14 },
        layouts: { keymap: MINIMAL_KEYMAP },
      };
      expect(normalizeViaDefinition(def)).toBeNull();
    });

    it('returns null when vendorId is missing', () => {
      const def = {
        name: 'Test',
        productId: '0x0001',
        matrix: { rows: 5, cols: 14 },
        layouts: { keymap: MINIMAL_KEYMAP },
      };
      expect(normalizeViaDefinition(def)).toBeNull();
    });

    it('returns null when vendorId has invalid format', () => {
      const def = {
        name: 'Test',
        vendorId: 'invalid',
        productId: '0x0001',
        matrix: { rows: 5, cols: 14 },
        layouts: { keymap: MINIMAL_KEYMAP },
      };
      expect(normalizeViaDefinition(def)).toBeNull();
    });

    it('returns null when layouts.keymap is missing', () => {
      const def = {
        name: 'Test',
        vendorId: '0x4848',
        productId: '0x0001',
        matrix: { rows: 5, cols: 14 },
        layouts: {},
      };
      expect(normalizeViaDefinition(def)).toBeNull();
    });

    it('drops unrecognized v2 lighting strings', () => {
      const def = {
        name: 'Test',
        vendorId: '0x4848',
        productId: '0x0001',
        matrix: { rows: 5, cols: 14 },
        lighting: 'some_unknown_lighting',
        layouts: { keymap: MINIMAL_KEYMAP },
      };
      const result = normalizeViaDefinition(def);
      expect(result).not.toBeNull();
      expect(result!.lighting).toBeUndefined();
    });
  });
});
