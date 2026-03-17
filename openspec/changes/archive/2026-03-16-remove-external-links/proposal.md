## Why

In the Electron build, clicking any external link navigates the main window away from the app, breaking it. All links pointing to external domains must be removed or replaced with plain text, and internal links with `target="_blank"` must drop that attribute so they stay within the Electron window.

## What Changes

- **Footer**: Remove all external link elements (GitHub, Discord, "Remap for QMK 0.18", donate). Retain the copyright text as plain text.
- **TweetButton**: Remove the component entirely — it links to Twitter and injects an external script.
- **ImportDefDialog** and **KeyboardDefinitionForm**: Remove the `<a href="https://caniusevia.com/docs/specification/">` link; render "Specification" as plain text.
- **InfoDialog**: Remove the `<a href={designerWebsite}>` wrapper around the designer name (render as plain text). Remove the Google Form report link. Remove `target="_blank"` from the internal `/keyboards/` link.
- **FlashFirmwareDialog**: Remove `target="_blank"` from the internal `/docs/faq` link so it navigates within the Electron window.
- **UnsupportedBrowser**: Remove external `<a>` links (remap-keys.app, WebHID spec, Chrome download URLs).

## Capabilities

### New Capabilities

- `electron-safe-navigation`: The application SHALL NOT render any clickable element that navigates to an external domain. Internal route links SHALL NOT use `target="_blank"`.

### Modified Capabilities

<!-- No existing specs cover navigation link behavior -->

## Impact

- `src/components/common/footer/Footer.tsx`
- `src/components/common/twitter/TweetButton.tsx` (and any callers)
- `src/components/configure/importDef/ImportDefDialog.tsx`
- `src/components/configure/keyboarddefform/KeyboardDefinitionForm.tsx`
- `src/components/common/infodialog/InfoDialog.tsx`
- `src/components/common/firmware/FlashFirmwareDialog.tsx`
- `src/components/common/unsupportedbrowser/UnsupportedBrowser.tsx`
