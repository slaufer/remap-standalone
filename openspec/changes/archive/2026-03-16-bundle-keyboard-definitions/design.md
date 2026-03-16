## Context

After removing Firebase, `fetchKeyboardDefinitionByDeviceInfo` in `src/actions/storage.action.ts` unconditionally transitions to `waitingKeyboardDefinitionUpload`, requiring every user to manually locate and upload a JSON definition file. The VIA project (`github.com/the-via/keyboards`) maintains a community library of 1400+ keyboard definitions whose core schema (`name`, `vendorId`, `productId`, `matrix`, `layouts.keymap`) is directly compatible with Remap's `KeyboardDefinitionSchema`. Bundling these definitions eliminates the friction for the majority of supported keyboards.

## Goals / Non-Goals

**Goals:**

- Zero-effort keyboard recognition for keyboards present in the VIA library
- Build-time normalization of VIA definitions to Remap's schema
- Static asset distribution — no runtime network requests
- Manual import remains fully functional as an override/fallback

**Non-Goals:**

- Syncing or updating definitions at runtime
- Supporting VIA v3 `menus` system or advanced VIA protocol features
- Bundling definitions from other sources (Vial, QMK, etc.) in this change
- Automatic firmware flashing or QMK-level integration

## Decisions

### Decision 1: Build-time fetch and normalize, ship as static JSON

**Chosen**: A Node.js build script (`scripts/fetch-via-definitions.ts`) clones or downloads a release snapshot of `the-via/keyboards`, normalizes each definition to `KeyboardDefinitionSchema`, and writes a single `public/definitions/via-bundled.json` lookup file indexed by `"${vendorId}:${productId}"` (lowercase hex).

**Alternatives considered:**

- _Runtime fetch from GitHub at app start_: Adds network dependency, latency, CORS complexity, and a GitHub rate-limit risk. Rejected.
- _npm package for VIA definitions_: No official published package exists. Could publish one ourselves, but that adds maintenance overhead. Rejected.
- _Submodule_: Tightly couples release cadence. Rejected in favor of a snapshot download with a pinned tag/commit.

### Decision 2: Lazy-load the bundled definitions JSON

**Chosen**: The `via-bundled.json` file is loaded via a dynamic `import()` (or `fetch('/definitions/via-bundled.json')`) only when a keyboard connects, not at app startup. This avoids adding the full bundle (potentially 1-2 MB) to the initial JS bundle.

**Alternatives considered:**

- _Inline into JS bundle_: Simpler but increases initial load time significantly. Rejected.
- _Split by vendor prefix_: More complex, marginal benefit. Rejected for now.

### Decision 3: VIA-to-Remap normalization strategy

**Chosen**: Extract only the fields Remap requires: `name`, `vendorId`, `productId`, `matrix`, `layouts` (keymap + labels). Map VIA v2 `lighting` strings to Remap's `lighting` enum where they match; otherwise drop lighting entirely. Ignore `menus`, `keycodes`, `firmwareVersion`, and other VIA-specific fields.

The normalization script will:

1. Parse each VIA definition JSON
2. Validate required fields are present
3. Emit a `KeyboardDefinitionSchema`-compatible object
4. Skip definitions that cannot be normalized (log warnings)

### Decision 4: Lookup key format

**Chosen**: `"${vendorId.toLowerCase()}:${productId.toLowerCase()}"` (e.g., `"0x4848:0x0001"`). Both VIA and Remap store these as hex strings; normalizing to lowercase handles any case inconsistencies.

The lookup structure in `via-bundled.json`:

```json
{
  "0x4848:0x0001": { ...KeyboardDefinitionSchema },
  ...
}
```

### Decision 5: Integration point in the Redux flow

**Chosen**: Modify `fetchKeyboardDefinitionByDeviceInfo` to:

1. Build the lookup key from the provided `vendorId` (number) and `productId` (number) by formatting them as hex strings
2. Attempt a lazy fetch of `via-bundled.json`
3. If a matching definition is found, dispatch `uploadKeyboardDefinition` directly (reusing existing action)
4. If not found, fall back to `waitingKeyboardDefinitionUpload` as today

No new Redux state is needed for the MVP — the definition is just loaded as if the user uploaded it manually.

## Risks / Trade-offs

- **Bundle freshness**: The bundled definitions reflect a snapshot of VIA at build time. Newly added keyboards won't be available until a new app release.
  → Mitigation: Document the VIA commit/tag used in the build; provide a manual override path that always works.

- **Definition accuracy**: Some VIA definitions may have errors (wrong matrix size, bad keymap coordinates) that weren't validated by the VIA repo.
  → Mitigation: The existing `Validator.ts` schema validation can be run during normalization to reject malformed entries.

- **Asset size**: 1400+ definitions as a single JSON could reach 2-5 MB uncompressed. Lazy loading (Decision 2) and gzip compression at the server level mitigates perceived impact.
  → Mitigation: Measure actual size and split by vendor if needed in a follow-up.

- **VIA v2 vs v3 format differences**: The `layouts` structure is stable across versions; `lighting` changed significantly in v3.
  → Mitigation: Normalization script handles v2 `lighting` strings; v3 `menus` are ignored entirely.

## Migration Plan

1. Add build script — no impact on existing functionality
2. Generate `via-bundled.json` — new static asset, no breaking change
3. Update `fetchKeyboardDefinitionByDeviceInfo` — transparent to user; falls back gracefully if asset missing or no match
4. No rollback complexity; removing the lookup file or reverting the thunk restores previous behavior exactly

## Open Questions

- Should we pin to a specific VIA release tag, or always use `HEAD` of the main branch at build time? (Recommend pinned tag for reproducibility.)
- Should the build script run as part of `yarn build` / `yarn start`, or as a separate opt-in step (e.g., `yarn fetch-definitions`)? (Recommend part of `yarn build` with a cached/committed snapshot to avoid requiring network access in CI.)
