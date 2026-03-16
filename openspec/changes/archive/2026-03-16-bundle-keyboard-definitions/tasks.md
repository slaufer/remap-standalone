## 1. Research and Validate VIA Definition Format

- [x] 1.1 Clone or download a snapshot of `the-via/keyboards` and inspect the JSON definition format for both v2 and v3 definitions
- [x] 1.2 Identify a specific VIA release tag to pin to and document it in the build script
- [x] 1.3 Spot-check 5-10 definitions to confirm `layouts.keymap` KLE format is compatible with Remap's `KeyboardDefinitionSchema`

## 2. Build Script — Fetch and Normalize Definitions

- [x] 2.1 Create `scripts/fetch-via-definitions.ts` (or `.mjs`) that downloads the pinned VIA keyboards snapshot
- [x] 2.2 Implement normalization logic: extract `name`, `vendorId`, `productId`, `matrix`, `layouts` (keymap + labels); map v2 `lighting` strings; drop VIA-specific fields
- [x] 2.3 Run each normalized definition through Remap's existing `Validator.ts` schema validation; skip and log any that fail
- [x] 2.4 Write output as `public/definitions/via-bundled.json` — a flat object keyed by `"${vendorId.toLowerCase()}:${productId.toLowerCase()}"`
- [x] 2.5 Add the script as a `yarn fetch-definitions` command in `package.json` and integrate it into `yarn build` (or run once and commit the snapshot)
- [x] 2.6 Add `public/definitions/via-bundled.json` to `.gitignore` if it is generated at build time, OR commit a snapshot if generated once

## 3. Bundled Definition Lookup Service

- [x] 3.1 Create `src/services/storage/BundledDefinitions.ts` — a module that lazy-loads `via-bundled.json` (via `fetch` or dynamic import) and exposes a `findByDeviceInfo(vendorId: number, productId: number): Promise<KeyboardDefinitionSchema | null>` function
- [x] 3.2 Handle fetch errors gracefully in `BundledDefinitions.ts` — catch and return `null` so callers always get a clean result

## 4. Integrate into Keyboard Connection Flow

- [x] 4.1 Update `fetchKeyboardDefinitionByDeviceInfo` in `src/actions/storage.action.ts` to call `BundledDefinitions.findByDeviceInfo` before dispatching `waitingKeyboardDefinitionUpload`
- [x] 4.2 If a bundled definition is found, dispatch `storageActionsThunk.uploadKeyboardDefinition(definition)` directly (reusing the existing action that loads the definition and opens the keyboard)
- [x] 4.3 If lookup fails or returns null, fall back to existing `waitingKeyboardDefinitionUpload` dispatch — no behavior change for unsupported keyboards

## 5. Manual Import Override

- [x] 5.1 Verify that the existing `ImportDefDialog` and `uploadKeyboardDefinition` action remain reachable after a bundled definition is auto-loaded (no UI changes needed if the import button is already always visible in `openedKeyboard` phase)
- [x] 5.2 If the import button is hidden once a definition is loaded, update the relevant container/component to keep it accessible regardless of how the definition was loaded

## 6. Testing

- [x] 6.1 Write a unit test for `BundledDefinitions.findByDeviceInfo` covering: found match, no match, fetch error fallback
- [x] 6.2 Write a unit test for the normalization logic in the build script (or a utility it extracts) covering: valid v2 definition, valid v3 definition, definition missing required fields
- [x] 6.3 Manual integration test: connect a keyboard whose VIA definition exists in the bundle and verify it loads without the upload dialog
- [x] 6.4 Manual integration test: connect a keyboard not in the bundle and verify the upload dialog still appears

## 7. Documentation and Cleanup

- [x] 7.1 Document the VIA snapshot version and regeneration steps in a comment at the top of `scripts/fetch-via-definitions.mjs`
- [x] 7.2 Run `yarn type-check`, `yarn lint`, `yarn format`, and `yarn test --run` and resolve any issues
