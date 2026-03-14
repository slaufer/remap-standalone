## ADDED Requirements

### Requirement: Desktop app launches and displays the Remap UI

The system SHALL launch a desktop window that renders the full Remap React application, identical in appearance and functionality to the web version.

#### Scenario: App window opens on launch

- **WHEN** the user launches the installed Remap desktop application
- **THEN** a desktop window SHALL open displaying the Remap UI with no error messages

#### Scenario: App loads in development mode

- **WHEN** a developer runs `yarn electron:start`
- **THEN** an Electron window SHALL open connected to the Vite dev server at localhost:3000

### Requirement: WebHID keyboard connection works without browser permission prompt

The system SHALL automatically grant HID device access in the Electron context so that `navigator.hid.requestDevice()` returns connected keyboards without requiring a browser-style permission dialog.

#### Scenario: Keyboard device is detected

- **WHEN** a supported keyboard is connected via USB
- **AND** the user initiates device connection in the Remap UI
- **THEN** the keyboard SHALL appear in the device selection list without a browser permission prompt

#### Scenario: Multiple keyboards are detected

- **WHEN** more than one supported keyboard is connected
- **THEN** all connected keyboards SHALL be enumerable via the HID device list

### Requirement: Cross-platform installers are produced by the build

The system SHALL produce platform-native installer artifacts from a single build command.

#### Scenario: Windows installer produced

- **WHEN** `yarn electron:dist` is run on a Windows environment (or cross-compiled in CI)
- **THEN** an NSIS `.exe` installer SHALL be produced in the `dist-electron/` output directory

#### Scenario: macOS DMG produced

- **WHEN** `yarn electron:dist` is run on a macOS environment
- **THEN** a `.dmg` disk image SHALL be produced in the `dist-electron/` output directory

#### Scenario: Linux AppImage produced

- **WHEN** `yarn electron:dist` is run on a Linux environment
- **THEN** an `.AppImage` file SHALL be produced in the `dist-electron/` output directory

### Requirement: Electron renderer runs with secure context isolation

The system SHALL configure the Electron BrowserWindow with `contextIsolation: true` and `nodeIntegration: false` to maintain a secure renderer process boundary.

#### Scenario: Renderer cannot access Node.js APIs directly

- **WHEN** the Remap React application code executes in the renderer process
- **THEN** `window.require` and direct Node.js module access SHALL be undefined
- **AND** the application SHALL function normally using only web APIs

### Requirement: Build script compiles the desktop app

The system SHALL provide yarn scripts to build and package the desktop app.

#### Scenario: Production build command

- **WHEN** a developer runs `yarn electron:build`
- **THEN** the Vite web build SHALL complete successfully
- **AND** the Electron main process TypeScript SHALL compile successfully
- **AND** the output SHALL be ready for packaging

#### Scenario: Packaging command

- **WHEN** a developer runs `yarn electron:dist`
- **THEN** `electron:build` SHALL run first
- **AND** `electron-builder` SHALL produce platform installers in `dist-electron/`
