## ADDED Requirements

### Requirement: User can export keymap as JSON

The system SHALL provide an "Export JSON" action in the Configure page keymap toolbar menu. When triggered, the system SHALL serialize the current keyboard's full keymap state into a versioned JSON envelope and download it as a `.json` file via the browser.

The exported JSON envelope SHALL include:

- `version`: format version string (currently `"1"`)
- `vendorId`: numeric vendor ID of the connected keyboard
- `productId`: numeric product ID of the connected keyboard
- `productName`: product name string
- `labelLang`: the active label language identifier
- `layoutOptions`: array of active layout option selections
- `keycodes`: array of layer objects mapping position strings to numeric QMK keycodes
- `encoderKeycodes`: array of encoder objects mapping encoder ID to clockwise/counterclockwise numeric keycodes

#### Scenario: Export triggered with connected keyboard

- **WHEN** the user selects "Export JSON" from the keymap toolbar menu
- **THEN** the browser downloads a file named `keymap_<productName>.json` containing all layers and encoder keymaps for the currently connected keyboard

#### Scenario: Export includes all layers

- **WHEN** the user exports the keymap
- **THEN** the exported JSON contains one entry per keyboard layer in the `keycodes` array, in layer order (index 0 = layer 0)

#### Scenario: Export includes encoder keymaps when present

- **WHEN** the connected keyboard has rotary encoders configured
- **THEN** the exported JSON `encoderKeycodes` array contains each encoder's clockwise and counterclockwise keycode mappings

#### Scenario: Export includes current layout options

- **WHEN** the user exports the keymap
- **THEN** the exported JSON `layoutOptions` reflects the layout option selections active at the time of export

#### Scenario: Export is not available without a connected keyboard

- **WHEN** no keyboard is connected
- **THEN** the "Export JSON" action SHALL be disabled or not visible in the toolbar
