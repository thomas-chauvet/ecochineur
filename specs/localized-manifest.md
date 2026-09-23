# Spec: localized manifest (French name and description)

Self-contained brief for an implementer who has not worked on this repository.

## Goal

French users should see the extension name and description in French in
`chrome://extensions` and in the Chrome Web Store, instead of the current
English-only strings. Every other locale keeps English.

Today the manifest hardcodes English (`manifest.config.ts`):

```ts
name: 'EcoChineur',
description:
  'Filter Vinted searches by ethical brands and natural materials. No data collection, no tracking.',
```

Chrome localizes these through `_locales/<lang>/messages.json` plus
`default_locale`, with `__MSG_<key>__` placeholders in the manifest.

## Non-goals

- **Do not touch the popup UI translations.** `src/i18n/{en,fr}.json` drive the
  popup at runtime (`src/lib/i18n.ts`) and are unrelated to manifest
  localization. Keep the two systems separate; merging them is a bigger change
  with its own trade-offs.
- **Do not change the store listing text.** The listing description lives in the
  Developer Console, not in the repository. The French copy is already written
  in `RELEASING.md` ("Store listing copy" and "Réponses en français").
- **No new permissions, no new dependencies, no network calls.** See the hard
  constraints in `CLAUDE.md`.

## Repository facts you need

- **Build**: Vite 8 + CRXJS 2.7.1. `manifest.config.ts` exports the manifest
  through `defineManifest`; `vite.config.ts` passes it to `crx({ manifest })`.
- **Version**: comes from the git tag via `version.ts`. Never hardcode it.
- **Static files**: `public/` is copied to the root of `dist/`. `public/icons/*`
  becomes `dist/icons/*`. This is the mechanism to get `_locales` into `dist/`.
- **Current `dist/` root**: `assets/`, `icons/`, `manifest.json`, `src/`.
- **Commands**: `just build`, `just test`, `just check` (the CI gate),
  `just e2e` (headless Chromium end-to-end test). `npm run <script>` works too.
- **Commits**: Conventional Commits, enforced by a `commit-msg` hook.

## Implementation

### 1. Message catalogues

Create `public/_locales/en/messages.json`:

```json
{
  "extension_name": {
    "message": "EcoChineur",
    "description": "Extension name shown in chrome://extensions and the Chrome Web Store."
  },
  "extension_description": {
    "message": "Filter Vinted searches by ethical brands and natural materials. No data collection, no tracking.",
    "description": "Extension description shown in chrome://extensions and the Chrome Web Store."
  }
}
```

Create `public/_locales/fr/messages.json`:

```json
{
  "extension_name": {
    "message": "EcoChineur",
    "description": "Nom de l'extension affiché dans chrome://extensions et sur le Chrome Web Store."
  },
  "extension_description": {
    "message": "Filtrez vos recherches Vinted par marques éthiques et matières naturelles. Aucune collecte de données, aucun pistage.",
    "description": "Description de l'extension affichée dans chrome://extensions et sur le Chrome Web Store."
  }
}
```

Constraints Chrome enforces: name ≤ 45 characters, description ≤ 132 characters,
single line, no HTML. Both strings above already fit.

### 2. Manifest

In `manifest.config.ts`, replace the literals with placeholders and add
`default_locale`:

```ts
name: '__MSG_extension_name__',
description: '__MSG_extension_description__',
default_locale: 'en',
```

`default_locale` is mandatory as soon as `_locales` exists: without it Chrome
refuses to load the extension. Keep the comment explaining the permissions.

If `defineManifest`'s types reject `default_locale`, check the CRXJS manifest
type before casting; prefer fixing the types over `as any` (ESLint forbids
explicit `any`).

### 3. Unit test

Add `tests/locales.test.ts`, in the style of `tests/i18n.test.ts` and
`tests/data.test.ts` (Vitest, no mocks, read the JSON from disk):

- every locale has the same keys as `en`;
- every `message` is non-empty and single-line;
- `extension_name` ≤ 45 characters, `extension_description` ≤ 132;
- every `__MSG_*__` placeholder used in `manifest.config.ts` exists in the
  catalogues (import the built manifest config or parse the file).

### 4. End-to-end check

`tests/e2e/smoke.e2e.ts` reads `dist/manifest.json` and asserts the permissions.
Add assertions there:

- `manifest.default_locale === 'en'`;
- `manifest.name === '__MSG_extension_name__'`;
- `dist/_locales/en/messages.json` and `dist/_locales/fr/messages.json` exist.

The test already loads the extension in Chromium over a DevTools pipe; a
placeholder that does not resolve makes Chrome fail to load it, which that test
will surface.

## Verification

```bash
just check    # format, lint, unit tests, typecheck, build
just e2e      # loads the built extension in headless Chromium
```

Then check the built output by hand:

```bash
ls dist/_locales/*/messages.json
node -e "const m=require('./dist/manifest.json'); console.log(m.name, m.default_locale)"
```

Finally, load `dist/` in Chrome (`chrome://extensions` → Developer mode → Load
unpacked) and confirm:

- with Chrome in English, the name and description read as today;
- with Chrome in French (`chrome://settings/languages`, put French first, then
  restart Chrome), the description is French;
- the popup still opens on a Vinted catalog page and applies filters.

Run `just build` before loading `dist/`: while `just dev` runs, CRXJS rewrites
`dist/` into a dev loader.

## Acceptance criteria

- [ ] `just check` and `just e2e` pass.
- [ ] `dist/_locales/{en,fr}/messages.json` ship in the built extension, and the
      zip from `just package` contains them.
- [ ] Chrome in French shows the French description; any other language falls
      back to English.
- [ ] No new permission appears in `dist/manifest.json`.
- [ ] Docs updated: mention `_locales` in the source layout in `README.md` and
      `CLAUDE.md`, and note in `CONTRIBUTING.md` that manifest strings live in
      `public/_locales` while popup strings live in `src/i18n`.
- [ ] `ROADMAP.md`: tick the "Localize the manifest name and description" item.

## Gotchas

- **Two translation systems.** `src/i18n` is the popup, `public/_locales` is the
  manifest. A reviewer will reject a change that blurs them.
- **Locale folder names.** Chrome expects `en`, `fr` (or `fr_FR`). `fr-FR` with
  a hyphen is invalid.
- **Encoding.** `messages.json` must be UTF-8 without BOM, or Chrome rejects it.
- **Store listing.** Publishing this does not translate the listing page; that
  is done once in the Developer Console, with the copy in `RELEASING.md`.
- **Release.** The extension is published (v0.1.0). Shipping this needs a new
  tag: `just release 0.2.0`, then upload the zip from the GitHub Release under
  **Package → Upload new package**.

## Reference

- Chrome i18n: <https://developer.chrome.com/docs/extensions/reference/api/i18n>
- Localized manifest fields:
  <https://developer.chrome.com/docs/extensions/reference/manifest#localize>
