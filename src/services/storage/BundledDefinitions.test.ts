import { describe, it, expect, vi, beforeEach } from 'vitest';

const SAMPLE_DEFINITION = {
  name: 'Test Keyboard',
  vendorId: '0x4848',
  productId: '0x1',
  matrix: { rows: 5, cols: 14 },
  layouts: {
    keymap: [['0,0', '0,1']],
  },
};

// Lookup key: "0x4848:0x1"
const SAMPLE_LOOKUP = {
  '0x4848:0x1': SAMPLE_DEFINITION,
};

describe('BundledDefinitions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Reset the module cache between tests so cachedLookup is cleared
    vi.resetModules();
  });

  describe('findByDeviceInfo', () => {
    it('returns the matching definition when vendorId and productId match', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => SAMPLE_LOOKUP,
        })
      );

      // Re-import to get a fresh module with cleared cache
      const { findByDeviceInfo: find } = await import('./BundledDefinitions');
      const result = await find(0x4848, 0x1);

      expect(result).not.toBeNull();
      expect(result!.name).toBe('Test Keyboard');
      expect(result!.vendorId).toBe('0x4848');
    });

    it('returns null when no match found in bundle', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => SAMPLE_LOOKUP,
        })
      );

      const { findByDeviceInfo: find } = await import('./BundledDefinitions');
      const result = await find(0x9999, 0x1234);

      expect(result).toBeNull();
    });

    it('returns null and does not throw when fetch returns non-ok response', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
        })
      );

      const { findByDeviceInfo: find } = await import('./BundledDefinitions');
      const result = await find(0x4848, 0x1);

      expect(result).toBeNull();
    });

    it('returns null and does not throw when fetch throws a network error', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new Error('Network error'))
      );

      const { findByDeviceInfo: find } = await import('./BundledDefinitions');
      const result = await find(0x4848, 0x1);

      expect(result).toBeNull();
    });
  });
});
