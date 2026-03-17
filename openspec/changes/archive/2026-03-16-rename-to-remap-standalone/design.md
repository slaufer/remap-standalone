## Context

This is a fork of the upstream [remap-keys/remap](https://github.com/remap-keys/remap) project, maintained independently as "remap-standalone". Several identifiers throughout the codebase still carry the upstream project's name or domain (`app.remap-keys.remap`, `remap-keys.app`, PDF author `Remap`). These create potential confusion between this fork and the upstream hosted service and must be updated to reflect the fork's independent identity.

## Goals / Non-Goals

**Goals:**

- Update all package identifiers, Electron app metadata, and in-app display strings to use `remap-standalone` / `Remap Standalone`
- Ensure the Electron app does not share an `appId` with the upstream build (prevents OS-level install conflicts)
- Remove all URLs pointing to upstream's hosted service (remap-keys.app) from branding metadata and PDF output

**Non-Goals:**

- Changing any functional behavior of the application
- Altering the visual design or logo
- Removing upstream copyright notices (required by license)
- Modifying the Firebase backend configuration

## Decisions

### 1. `appId` format

**Decision**: Use `app.remap-standalone.remap-standalone`

This follows the existing reverse-domain format used by the upstream (`app.remap-keys.remap`) and is clearly differentiated. No alternative was seriously considered — the format must simply be unique.

### 2. `productName` and display name

**Decision**: Use `Remap Standalone`

This preserves the `Remap` prefix (which accurately describes the application's function) while adding `Standalone` to distinguish it from the upstream web app. The name reflects that this is the Electron-packaged, self-hosted variant.

### 3. OGP / meta URLs

**Decision**: Remove the default OGP URL and image (set to empty string or omit)

These URLs pointed to the upstream hosted service. Since this fork is not deployed at remap-keys.app, providing those defaults would mislead any tooling that reads OGP tags. The URLs should be cleared rather than replaced with a placeholder.

### 4. PDF footer URL

**Decision**: Remove the upstream URL from the PDF footer

The PDF footer previously rendered `https://remap-keys.app`. Since this fork is not hosted there, the URL is replaced with an empty string (no footer URL rendered).

### 5. Upstream attribution in `copyright` field

**Decision**: The `electron-builder.yml` `copyright` field is updated to credit the fork while retaining upstream attribution inline.

The copyright in the Electron `about` dialog can note the fork without misrepresenting authorship.

## Risks / Trade-offs

- **User confusion about "Remap Standalone" name** → Mitigation: The name directly communicates this is the standalone/Electron variant of Remap.
- **build/manifest.json out of sync with public/manifest.json** → Mitigation: Both files are updated together in the same task; `build/` is a build artifact so it may be regenerated, but the current repo has it checked in.

## Migration Plan

All changes are in-place file edits. No data migration is required. Existing Electron installs under the old `appId` will not auto-update from the new build — users would need to reinstall. This is acceptable since the fork is a fresh distribution.
