## Context

Remap currently supports saving keymaps to Firebase and exporting PDF cheatsheets. Both are server-dependent. Users need a local, portable format for offline backup and cross-environment sharing. The keymap data model already serializes to `{ [pos: string]: number }[]` for Firebase — JSON export reuses this exact format.

## Goals / Non-Goals

**Goals:**

- Allow users to export the current keyboard's full keymap state (all layers, encoder keymaps, layout options, label language) as a downloadable `.json` file
- Allow users to import a previously exported JSON file and apply it to the current keyboard session
- Validate imported JSON structure before applying to prevent runtime errors

**Non-Goals:**

- Cross-keyboard compatibility (imported keymaps target the same product/vendor ID; mismatches warn but don't hard-block)
- Editing the JSON in-app
- Syncing or versioning exported files
- Supporting non-Remap JSON formats (e.g., raw QMK `keymap.c`)

## Decisions

### Decision: Reuse existing serialization helpers

The `buildCurrentKeymapKeycodes()` and `buildCurrentEncodersKeymapKeycodes()` functions in `KeymapSaveDialog.tsx` already convert `IKeymap` → `{ [pos: string]: number }[]`. Export will extract this logic into a shared utility and call it rather than duplicating it.

**Alternative considered:** Inline the logic in the export handler. Rejected because duplication would drift from the Firebase save path.

### Decision: Use `downloadjs` for export (no new dependency)

`downloadjs` is already used by the PDF export. The JSON string will be passed directly with `application/json` MIME type.

**Alternative considered:** `URL.createObjectURL` + anchor click. Works equally well but adds boilerplate; `downloadjs` is already present.

### Decision: JSON schema as a versioned envelope

Exported JSON will include a `version` field (`"1"`) so future format changes can be detected and migrated on import.

```json
{
  "version": "1",
  "vendorId": 0xfeed,
  "productId": 0x6060,
  "productName": "My Keyboard",
  "labelLang": "en-us",
  "layoutOptions": [{ "option": 0, "optionChoice": 0 }],
  "keycodes": [{ "0,0": 4, "0,1": 5 }],
  "encoderKeycodes": [
    { "0": { "clockwise": 0x004b, "counterclockwise": 0x004e } }
  ]
}
```

**Alternative considered:** Export raw `SavedKeymapData` shape. Rejected because it includes Firebase-specific fields (`author_uid`, `status`) that are meaningless locally.

### Decision: Import via `<input type="file">` in a modal dialog

A small dialog will host the file picker and show validation errors inline. This matches the existing `ImportDefDialog` pattern already in the codebase.

### Decision: Soft mismatch warning (not hard block)

If imported `vendorId`/`productId` don't match the connected keyboard, show a warning but allow the user to proceed. Users may legitimately apply a keymap from a keyboard with a different firmware build of the same physical board.

## Risks / Trade-offs

- **Keycode version drift** → If QMK keycode numbering changes between Remap versions, an old export may apply wrong keycodes. Mitigation: the `version` field allows future migration logic; document the risk in the UI tooltip.
- **Partial layer count mismatch** → Imported JSON may have fewer or more layers than the connected keyboard supports. Mitigation: apply only layers that exist in both; ignore extras, leave unspecified layers unchanged.
- **Encoder keymap mismatch** → Imported encoder count may differ. Mitigation: same truncate/ignore strategy as layers.

## Migration Plan

No data migration required — this is a purely additive UI feature. No existing Firebase data or Redux state shape changes.

Rollout: ship behind no feature flag; the buttons are only visible on the Configure page when a keyboard is connected.

## Open Questions

- Should export include the keyboard `title`/`desc` fields (from `SavedKeymapData`) for display on re-import? (Leaning: yes, optional metadata fields.)
- Should import optionally update layout options on the connected keyboard, or only the keycodes? (Leaning: apply layout options too, with a checkbox default-on.)
