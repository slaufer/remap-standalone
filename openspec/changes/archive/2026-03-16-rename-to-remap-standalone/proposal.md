## Why

This fork of the upstream Remap application needs to be rebranded as "remap-standalone" to avoid name and identifier collisions with the original [remap-keys/remap](https://github.com/remap-keys/remap) project. The fork maintainer is independent and has no affiliation with holykeebs; any identifiers or metadata that could imply otherwise must be updated. Upstream copyright attribution required by the license is preserved.

## What Changes

- **BREAKING** Rename `package.json` `"name"` from `"Remap"` to `"remap-standalone"`
- Update `electron-builder.yml`: `appId` (`app.remap-keys.remap` → `app.remap-standalone.remap-standalone`), `productName` (`Remap` → `Remap Standalone`), `copyright` updated to reflect the fork (upstream attribution retained in footer per license)
- Update `public/manifest.json` and `build/manifest.json`: `short_name` and `name` → `"Remap Standalone"`
- Update `src/components/configure/Configure.tsx`: `APPLICATION_NAME` constant → `'Remap Standalone'`
- Update `src/actions/meta.action.ts`: default page title → `'Remap Standalone'`; OGP URL and image removed/cleared (no longer pointing to upstream's hosted service)
- Update `src/services/pdf/KeymapPdfGenerator.ts`: PDF author field → `'Remap Standalone'`; footer URL updated (no longer pointing to remap-keys.app)

## Capabilities

### New Capabilities

- `app-branding`: Governs the application's display name, package identifier, Electron app metadata, PWA manifest, and in-app text branding — scoped to "remap-standalone" with upstream copyright attribution preserved.

### Modified Capabilities

<!-- No existing spec-level behavior is changing -->

## Impact

- `package.json` — `name` field
- `electron-builder.yml` — `appId`, `productName`, `copyright`
- `public/manifest.json`, `build/manifest.json` — `name`, `short_name`
- `src/actions/meta.action.ts` — default title, OGP URL, OGP image
- `src/components/configure/Configure.tsx` — `APPLICATION_NAME` constant
- `src/services/pdf/KeymapPdfGenerator.ts` — PDF author and footer URL
