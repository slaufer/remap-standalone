## Why

After removing Firebase, the app now requires every user to manually upload a JSON keyboard definition file before they can edit their keymap — a significant friction point that most users won't know how to handle. The VIA project (`the-via/keyboards` on GitHub) maintains a community-sourced library of 1400+ keyboard definitions in a format that is highly compatible with Remap's own schema, providing a ready-made source of definitions that can be bundled directly into the app.

## What Changes

- Add a build-time script that fetches and normalizes VIA keyboard definitions from `the-via/keyboards` into Remap's `KeyboardDefinitionSchema` format
- Bundle the resulting definitions lookup (indexed by `vendorId + productId`) as a static JSON asset shipped with the app
- Update the keyboard connection flow to automatically look up a matching definition from the bundle before falling back to the manual upload prompt
- If a bundled definition is found, skip the `waitingKeyboardDefinitionUpload` phase entirely and proceed directly to `openingKeyboard`
- The manual import dialog remains available as a fallback for keyboards not in the bundle, and to allow overriding a bundled definition

## Capabilities

### New Capabilities

- `bundled-definition-lookup`: Automatic keyboard definition resolution by USB vendor/product ID against a bundled library derived from VIA keyboard definitions

### Modified Capabilities

- None — the manual import capability's requirements are unchanged; it remains as a fallback

## Impact

- **New build dependency**: `the-via/keyboards` repository (fetched at build time, not a runtime npm dependency)
- **New static asset**: `public/definitions/bundled.json` (or similar) — a lookup map indexed by `${vendorId}:${productId}`
- **`src/actions/storage.action.ts`**: `fetchKeyboardDefinitionByDeviceInfo` thunk updated to check bundled definitions before prompting for upload
- **`src/store/state.ts`**: Possibly a new flag to distinguish bundled vs. manually uploaded definitions
- **Build pipeline**: New `scripts/build-definitions.ts` (or similar) script run as part of `yarn build` and `yarn start`
- **Bundle size**: The bundled definitions JSON will be a significant static asset — needs evaluation and possibly lazy loading
