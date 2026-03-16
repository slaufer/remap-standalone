### Requirement: Auto-resolve keyboard definition from bundled library

When a keyboard connects and no manually uploaded definition is active, the system SHALL attempt to automatically resolve a keyboard definition from the bundled VIA definitions library using the keyboard's USB vendor ID and product ID before prompting the user for manual upload.

#### Scenario: Definition found in bundle

- **WHEN** a keyboard connects with a vendor ID and product ID that matches an entry in the bundled definitions library
- **THEN** the system SHALL load the matching definition automatically and proceed to the `openingKeyboard` setup phase without showing the manual upload dialog

#### Scenario: Definition not found in bundle

- **WHEN** a keyboard connects with a vendor ID and product ID that has no matching entry in the bundled definitions library
- **THEN** the system SHALL transition to the `waitingKeyboardDefinitionUpload` setup phase and prompt the user to upload a definition file manually

#### Scenario: Bundle asset unavailable

- **WHEN** the bundled definitions asset fails to load (network error, missing file)
- **THEN** the system SHALL fall back gracefully to the `waitingKeyboardDefinitionUpload` phase as if no bundle existed, without showing an error to the user

### Requirement: Manual import overrides bundled definition

The system SHALL allow users to manually upload a keyboard definition file regardless of whether a bundled definition was found, enabling override of bundled definitions with a custom or updated version.

#### Scenario: User uploads definition after auto-load

- **WHEN** a bundled definition was loaded automatically and the user subsequently opens the import dialog and uploads a definition file
- **THEN** the manually uploaded definition SHALL replace the bundled one and take effect immediately

#### Scenario: Import dialog remains accessible

- **WHEN** a keyboard is connected and a bundled definition was loaded
- **THEN** the import/replace definition option SHALL remain accessible in the UI

### Requirement: Build-time VIA definition normalization

The project SHALL include a build-time script that fetches keyboard definitions from a pinned snapshot of the VIA keyboards repository, normalizes them to Remap's `KeyboardDefinitionSchema` format, and writes the output as a static JSON lookup asset indexed by `vendorId:productId`.

#### Scenario: Normalization produces valid definitions

- **WHEN** the build script processes a VIA keyboard definition that contains `name`, `vendorId`, `productId`, `matrix`, and `layouts.keymap`
- **THEN** the output entry SHALL be a valid `KeyboardDefinitionSchema` object that passes Remap's existing JSON schema validator

#### Scenario: Malformed VIA definitions are skipped

- **WHEN** the build script encounters a VIA definition that is missing required fields or fails schema validation
- **THEN** the script SHALL skip that definition, log a warning with the definition name, and continue processing remaining definitions without failing the build

#### Scenario: Lookup key format

- **WHEN** the build script writes a definition to the bundled lookup asset
- **THEN** the definition SHALL be indexed by the key `"${vendorId.toLowerCase()}:${productId.toLowerCase()}"` where both IDs are hex strings in the format `0x[0-9a-f]{1,4}`
