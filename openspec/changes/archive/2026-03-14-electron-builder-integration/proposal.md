## Why

The Remap web app currently requires a browser with WebHID support (Chrome/Edge 89+) and an internet connection, limiting its use for keyboard enthusiasts who prefer a dedicated desktop experience or work in environments with restricted browser access. Packaging Remap as an Electron desktop app removes these constraints by bundling Chromium with the app and enabling offline-capable, native-feeling usage.

## What Changes

- Add Electron as a runtime target alongside the existing web build
- Introduce `electron-builder` for cross-platform desktop packaging (Windows, macOS, Linux)
- Add an Electron main process entry point that hosts the Vite-built renderer
- Add npm/yarn scripts for desktop development (`electron:start`) and packaging (`electron:build`, `electron:dist`)
- Configure auto-updater support via `electron-updater`
- Adjust Content Security Policy and WebHID permissions for Electron context
- Add platform-specific installer configurations (NSIS for Windows, DMG for macOS, AppImage/deb for Linux)

## Capabilities

### New Capabilities

- `electron-packaging`: Build and distribute Remap as a cross-platform desktop application using electron-builder, producing platform-native installers/packages from the existing Vite web build.

### Modified Capabilities

<!-- No existing spec-level requirements are changing — this is additive packaging infrastructure. -->

## Impact

- **New dev dependencies**: `electron`, `electron-builder`, `electron-updater`, `concurrently`, `wait-on`
- **New files**: `electron/main.ts`, `electron/preload.ts`, `electron-builder.config.js`
- **Build pipeline**: Vite build output becomes the Electron renderer; `electron-builder` packages both together
- **WebHID**: Must be explicitly enabled via Electron's `session.defaultSession.setDevicePermissionHandler` — no browser permission prompt needed
- **CSP**: Electron renderer requires relaxed/adjusted CSP compared to web deployment
- **CI/CD**: New GitHub Actions workflow or job for desktop release builds
