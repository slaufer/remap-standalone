## Why

This is a holykeebs fork of Remap that should operate as a fully standalone, local-only keyboard configuration tool. The current codebase ships with Google Analytics, Firebase (Auth, Firestore, Cloud Storage, Cloud Functions), and PayPal dependencies that require external service accounts, cannot function without internet connectivity, and introduce data privacy concerns inappropriate for a self-contained fork.

## What Changes

- **Remove Google Analytics** — delete `src/utils/GoogleAnalytics.ts` and all 47+ `sendEventToGoogleAnalytics()` call sites across the codebase. No replacement.
- **Remove Firebase SDK** — remove the `firebase` npm package and all integration code (`Firebase.ts`, `FirebaseConfiguration.ts`, service injection in Redux state). This eliminates Auth, Firestore, Cloud Storage, and Cloud Functions.
- **Remove PayPal** — remove `@paypal/react-paypal-js` and the `RemainingBuildPurchaseDialog` component. No replacement.
- **Remove cloud-dependent UI domains** — delete or stub the following feature areas that have no meaningful offline equivalent:
  - Keyboard catalog (search, browse public keyboards, shared keymaps)
  - User authentication (GitHub OAuth, Google OAuth, account management)
  - Firmware building / Workbench (cloud QMK build service, PayPal purchase flow)
  - Keyboard definition review and submission process
  - Typing practice statistics (cloud-stored per user)
  - Organization management
- **Simplify app routing** — the app entry point routes only to the Configure page (WebHID connection + keymap editing), which has no cloud dependencies.
- **Remove Firebase environment variables** — no `.env` configuration required at all.
- **Remove Firebase hosting/Firestore config files** — `firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`.

## Capabilities

### New Capabilities

_(none — this change removes capabilities, not adds them)_

### Modified Capabilities

_(none — existing specs `keymap-json-export` and `keymap-json-import` are unaffected)_

## Impact

- **Removed npm packages**: `firebase`, `@paypal/react-paypal-js`
- **Removed source files**: `src/utils/GoogleAnalytics.ts`, `src/services/provider/Firebase.ts`, `src/services/provider/FirebaseConfiguration.ts`, and related cloud service files
- **Modified source files**: `src/store/state.ts` (remove service instances), `src/App.tsx` (remove PayPalScriptProvider, remove cloud-route setup), all files with GA call sites
- **Removed routes/pages**: Catalog, Keyboards (definition management), Workbench, Auth-gated pages
- **Kept intact**: Configure page (WebHID connect, layer editing, JSON import/export, firmware flash), all keycode logic, HID communication layer, LabelLang service, layout options
