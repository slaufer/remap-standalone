## ADDED Requirements

### Requirement: Package name uses remap-standalone identifier

The `name` field in `package.json` SHALL be `"remap-standalone"` to avoid colliding with the upstream Remap package.

#### Scenario: Package name is correct

- **WHEN** `package.json` is read
- **THEN** the `name` field equals `"remap-standalone"`

### Requirement: Electron appId is unique to this fork

The `appId` in `electron-builder.yml` SHALL be `"app.remap-standalone.remap-standalone"`, distinct from the upstream value `"app.remap-keys.remap"`.

#### Scenario: appId does not match upstream

- **WHEN** `electron-builder.yml` is read
- **THEN** `appId` equals `"app.remap-standalone.remap-standalone"`

### Requirement: Electron productName is Remap Standalone

The `productName` in `electron-builder.yml` SHALL be `"Remap Standalone"`.

#### Scenario: productName is correct

- **WHEN** `electron-builder.yml` is read
- **THEN** `productName` equals `"Remap Standalone"`

### Requirement: PWA manifest uses Remap Standalone name

Both `public/manifest.json` and `build/manifest.json` SHALL have `"name"` and `"short_name"` set to `"Remap Standalone"`.

#### Scenario: manifest name is correct

- **WHEN** `public/manifest.json` or `build/manifest.json` is read
- **THEN** `name` equals `"Remap Standalone"` and `short_name` equals `"Remap Standalone"`

### Requirement: In-app APPLICATION_NAME constant uses Remap Standalone

The `APPLICATION_NAME` constant in `src/components/configure/Configure.tsx` SHALL equal `'Remap Standalone'`.

#### Scenario: APPLICATION_NAME is correct

- **WHEN** the Configure component is rendered
- **THEN** any UI element derived from `APPLICATION_NAME` displays `"Remap Standalone"`

### Requirement: Page title default uses Remap Standalone

The default page title in `src/actions/meta.action.ts` SHALL be `'Remap Standalone'` rather than the upstream `'Remap'`.

#### Scenario: Default page title

- **WHEN** no explicit title is provided to the meta action
- **THEN** the page title falls back to `'Remap Standalone'`

### Requirement: OGP metadata does not reference upstream hosted service

The default OGP URL and OGP image in `src/actions/meta.action.ts` SHALL NOT reference `remap-keys.app` or any upstream domain.

#### Scenario: OGP URL is not set to upstream domain

- **WHEN** meta action OGP fields are read with no override
- **THEN** the URL and image fields do not contain `remap-keys.app`

### Requirement: PDF author field identifies this fork

The PDF author set in `src/services/pdf/KeymapPdfGenerator.ts` SHALL be `'Remap Standalone'` rather than upstream `'Remap'`.

#### Scenario: PDF author is correct

- **WHEN** a keymap PDF is generated
- **THEN** the PDF metadata author field equals `'Remap Standalone'`

### Requirement: PDF footer does not reference upstream hosted service

The PDF footer URL rendered by `src/services/pdf/KeymapPdfGenerator.ts` SHALL NOT be `https://remap-keys.app` or any upstream domain.

#### Scenario: PDF footer URL is not upstream

- **WHEN** a keymap PDF is generated
- **THEN** the footer does not render `remap-keys.app`
