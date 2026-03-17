## 1. Package and Build Identifiers

- [x] 1.1 Update `package.json` `"name"` from `"Remap"` to `"remap-standalone"`
- [x] 1.2 Update `electron-builder.yml` `appId` to `"app.remap-standalone.remap-standalone"`
- [x] 1.3 Update `electron-builder.yml` `productName` to `"Remap Standalone"`
- [x] 1.4 Update `electron-builder.yml` `copyright` to reflect the fork (retain upstream attribution)

## 2. PWA Manifest

- [x] 2.1 Update `public/manifest.json` `name` and `short_name` to `"Remap Standalone"`
- [x] 2.2 Update `build/manifest.json` `name` and `short_name` to `"Remap Standalone"`

## 3. In-App Branding Strings

- [x] 3.1 Update `APPLICATION_NAME` constant in `src/components/configure/Configure.tsx` to `'Remap Standalone'`
- [x] 3.2 Update default page title in `src/actions/meta.action.ts` to `'Remap Standalone'`
- [x] 3.3 Clear OGP URL and OGP image defaults in `src/actions/meta.action.ts` (remove upstream remap-keys.app references)

## 4. PDF Branding

- [x] 4.1 Update PDF author field in `src/services/pdf/KeymapPdfGenerator.ts` to `'Remap Standalone'`
- [x] 4.2 Update PDF footer URL in `src/services/pdf/KeymapPdfGenerator.ts` (remove remap-keys.app)
