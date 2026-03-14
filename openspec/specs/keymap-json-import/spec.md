# keymap-json-import Specification

## Purpose

TBD - created by archiving change add-json-keymap-import-export. Update Purpose after archive.

## Requirements

### Requirement: User can import keymap from JSON file

The system SHALL provide an "Import JSON" action in the Configure page keymap toolbar menu. When triggered, the system SHALL open a dialog with a file picker. Upon file selection, the system SHALL parse, validate, and apply the keymap to the current keyboard session without saving to Firebase.

#### Scenario: Import dialog opens on action click

- **WHEN** the user selects "Import JSON" from the keymap toolbar menu
- **THEN** a modal dialog opens containing a file input control and a confirm/cancel action

#### Scenario: Valid JSON file is parsed and applied

- **WHEN** the user selects a valid Remap keymap JSON file and confirms
- **THEN** the system converts the numeric keycodes to `IKeymap` objects using `KeycodeList.getKeymap()`
- **AND** the system updates the Redux keymap state for all layers present in the file
- **AND** the system updates the encoder keymap state for all encoders present in the file
- **AND** the physical keyboard receives the updated keymaps via the existing HID write path

### Requirement: JSON import validates file structure before applying

The system SHALL validate the structure of an imported JSON file before applying any changes. If validation fails, the system SHALL display an error message in the import dialog and SHALL NOT modify the current keymap state.

#### Scenario: File with missing required fields is rejected

- **WHEN** the user selects a JSON file that is missing required top-level fields (`version`, `keycodes`)
- **THEN** the system displays an inline error message describing the problem
- **AND** the import dialog remains open for the user to select a different file

#### Scenario: File with unrecognized version is rejected

- **WHEN** the user selects a JSON file with a `version` value that the system does not support
- **THEN** the system displays an error indicating the format version is not supported

#### Scenario: Non-JSON file is rejected

- **WHEN** the user selects a file that cannot be parsed as JSON
- **THEN** the system displays an error message stating the file is not valid JSON

### Requirement: Mismatched keyboard identity shows a warning

When the `vendorId` or `productId` in the imported JSON does not match the currently connected keyboard, the system SHALL display a non-blocking warning to the user but SHALL still allow them to proceed with the import.

#### Scenario: VendorId or ProductId mismatch with warning

- **WHEN** the parsed JSON has `vendorId` or `productId` different from the connected keyboard
- **THEN** the system displays a warning message in the import dialog (e.g., "This keymap was exported from a different keyboard.")
- **AND** the user can still confirm and apply the import

#### Scenario: Matching keyboard proceeds without warning

- **WHEN** the parsed JSON `vendorId` and `productId` match the connected keyboard
- **THEN** no mismatch warning is shown and the confirm button applies the keymap normally

### Requirement: Layer count mismatch is handled gracefully

If the imported JSON contains more or fewer layers than the connected keyboard supports, the system SHALL apply only the layers that exist in both without error.

#### Scenario: Fewer layers in import than keyboard supports

- **WHEN** the imported JSON has fewer layer entries than the connected keyboard's layer count
- **THEN** only the layers present in the JSON are updated; remaining layers are left unchanged

#### Scenario: More layers in import than keyboard supports

- **WHEN** the imported JSON has more layer entries than the connected keyboard's layer count
- **THEN** only layers within the keyboard's supported range are applied; extra layers in the JSON are silently ignored
