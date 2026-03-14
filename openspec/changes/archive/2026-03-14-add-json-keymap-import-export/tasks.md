## 1. Shared Serialization Utility

- [x] 1.1 Extract `buildCurrentKeymapKeycodes()` and `buildCurrentEncodersKeymapKeycodes()` logic from `KeymapSaveDialog.tsx` into a shared utility (e.g., `src/utils/keymapSerializer.ts`)
- [x] 1.2 Add a `serializeKeymapToJson()` function that accepts keymap state + metadata and returns the versioned JSON envelope object (version, vendorId, productId, productName, labelLang, layoutOptions, keycodes, encoderKeycodes)
- [x] 1.3 Add a `deserializeKeymapFromJson()` function that parses raw JSON, validates required fields and version, and returns typed data or a validation error

## 2. JSON Export Feature

- [x] 2.1 Add an "Export JSON" menu item to `KeymapToolbar.tsx` (disabled when no keyboard connected)
- [x] 2.2 Wire the menu item to call `serializeKeymapToJson()` with current Redux state and trigger a `downloadjs` download with `application/json` MIME type and filename `keymap_<productName>.json`

## 3. JSON Import Dialog

- [x] 3.1 Create `KeymapImportJsonDialog.tsx` component with a file `<input type="file" accept=".json">`, inline validation error display, mismatch warning section, and confirm/cancel buttons
- [x] 3.2 Create `KeymapImportJsonDialog.container.ts` to connect the dialog to Redux state (current keyboard vendorId/productId, dispatch for keymap apply)
- [x] 3.3 Add an "Import JSON" menu item to `KeymapToolbar.tsx` that opens the dialog (disabled when no keyboard connected)

## 4. Import Application Logic

- [x] 4.1 In the dialog confirm handler, call `deserializeKeymapFromJson()` and show validation errors inline if it fails
- [x] 4.2 Convert imported numeric keycodes to `IKeymap` objects using `KeycodeList.getKeymap()` for each position across all layers
- [x] 4.3 Dispatch a Redux action to update the keymap state (applying only layers within the keyboard's supported layer count, ignoring excess layers)
- [x] 4.4 Apply updated encoder keymaps similarly (truncate/ignore extras)
- [x] 4.5 Trigger the existing HID write path to push the updated keymaps to the physical keyboard

## 5. Tests

- [x] 5.1 Unit test `serializeKeymapToJson()`: verify output shape, version field, and that all layers/encoders are included
- [x] 5.2 Unit test `deserializeKeymapFromJson()`: valid file passes, missing `version` fails, missing `keycodes` fails, unknown version fails, non-JSON string fails
- [x] 5.3 Unit test layer count handling: fewer layers applied correctly, extra layers ignored
