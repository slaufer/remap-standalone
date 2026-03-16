## ADDED Requirements

### Requirement: Fork notice appears at the top of the README

The README SHALL contain a clearly visible fork notice as the first substantive content, before the project description.

#### Scenario: Fork notice is present and links to upstream

- **WHEN** a reader views the README
- **THEN** the first section SHALL identify this as a fork of `remap-keys/remap` with a link to the upstream repository

#### Scenario: Fork notice explains purpose

- **WHEN** a reader views the fork notice
- **THEN** it SHALL explain that the fork exists to provide a local-first, offline desktop app for HolyKeebs keyboards (specifically Keyball61) without cloud dependencies

#### Scenario: Fork notice lists key differences from upstream

- **WHEN** a reader views the fork notice
- **THEN** it SHALL list the major divergences: no Firebase/cloud backend, no analytics, no payments, bundled keyboard definitions, Electron desktop app as primary distribution

### Requirement: Desktop App section references correct releases page

The Desktop App installation section SHALL link to `github.com/holykeebs/remap/releases`, not the upstream releases page.

#### Scenario: Releases link points to fork

- **WHEN** a reader clicks the releases link in the Desktop App section
- **THEN** they SHALL be directed to the holykeebs/remap GitHub releases page

### Requirement: Desktop App section lists accurate platform artifacts

The Desktop App section SHALL only list artifact types that are actually produced by the build.

#### Scenario: Linux lists AppImage only

- **WHEN** a reader views the Linux installation options
- **THEN** `.AppImage` SHALL be listed and `.deb` SHALL NOT be listed
