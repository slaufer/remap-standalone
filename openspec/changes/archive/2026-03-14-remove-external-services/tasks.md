## 1. Remove Google Analytics

- [x] 1.1 Find all `sendEventToGoogleAnalytics()` call sites (grep across `src/`) and delete each call and any resulting unused import lines
- [x] 1.2 Delete `src/utils/GoogleAnalytics.ts`

## 2. Remove PayPal

- [x] 2.1 Remove `PayPalScriptProvider` wrapper and all PayPal imports from `src/App.tsx`
- [x] 2.2 Delete the Workbench purchase dialog (`src/components/workbench/dialogs/RemainingBuildPurchaseDialog.tsx`) and any other PayPal-specific component files

## 3. Remove Cloud-Dependent UI Domains

- [x] 3.1 Delete the Catalog domain component tree (`src/components/catalog/`)
- [x] 3.2 Delete the Keyboards definition management domain (`src/components/keyboards/`)
- [x] 3.3 Delete the Workbench domain component tree (`src/components/workbench/`)
- [x] 3.4 Delete auth/sign-in UI components and pages
- [x] 3.5 Delete the Docs domain component tree (`src/components/docs/`) if it exists
- [x] 3.6 Delete the Practice (typing) domain component tree if present
- [x] 3.7 Remove all cloud routes from the app router in `src/App.tsx` (keep only the Configure route)
- [x] 3.8 Remove navigation links and menu items pointing to deleted pages from the app shell and any nav components

## 4. Remove Redux Cloud Slices and Thunks

- [x] 4.1 Delete the Catalog Redux slice, selectors, and all async thunks that call `storage.instance`
- [x] 4.2 Delete the Keyboards Redux slice, selectors, and associated thunks
- [x] 4.3 Delete the Workbench Redux slice, selectors, and associated thunks
- [x] 4.4 Delete the Practice Redux slice, selectors, and associated thunks (if present)
- [x] 4.5 Delete the Auth Redux slice and selectors
- [x] 4.6 Remove `storage`, `auth`, and `github` service slices from `RootState` in `src/store/state.ts`
- [x] 4.7 Remove all remaining thunks that reference `state.storage.instance`, `state.auth.instance`, or `state.github.instance`
- [x] 4.8 Remove the deleted slice reducers from the Redux store combineReducers config

## 5. Delete Firebase and GitHub Service Files

- [x] 5.1 Delete `src/services/provider/Firebase.ts`
- [x] 5.2 Delete `src/services/provider/FirebaseConfiguration.ts`
- [x] 5.3 Delete `src/services/github/GitHub.ts`
- [x] 5.4 Remove `FirebaseProvider`, `GitHub` instance creation, and related initialization code from `src/store/state.ts`
- [x] 5.5 Delete any remaining Firebase provider or factory files under `src/services/provider/`

## 6. Remove Packages and Project Config Files

- [x] 6.1 Remove `firebase` from `package.json` dependencies and run `yarn install`
- [x] 6.2 Remove `@paypal/react-paypal-js` from `package.json` dependencies
- [x] 6.3 Delete `firebase.json`, `.firebaserc`, `firestore.rules`, and `firestore.indexes.json` from the project root
- [x] 6.4 Remove Firebase and PayPal environment variable references from any `.env.example` or documentation

## 7. Verify Clean Build

- [x] 7.1 Run `yarn type-check` and resolve all TypeScript errors caused by removed code
- [x] 7.2 Run `yarn lint` and fix all lint errors
- [x] 7.3 Run `yarn test --run` and delete or fix any tests for removed components/services
- [x] 7.4 Run `yarn build` and confirm production build completes without errors
