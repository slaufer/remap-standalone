## REMOVED Requirements

### Requirement: User can authenticate via GitHub or Google OAuth

The system previously required Firebase Authentication and provided GitHub and Google OAuth sign-in flows. All authentication is removed. The app operates with no user identity.

**Reason**: Firebase Auth dependency removed. Holykeebs fork operates as a local-only tool with no user accounts.
**Migration**: N/A — this is a fork, not an upgrade path.

#### Scenario: No sign-in entry point exists

- **WHEN** the user opens the application
- **THEN** no sign-in button, auth prompt, or account menu is shown

---

### Requirement: User can browse and search the public keyboard catalog

The catalog domain allowed users to search for keyboards, view definitions, apply shared keymaps, and download firmware. All catalog functionality is removed.

**Reason**: Catalog data was stored in Firebase Firestore. No offline equivalent is provided.
**Migration**: N/A.

#### Scenario: Catalog route does not exist

- **WHEN** the user navigates to /catalog
- **THEN** the route does not exist and the app renders its default page

---

### Requirement: User can build custom QMK firmware via the cloud build service

The Workbench domain allowed users to customize QMK source, purchase build credits via PayPal, and trigger cloud firmware builds via Firebase Cloud Functions. All workbench functionality is removed.

**Reason**: Requires Firebase Cloud Functions and PayPal. No offline equivalent is provided.
**Migration**: N/A.

#### Scenario: Workbench route does not exist

- **WHEN** the user navigates to /workbench
- **THEN** the route does not exist and the app renders its default page

---

### Requirement: User can submit and manage keyboard definitions

The keyboard definition submission and review workflow allowed community members to submit, edit, and publish keyboard definitions to Firestore. All definition management functionality is removed.

**Reason**: Requires Firebase Firestore and Auth. No offline equivalent is provided.
**Migration**: N/A.

#### Scenario: Keyboards management route does not exist

- **WHEN** the user navigates to /keyboards
- **THEN** the route does not exist and the app renders its default page

---

### Requirement: Application tracks usage events via Google Analytics

All user interactions were sent to Google Analytics via Firebase Analytics. Event tracking is removed entirely.

**Reason**: External telemetry dependency removed. No replacement.
**Migration**: N/A.

#### Scenario: No analytics events are emitted

- **WHEN** the user performs any action in the application
- **THEN** no network requests are made to Google Analytics or Firebase Analytics endpoints
