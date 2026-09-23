<p align="center">
  <img src="public/icons/icon.svg" alt="EcoChineur logo" width="128" height="128" />
</p>

<h1 align="center">EcoChineur</h1>

<p align="center">
  <a href="https://github.com/thomas-chauvet/ecochineur/actions/workflows/ci.yml">
    <img src="https://github.com/thomas-chauvet/ecochineur/actions/workflows/ci.yml/badge.svg" alt="CI status" />
  </a>
  <a href="https://codecov.io/gh/thomas-chauvet/ecochineur">
    <img src="https://codecov.io/gh/thomas-chauvet/ecochineur/branch/main/graph/badge.svg" alt="Code coverage" />
  </a>
  <a href="https://github.com/thomas-chauvet/ecochineur/releases">
    <img src="https://img.shields.io/github/v/release/thomas-chauvet/ecochineur?include_prereleases&sort=semver" alt="Latest release" />
  </a>
  <img src="https://img.shields.io/badge/manifest-v3-blue" alt="Chrome Manifest V3" />
  <img src="https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
  <a href="./PRIVACY.md">
    <img src="https://img.shields.io/badge/privacy-by%20design-2f6f4f" alt="Privacy by design" />
  </a>
</p>

EcoChineur is a privacy-by-design Chrome (Manifest V3) extension that adds
ethical brand and natural material filters to Vinted searches.

It has no backend and collects no data. When you click **Apply filters**, the
popup works out which `brand_ids[]` and `material_ids[]` to add and merges them
into the current Vinted URL. Your existing filters stay as they are. Then it
reloads the tab with the new URL.

> **[Install EcoChineur from the Chrome Web Store](https://chromewebstore.google.com/detail/ecochineur/ieaiphjkoonnobndnggkieoehpoegcab)**
> (version 0.1.0, published 2026-09-23). What comes next is in
> [ROADMAP.md](./ROADMAP.md).

## Features

- Brand filters by category: French, Origine France Garantie, European,
  French-European, eco-conscious. Two are cumulative: `france` also matches the
  stricter `france-ofg` tier, and `eco` matches any brand flagged `eco: true`,
  so an eco-friendly French brand shows up under both.
- Natural material filters (linen, cotton, wool, silk, cashmere, alpaca, mohair,
  merino), usable with or without brand filters.
- Conservative URL merge: search text, price, sort order, condition, category
  path and the brands/materials you already picked are all kept.
- Reset action that unchecks every option and removes only `brand_ids[]` and
  `material_ids[]` from the current URL.
- **Suggest a brand** link to a form on the project site (no account needed). If
  the current Vinted search filters a brand EcoChineur doesn't list, its Vinted
  ID is prefilled.
- Searchable list of the listed brands, with badges and descriptions.
- French and English UI (French for French browsers, English otherwise).
- Works on all 26 Vinted country domains, on `/catalog` pages.
- Minimal permissions: `storage` and `activeTab` only, so no install-time
  warning.
- No tracking, analytics, telemetry, backend, or network calls made by the
  extension itself. See [PRIVACY.md](./PRIVACY.md).

## Limitations

**Only brands Vinted already knows can be filtered.** Filtering works by adding
Vinted's own `brand_ids[]` parameter to the search URL, so a brand needs an
identifier in Vinted's brand list to be targetable. Vinted creates that entry
only once members list items from the brand, which means small, young or
direct-to-consumer labels usually have none — and cannot be included however
well they fit the criteria. Of 239 clothing makers with exclusively French
production checked in September 2026, only 25 had a Vinted brand entry. The same
applies to materials and `material_ids[]`.

**Filtering is per brand, not per product line.** A brand that manufactures some
ranges in France and others elsewhere cannot be expressed: listing it would
vouch for the imported lines too. Such brands are deliberately left out, with
the reasoning recorded in [`src/data/SOURCES.md`](./src/data/SOURCES.md).

## Install

### From the Chrome Web Store

[EcoChineur on the Chrome Web Store](https://chromewebstore.google.com/detail/ecochineur/ieaiphjkoonnobndnggkieoehpoegcab).
Works in Chrome and other Chromium browsers (Brave, Edge, Opera, Vivaldi).

### From source (developer mode)

Requires Node.js ≥ 22.22 (`.nvmrc` pins 24) and optionally
[`just`](https://github.com/casey/just).

```bash
just install   # npm install
just build     # npm run build
```

Then open `chrome://extensions`, enable **Developer mode**, click **Load
unpacked** and select the `dist/` directory.

## Usage

1. Open any Vinted catalog page, e.g. `https://www.vinted.fr/catalog`, and run a
   search.
2. Click the EcoChineur toolbar icon.
3. Tick brand categories, materials, or both.
4. Click **Apply filters**.

## Development

| Command          | What it does                                           |
| ---------------- | ------------------------------------------------------ |
| `just dev`       | Vite dev server (popup harness, see below)             |
| `just test`      | Unit tests (Vitest)                                    |
| `just lint`      | ESLint                                                 |
| `just typecheck` | `tsc --noEmit`                                         |
| `just format`    | Prettier                                               |
| `just build`     | Typecheck + production build into `dist/`              |
| `just check`     | Format check + lint + tests + build (the CI gate)      |
| `just package`   | `check`, then zip `dist/` into `release/`              |
| `just coverage`  | Unit tests with coverage report                        |
| `just e2e`       | Smoke test of the built extension in headless Chromium |
| `just release X` | Check, tag `vX` and push (see [RELEASING](#releasing)) |
| `just changelog` | Preview `CHANGELOG.md` (git-cliff)                     |

Every `just` recipe wraps an npm script, so `npm run <script>` works too.

A Husky pre-commit hook runs lint-staged (Prettier), then ESLint, typecheck and
tests.

### Popup harness

`just dev`, then open <http://localhost:5173/tests/manual/popup-harness.html>.
The harness mocks `chrome.storage` and `chrome.tabs`, loads the real
`src/popup/popup.html` markup and runs `src/popup/popup.ts`. The URL that
"Apply" would open is available as `document.body.dataset.updatedUrl`.

Final validation must still be done with `dist/` loaded in Chrome (see the smoke
test in [RELEASING.md](./RELEASING.md#manual-smoke-test)). Run `just build`
first: while `just dev` runs, CRXJS rewrites `dist/` into a dev loader that only
works with the dev server running.

## Architecture

```
popup.html ─▶ popup.ts ──┬─▶ data/index.ts       typed brands + materials (bundled JSON)
   (UI)     (rendering,  ├─▶ lib/brand-filter.ts  category → brands → Vinted IDs
             events)     ├─▶ lib/url-merge.ts     merge / reset brand_ids[] & material_ids[]
                         ├─▶ lib/vinted-domains.ts is this a Vinted catalog URL?
                         ├─▶ lib/suggestion-url.ts suggest-page link, prefilled with unlisted brand IDs
                         ├─▶ lib/storage.ts       chrome.storage.local + validation
                         └─▶ lib/i18n.ts          fr/en dictionaries
```

- The popup is the only entry point: no content script, no service worker.
- Everything under `src/lib` is pure (except the `chrome.storage` wrapper) and
  unit tested. `popup.ts` only handles DOM and Chrome API glue.
- `tests/data.test.ts` checks the bundled JSON against the database rules
  (positive unique `vinted_id`, valid category, bilingual descriptions…).
- `manifest.config.ts` builds the manifest. CRXJS turns it into
  `dist/manifest.json`, taking the version from the latest git tag
  (`version.ts`).

### Layout

```
src/
  data/        brands.json, material-ids.json, index.ts (typed exports)
  i18n/        en.json, fr.json
  lib/         brand-filter, i18n, storage, suggestion-url, url-merge, vinted-domains
  popup/       popup.html, popup.ts, popup.css
  types/       shared types and BRAND_CATEGORIES
tests/         unit tests + manual/popup-harness.html
public/icons/  extension icons (copied as-is into dist/)
docs/          GitHub Pages site (landing page, brand suggestion form, privacy policy)
.github/       CI, release and Pages workflows, brand suggestion issue form
```

## Documentation

- [CONTRIBUTING.md](./CONTRIBUTING.md): dev workflow, adding brands and
  materials, conventions.
- [RELEASING.md](./RELEASING.md): versioning, GitHub releases, Chrome Web Store
  submission and listing copy.
- [ROADMAP.md](./ROADMAP.md): what's left before publishing, and missing
  features.
- [PRIVACY.md](./PRIVACY.md): privacy policy (also published at
  <https://ecochineur.chaurel.ch/privacy.html>).
- [src/data/SOURCES.md](./src/data/SOURCES.md): why each brand is listed and
  what still needs checking.
- [CHANGELOG.md](./CHANGELOG.md): generated from Conventional Commits.

Website: <https://ecochineur.chaurel.ch> (French: `/fr/`).

## Releasing

Commits follow Conventional Commits. The git tag sets the version:

```bash
just release 0.1.0    # or 0.1.0-rc.1
```

Details in [RELEASING.md](./RELEASING.md).

## License

[GPL-3.0](./LICENSE). EcoChineur is an independent project, not affiliated with
Vinted.
