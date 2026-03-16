## Context

The project recently removed Firebase, Google Analytics, and PayPal dependencies from the codebase. The three GitHub Actions workflows were not updated to reflect these removals. Additionally, `production.yaml` is still configured to deploy to the upstream Firebase Hosting project (`remap-b2d08`), which this fork does not have access to.

## Goals / Non-Goals

**Goals:**

- Remove all dead env var references from CI workflows
- Remove stale `.deb` artifact glob from the desktop release upload step
- Eliminate the `production.yaml` workflow that cannot run in this fork

**Non-Goals:**

- Adding any new CI capabilities or deployment targets
- Modifying build logic or test configuration
- Updating the PR or desktop release workflows beyond secret cleanup

## Decisions

### Remove `production.yaml` entirely

The workflow deploys to Firebase Hosting project `remap-b2d08` and requires `FIREBASE_TOKEN_PRODUCTION` and `INCREMENT_VALUE_PAT` secrets that this fork does not have. It cannot be made to work without a new Firebase project and significant rework. Removing it is cleaner than leaving a permanently-broken workflow.

**Alternative considered**: Disabling it with `if: false` or commenting it out. Rejected — dead workflow files create confusion about intent.

### Strip env vars from `pullrequest.yaml` and `desktop-release.yaml` build steps

All `REACT_APP_FIREBASE_*`, `REACT_APP_PAYPAL_*`, and `REACT_APP_ERROR_REPORTING_KEY` references are unused by the build. Removing them makes the workflows self-documenting (no secrets required = no secrets listed).

### Remove `.deb` from desktop release artifact glob

The `electron-builder.yml` no longer targets `.deb`. The glob matches nothing and is misleading about what artifacts are produced.

## Risks / Trade-offs

- **Risk**: Someone re-adds Firebase/PayPal in the future and forgets to re-add the secrets. → Mitigation: The env vars will need to be re-added deliberately, which is the right forcing function.
- No rollback needed — all changes are to workflow YAML files with no runtime impact.
