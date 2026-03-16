## Why

The README still reads as if this is the upstream `remap-keys/remap` project, linking to remap-keys.app and making no mention of why this fork exists or how it differs. Anyone landing on this repo — including the owner in six months — needs to understand immediately that this is a local-first, HolyKeebs-focused fork, not the original, and why it was created.

## What Changes

- Add a fork notice at the top of the README identifying this as a fork of `remap-keys/remap`
- Explain the purpose: a local-first desktop app for HolyKeebs keyboards that works without any cloud dependency, motivated by wanting to guarantee long-term access to Keyball61 keymap editing regardless of upstream service availability
- Note the key differences from upstream: no Firebase, no analytics, no payments; bundled keyboard definitions; Electron desktop app as the primary distribution
- Update the Desktop App installation section to reference the correct releases page (holykeebs/remap) instead of remap-keys/remap
- Remove or qualify the link to remap-keys.app (the upstream hosted service, not this fork)

## Capabilities

### New Capabilities

<!-- None — this is a documentation-only change -->

### Modified Capabilities

<!-- No spec-level behavior changes -->

## Impact

- `README.md` only
