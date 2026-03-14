## Why

Users currently can only save/load keymaps via Firebase (requiring an account and internet connection), or export as a PDF cheatsheet. There is no way to export a keymap as a portable JSON file for offline backup, sharing outside the platform, or migrating between environments without going through Firebase.

## What Changes

- Add a **JSON export** action to the Configure keymap toolbar that downloads the current keymap (all layers + encoder keymaps + layout options) as a `.json` file
- Add a **JSON import** action to the Configure keymap toolbar that reads a previously exported `.json` file and applies it to the current keyboard session

## Capabilities

### New Capabilities

- `keymap-json-export`: Serialize the current keyboard's full keymap (all layers, encoder keymaps, layout options, label language) into a structured JSON file and trigger a browser download
- `keymap-json-import`: Parse an exported keymap JSON file, validate its structure, convert numeric keycodes back to `IKeymap` objects, and apply the result to the current keyboard session

### Modified Capabilities

<!-- No existing spec-level behavior changes -->

## Impact

- `src/components/configure/keymapToolbar/KeymapToolbar.tsx` — add Export JSON and Import JSON menu items
- New dialog or inline handler for import (file picker + validation feedback)
- Reuses `downloadjs` (already a dependency) for the export download
- Reuses `KeycodeList.getKeymap()` for converting imported numeric codes to `IKeymap`
- Reuses `buildCurrentKeymapKeycodes()` / `buildCurrentEncodersKeymapKeycodes()` logic from `KeymapSaveDialog.tsx` for serialization
- No new dependencies required
- No breaking changes; export/import are purely additive UI features
