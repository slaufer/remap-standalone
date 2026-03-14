## Context

Remap is a Vite/React/TypeScript SPA that communicates with keyboards via the WebHID API. Currently it is deployed as a web app and requires Chrome/Edge 89+. The goal is to wrap this existing build with Electron so users can install and run Remap as a native desktop application, with WebHID access granted automatically without browser permission prompts.

The Vite build outputs static assets to `dist/`. Electron will load these assets from the filesystem in production and from the Vite dev server during development. `electron-builder` handles cross-platform packaging.

## Goals / Non-Goals

**Goals:**

- Ship a self-contained desktop installer for Windows (.exe/NSIS), macOS (.dmg), and Linux (.AppImage, .deb)
- Retain full WebHID keyboard connectivity in the Electron context
- Minimal changes to the existing React/Redux application code
- Development workflow parity: `electron:start` mirrors the existing `yarn start` experience
- Automated desktop releases via CI (GitHub Actions)

**Non-Goals:**

- Replacing or removing the web deployment — both targets remain
- Deep native OS integrations (tray, system notifications, native menus beyond basics)
- Offline-only mode — Firebase/Firestore connectivity is preserved as-is
- Code signing for this initial integration (can be added later)

## Decisions

### D1: Electron as a thin shell around the existing Vite build

**Decision**: The Electron main process loads the Vite `dist/` output as static files in production (via `app.loadFile`) and proxies to `localhost:3000` in development. No changes to React components or Redux reducers.

**Rationale**: Keeps the codebases in sync with zero duplication. Any web build change automatically applies to the desktop app.

**Alternatives considered**: Building a separate Electron-specific renderer entry point — rejected because it would require maintaining two build paths.

### D2: electron-builder for packaging

**Decision**: Use `electron-builder` (not `electron-forge`) with a `electron-builder.config.js` config file.

**Rationale**: `electron-builder` is the most widely used, has first-class `electron-updater` integration, and supports all three platforms from a single config. `electron-forge` is newer and simpler but has less ecosystem maturity for complex multi-platform targets.

**Alternatives considered**: `electron-forge` — rejected due to less flexible installer customization and no native `electron-updater` support.

### D3: WebHID granted via session permission handler

**Decision**: In the Electron main process, use `session.defaultSession.setDevicePermissionHandler` to auto-grant HID device access for all devices (or restrict to known keyboard VID/PID pairs).

**Rationale**: WebHID in Electron requires explicit permission granting; without this, `navigator.hid.requestDevice()` returns an empty list. The web app's existing WebHID code requires no modification.

**Alternatives considered**: Granting permissions at the OS level only — not feasible without changing application code.

### D4: TypeScript for main process

**Decision**: Write `electron/main.ts` and `electron/preload.ts` in TypeScript, compiled separately via `tsc` (not bundled with Vite).

**Rationale**: Consistency with the rest of the codebase. Main process code is Node.js — Vite's browser-targeted bundler is not the right tool.

**Alternatives considered**: Plain JavaScript — rejected for consistency and type safety.

### D5: Separate tsconfig for electron

**Decision**: Add `electron/tsconfig.json` targeting CommonJS/Node16 for the main process, separate from the root `tsconfig.json` which targets the browser renderer.

**Rationale**: Main process needs Node.js types and CommonJS modules; mixing with the browser config causes conflicts.

## Risks / Trade-offs

- **WebHID on Linux**: WebHID in Electron on Linux requires udev rules to allow non-root HID access. This is a user-side requirement, not solvable in the app. → Mitigation: document in README; optionally package a udev rules file.
- **Bundle size**: Electron apps are large (~150–200 MB) due to bundled Chromium. → Mitigation: expected and acceptable for a desktop app; document in release notes.
- **CSP relaxation**: Loading local files relaxes some browser-enforced CSP. → Mitigation: keep CSP headers in Electron's `will-navigate` handler; use `contextIsolation: true` and `nodeIntegration: false` (default safe Electron settings).
- **Auto-updater complexity**: `electron-updater` requires a release server or GitHub Releases. → Mitigation: configure for GitHub Releases; defer auto-update UI to a follow-up change.
- **Firebase in Electron**: Firebase SDK uses browser APIs that work in Electron's renderer — no changes needed. → Low risk.

## Migration Plan

1. Add electron dependencies to `package.json` (dev deps)
2. Add `electron/` source directory and `electron-builder.config.js`
3. Add `electron:start` and `electron:build` scripts
4. Verify local WebHID connectivity
5. Add CI job for desktop builds on tagged releases
6. Publish first desktop release to GitHub Releases

No rollback needed — additive change only; web build is unaffected.

## Open Questions

- Should auto-updates be enabled in this change, or deferred? (Recommend defer — add `electron-updater` scaffold but no UI)
- Should the macOS build be signed in this change? (Recommend no — requires Apple Developer account setup; document as follow-up)
- Should we restrict WebHID auto-grant to known keyboard VID/PID ranges, or allow all HID devices? (Recommend allow-all initially, matching browser behavior)
