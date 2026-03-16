## Context

This is a documentation-only change. The README is the sole file being modified. No code, configuration, or architecture is affected.

The current README was carried over from the upstream `remap-keys/remap` project and still presents this repo as the canonical Remap project. It links to remap-keys.app and does not acknowledge the fork relationship or explain the divergence.

## Goals / Non-Goals

**Goals:**

- Make it immediately clear to any reader that this is a fork
- Explain the motivation (local-first, HolyKeebs-specific, Keyball61 continuity)
- Describe the key differences from upstream
- Fix the releases link to point to holykeebs/remap instead of remap-keys/remap

**Non-Goals:**

- Rewriting the entire README from scratch
- Removing useful upstream content (WebHID references, QMK notes, dev setup)
- Adding detailed contribution guidelines or architecture docs

## Decisions

### Place fork notice at the very top, before the project description

Readers should know immediately they're on a fork. Burying it mid-page defeats the purpose.

**Alternative considered**: A collapsible "about this fork" section. Rejected — too easy to miss.

### Keep the upstream project description intact below the fork notice

The underlying app is still Remap. The upstream description is accurate for what this fork does; no need to rewrite it.

### Update the Desktop App releases link to holykeebs/remap

The current link points to `github.com/remap-keys/remap/releases`, which will not have holykeebs builds. This is a correctness fix.

### Note `.deb` removal in the Desktop App section

The README currently lists `.deb` as a Linux option. Since it was removed from `electron-builder.yml`, this should be corrected to list only `.AppImage` for Linux.

## Risks / Trade-offs

- **Risk**: The fork notice language comes across as overly negative about upstream. → Mitigation: Keep the tone neutral and factual; acknowledge upstream positively.
- No rollback concern — this is a documentation file.
