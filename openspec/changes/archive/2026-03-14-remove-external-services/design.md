## Context

The Remap codebase was built as a cloud-connected platform. External services are deeply integrated:

- **Firebase** (`firebase` v8, ~2700 LOC in `Firebase.ts`) provides the sole implementation of two core interfaces (`IStorage`, `IAuth`) that are injected into Redux state and consumed by async thunks throughout the app. Firebase Analytics is the backing implementation of Google Analytics.
- **Google Analytics** is invoked via `sendEventToGoogleAnalytics()` at 47+ call sites across all domains (configure, catalog, docs, practice, workbench).
- **PayPal** (`@paypal/react-paypal-js`) wraps the entire app in `App.tsx` via `PayPalScriptProvider` and is used in the Workbench purchase dialog.
- **Cloud-dependent domains** (Catalog, Keyboards definition management, Workbench) are full React feature trees tied entirely to Firebase. The Configure domain is the exception — WebHID, keymap editing, and firmware flashing have no cloud dependencies.

This is a holykeebs fork. The goal is a stripped-down local tool; none of these cloud features will ever be re-enabled.

## Goals / Non-Goals

**Goals:**

- Remove all Firebase, Google Analytics, and PayPal code and npm packages
- Remove all UI domains that have no offline equivalent (Catalog, Keyboards, Workbench, Auth, Practice stats)
- The resulting app builds cleanly with `yarn type-check`, `yarn lint`, and `yarn test` passing
- The Configure page (WebHID connection + keymap editing + JSON import/export + firmware flash) continues to work exactly as before

**Non-Goals:**

- Replacing removed services with self-hosted alternatives
- Preserving any cloud features in a stubbed or degraded state
- Migrating or exporting data from Firebase

## Decisions

### Delete outright, no stubs or feature flags

This is a permanent fork. No code paths need to remain for future re-enablement. Deleting dead code is strictly better than commenting it out or guarding with flags — it removes ambiguity, reduces compile surface, and prevents accidental activation. All cloud-dependent files, Redux slices, routes, and components are deleted.

### Retain the `IStorage` and `IAuth` interface files but remove Redux state injection

The `IStorage` (`src/services/storage/Storage.ts`) and `IAuth` (`src/services/auth/Auth.ts`) interface definitions may be retained as documentation artifacts, but their instances are removed from the Redux `RootState`. Any selector or thunk that references `state.storage.instance` or `state.auth.instance` is deleted along with its caller.

**Alternative considered**: Delete the interface files too. Rejected because the interfaces have no build-time cost and may serve as a reference for understanding what was removed.

### Remove entire cloud-dependent route domains

The `react-router-dom` route tree currently includes:

- `/catalog/*` → Catalog domain
- `/keyboards/*` → Keyboard definition management
- `/workbench/*` → Firmware building
- `/docs/*` → Documentation pages
- Auth callback routes

All of these are removed. The router is simplified to render only the Configure page (root `/` or `/configure`). Navigation links to removed pages are deleted from the app shell.

### Remove `github` service from Redux state

The GitHub service (`src/services/github/GitHub.ts`) is used only in auth/definition-submission flows — both of which are removed. The `github.instance` Redux state slice is removed along with the service.

**Note**: GitHub OAuth used via Firebase Auth is also removed. No authentication remains in the app.

### GA removal: grep-and-delete call sites

`sendEventToGoogleAnalytics()` is called 47+ times across ~15 files. The approach is mechanical: grep all call sites, delete the call (and the import if it becomes unused). No replacement. The `GoogleAnalytics.ts` utility module and its Firebase Analytics backing are deleted entirely.

### PayPal: remove provider and dialog only

PayPal only appears in two places: the `PayPalScriptProvider` wrapper in `App.tsx` and `RemainingBuildPurchaseDialog.tsx`. Both are deleted. The npm package is removed. This is self-contained enough to not require broader cleanup.

## Risks / Trade-offs

- **Type errors from removed Redux state shape** → The Redux `RootState` type is referenced widely. Removing `storage`, `auth`, `github` slices will cause compile errors in any selector, thunk, or component that still references them. These must all be removed as part of the same change. A partial removal will leave the project unbuildable. Mitigation: work domain by domain, verifying type-check at each milestone.

- **Shared utility code with mixed dependencies** → Some utilities or hooks may serve both local and cloud purposes. Inspect each before deleting — keep the local parts, remove cloud parts.

- **Firebase.ts as a 2700-line monolith** → This file implements every Firestore, Storage, and Functions operation. It is deleted in full; no individual methods are extracted. Any logic worth keeping (e.g., data shape helpers) should be reviewed before deletion, though in practice none is expected to be needed.

- **Test suite references** → Tests for removed components/services must be deleted. Tests for retained code that mock Firebase must have those mocks removed or tests rewritten.

## Migration Plan

Work in this order to keep the project in a compilable state as long as possible:

1. **Remove GA call sites first** — pure deletions, no type impact. Run `yarn lint` after.
2. **Remove PayPal** — remove `PayPalScriptProvider` from `App.tsx`, delete `RemainingBuildPurchaseDialog`.
3. **Remove cloud route domains** — delete Catalog, Keyboards, Workbench, Docs, Auth page trees and their routes. Remove nav links.
4. **Remove Redux cloud slices** — delete `storage`, `auth`, `github` state slices, reducers, selectors, and all thunks that use them.
5. **Delete Firebase service files** — `Firebase.ts`, `FirebaseConfiguration.ts`, and related provider code.
6. **Delete GitHub service** — `src/services/github/GitHub.ts`.
7. **Delete GA utility** — `src/utils/GoogleAnalytics.ts`.
8. **Remove npm packages** — `firebase`, `@paypal/react-paypal-js`. Run `yarn install`.
9. **Delete Firebase project config files** — `firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`.
10. **Verify** — `yarn type-check`, `yarn lint`, `yarn test --run`.

No rollback strategy is needed — git history preserves the prior state.

## Open Questions

_(none — scope is fully defined)_
