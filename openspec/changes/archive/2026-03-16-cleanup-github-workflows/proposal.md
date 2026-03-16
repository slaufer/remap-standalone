## Why

The GitHub Actions workflows contain dead references to Firebase, PayPal, and error reporting secrets that were removed from the codebase, plus a stale `.deb` artifact glob in the desktop release workflow. The `production.yaml` workflow is still wired to the upstream Firebase project and will fail without secrets that this fork does not have. These issues cause noise and potential build failures that obscure the actual state of CI.

## What Changes

- Remove unused Firebase, PayPal, and error reporting env vars from `pullrequest.yaml` and `desktop-release.yaml`
- Remove the stale `.deb` artifact glob from the upload step in `desktop-release.yaml`
- Disable or remove `production.yaml` since it is tied to the upstream Firebase project (`remap-b2d08`) and is not applicable to this fork

## Capabilities

### New Capabilities

<!-- None — this is a cleanup change with no new product capabilities -->

### Modified Capabilities

<!-- No spec-level behavior changes; this only affects CI configuration -->

## Impact

- `.github/workflows/pullrequest.yaml`: remove unused env var block from the build step
- `.github/workflows/desktop-release.yaml`: remove unused Firebase env vars from the build step; remove `.deb` from the artifact upload glob
- `.github/workflows/production.yaml`: remove or disable (not applicable to this fork)
