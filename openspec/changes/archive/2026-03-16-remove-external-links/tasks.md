## 1. Footer

- [x] 1.1 Replace all `<a>` link elements in `Footer.tsx` (GitHub, Discord, QMK 0.18, donate x2) with plain text or remove entries with no standalone value; retain copyright text as plain text

## 2. TweetButton

- [x] 2.1 Delete `src/components/common/twitter/TweetButton.tsx` (no callers outside the file itself)

## 3. Dialogs — external links to plain text

- [x] 3.1 In `ImportDefDialog.tsx`, replace the `<a href="https://caniusevia.com/...">Specification</a>` with plain text `Specification`
- [x] 3.2 In `KeyboardDefinitionForm.tsx`, replace the `<a href="https://caniusevia.com/...\">.json</a>` with plain text `.json`
- [x] 3.3 In `InfoDialog.tsx`, replace `<a href={designerWebsite}>` wrapper around designer name with a plain `<span>`
- [x] 3.4 In `InfoDialog.tsx`, remove the Google Form report `<a href={props.googleFormUrl}>Here</a>` link (and surrounding prompt text if it no longer makes sense without the link)

## 4. Internal links — remove target="\_blank"

- [x] 4.1 In `FlashFirmwareDialog.tsx`, remove `target="_blank"` and `rel="noreferrer"` from the `/docs/faq` `<Link>`
- [x] 4.2 In `InfoDialog.tsx`, remove `target="_blank"` and `rel="noreferrer"` from the `/keyboards/` `<a>`

## 5. UnsupportedBrowser

- [x] 5.1 In `UnsupportedBrowser.tsx`, replace all `<a href="https://...">` elements with their plain text content

## 6. Header logo

- [x] 6.1 In `Header.tsx`, replace `<a href="/">` wrapping the logo with a plain `<div>` to prevent navigation
