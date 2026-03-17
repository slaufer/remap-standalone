## Context

The app is distributed as an Electron desktop application. In Electron, the main `BrowserWindow` renders the React app — clicking any `<a href="https://...">` navigates the window to that URL, replacing the app. Links with `target="_blank"` open a new Electron window rather than a browser tab. Both behaviors break the user experience. The codebase has external links scattered across the footer, several dialogs, and a standalone TweetButton component.

## Goals / Non-Goals

**Goals:**

- Ensure no rendered element can navigate the Electron window to an external domain
- Ensure internal route links do not open new Electron windows (`target="_blank"`)
- Keep all text content (designer names, copyright notices, contextual descriptions) intact — just strip the link wrapping

**Non-Goals:**

- Adding `shell.openExternal()` Electron API calls to open links in the system browser (out of scope — user did not request this)
- Modifying the web build's behavior (though removing links is harmless there too)
- Changing any visual layout beyond removing link elements

## Decisions

### 1. Remove external links entirely rather than intercept them

**Decision**: Delete `<a>` elements wrapping external URLs. Render their text content as plain text (or omit elements with no useful text).

**Alternative considered**: Intercept clicks via Electron's `will-navigate` / `new-window` events and call `shell.openExternal()`. This would preserve user access to the links but requires IPC plumbing and was not requested.

### 2. TweetButton: remove the component entirely

**Decision**: Delete `TweetButton.tsx` and remove any import/usage sites. The component has no useful fallback — its only purpose is to render a Twitter share link and inject an external widget script.

### 3. Internal `target="_blank"` links: drop the attribute, keep the link

**Decision**: For links to internal routes (`/docs/faq`, `/keyboards/...`), remove `target="_blank"` so navigation stays within the Electron window. The `href` is preserved.

### 4. Footer: strip link elements, keep copyright text

**Decision**: Replace all `<a>` elements in the footer with their plain-text content (or remove entries with no standalone value like the QMK 0.18 service link). The copyright line is retained as plain text per license requirements.

## Risks / Trade-offs

- **[Loss of external resource access]** Users lose quick access to GitHub, Discord, documentation links, and the designer website from within the app → Acceptable: the Electron build is self-contained and these links do not serve core functionality.
- **[InfoDialog designer name loses context]** The keyboard designer's name will no longer be a clickable link to their website → Mitigated: the name is still displayed; users can search for it independently.
