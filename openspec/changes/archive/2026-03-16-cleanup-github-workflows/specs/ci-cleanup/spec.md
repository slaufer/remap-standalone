## ADDED Requirements

### Requirement: Desktop release workflow requires no external secrets

The desktop release CI workflow SHALL succeed without any repository secrets beyond the automatically-provided `GITHUB_TOKEN`.

#### Scenario: Build step has no unused env vars

- **WHEN** the desktop release workflow runs
- **THEN** no Firebase, PayPal, or error reporting env vars SHALL be present in the build step

#### Scenario: Artifact upload targets only produced file types

- **WHEN** electron-builder completes and artifacts are uploaded
- **THEN** the upload glob SHALL only reference file types that electron-builder is configured to produce (`.exe`, `.AppImage`, `.dmg`) and SHALL NOT reference `.deb`

### Requirement: Pull request workflow requires no external secrets

The pull request CI workflow SHALL build and test successfully without any repository secrets.

#### Scenario: Build step has no unused env vars

- **WHEN** a pull request build runs
- **THEN** no Firebase, PayPal, or error reporting env vars SHALL be present in the build step

### Requirement: No broken workflows exist in the repository

The repository SHALL NOT contain CI workflow files that are permanently broken due to missing infrastructure or secrets.

#### Scenario: production.yaml is removed

- **WHEN** the `.github/workflows/` directory is listed
- **THEN** `production.yaml` SHALL NOT be present
