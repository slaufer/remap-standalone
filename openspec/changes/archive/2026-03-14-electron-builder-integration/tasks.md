## 1. Dependencies & Configuration

- [x] 1.1 Add `electron`, `electron-builder`, `electron-updater`, `concurrently`, and `wait-on` as dev dependencies in `package.json`
- [x] 1.2 Add `electron:start`, `electron:build`, and `electron:dist` scripts to `package.json`
- [x] 1.3 Create `electron/tsconfig.json` targeting CommonJS/Node16 with `@types/node` and `@types/electron`
- [x] 1.4 Create `electron-builder.config.js` with app metadata and platform targets (NSIS/Windows, DMG/macOS, AppImage+deb/Linux), output to `dist-electron/`

## 2. Electron Main Process

- [x] 2.1 Create `electron/main.ts` — BrowserWindow creation with `contextIsolation: true`, `nodeIntegration: false`, and appropriate window dimensions
- [x] 2.2 In `electron/main.ts`, load `dist/index.html` in production and `http://localhost:3000` in development
- [x] 2.3 In `electron/main.ts`, add `session.defaultSession.setDevicePermissionHandler` to auto-grant all HID device access
- [x] 2.4 Create `electron/preload.ts` as a minimal preload script (expose any needed APIs via `contextBridge` if required in future)
- [x] 2.5 Add `electron/` compile step to `electron:build` script (runs `tsc -p electron/tsconfig.json` before packaging)

## 3. WebHID Verification

- [x] 3.1 Run `yarn electron:start` and connect a supported keyboard to verify `navigator.hid.requestDevice()` returns devices without a permission prompt
- [x] 3.2 Verify keymap read/write round-trip works end-to-end in the Electron window

## 4. Packaging & Distribution

- [x] 4.1 Run `yarn electron:dist` on Linux and verify `.AppImage` is produced in `dist-electron/`
- [x] 4.2 Verify the AppImage launches and the keyboard connection flow works
- [x] 4.3 Add `.gitignore` entries for `dist-electron/` and compiled `electron/dist/` output

## 5. CI Integration

- [x] 5.1 Add a GitHub Actions workflow (or job) that triggers on version tags (`v*`), runs `yarn electron:dist` on ubuntu-latest/windows-latest/macos-latest, and uploads artifacts to GitHub Releases
- [x] 5.2 Verify the CI workflow produces all three platform artifacts on a test tag

## 6. Documentation

- [x] 6.1 Add a "Desktop App" section to `README.md` covering installation, Linux udev requirements, and development workflow
