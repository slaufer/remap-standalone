## ADDED Requirements

### Requirement: Footer contains no external links

The footer component SHALL NOT render any `<a>` element with an `href` pointing to an external domain. Copyright text SHALL be retained as plain text.

#### Scenario: Footer renders without external links

- **WHEN** the Footer component is rendered
- **THEN** no `<a>` element in the footer has an `href` beginning with `http`

### Requirement: TweetButton is removed

The TweetButton component SHALL NOT exist in the application. No component SHALL inject external scripts from `platform.twitter.com`.

#### Scenario: No Twitter widget script is injected

- **WHEN** the application is loaded
- **THEN** no script element with `src` containing `twitter.com` is appended to the document

### Requirement: Dialog external links are replaced with plain text

Dialogs (ImportDefDialog, KeyboardDefinitionForm, InfoDialog, FlashFirmwareDialog) SHALL NOT render `<a>` elements pointing to external domains. Text that was previously linked SHALL be retained as plain text.

#### Scenario: ImportDefDialog renders specification text without link

- **WHEN** the ImportDefDialog is rendered
- **THEN** the word "Specification" is displayed as plain text with no external href

#### Scenario: InfoDialog renders designer name without link

- **WHEN** InfoDialog displays keyboard info with a designer website
- **THEN** the designer name is rendered as plain text with no external href

#### Scenario: InfoDialog renders report text without external link

- **WHEN** InfoDialog displays the report form prompt
- **THEN** no `<a>` element links to an external form URL

### Requirement: Internal links do not open new windows

Internal route links (e.g. `/keyboards/`, `/docs/faq`) SHALL NOT use `target="_blank"`. Navigation SHALL remain within the Electron window.

#### Scenario: FlashFirmwareDialog FAQ link navigates in-window

- **WHEN** the user clicks the FAQ link in FlashFirmwareDialog
- **THEN** navigation occurs within the current Electron window, not in a new window

#### Scenario: InfoDialog keyboards link navigates in-window

- **WHEN** the user clicks the keyboards link in InfoDialog
- **THEN** navigation occurs within the current Electron window, not in a new window

### Requirement: UnsupportedBrowser page contains no external links

The UnsupportedBrowser component SHALL NOT render `<a>` elements pointing to external domains.

#### Scenario: UnsupportedBrowser renders without external links

- **WHEN** the UnsupportedBrowser component is rendered
- **THEN** no `<a>` element has an `href` beginning with `http`
