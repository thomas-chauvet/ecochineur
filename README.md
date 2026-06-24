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

EcoChineur is a privacy-by-design Chrome Manifest V3 extension for adding
ethical brand and material filters to Vinted France searches.

The extension collects no data, uses no user data, does not scrape Vinted, and
has no backend. The popup reads local preferences, computes the `brand_ids[]`
and `material_ids[]` to add, merges them with the current Vinted URL, and
navigates the active tab to that new URL.

## Features

- Brand filters by category: French, European, mixed, and eco-conscious.
- Natural material filters independent from brand filters.
- Conservative URL merging: search, price, sorting, condition, existing brands,
  and existing materials are preserved.
- Local-only preferences through `chrome.storage.local`.
- Fully translated popup UI in French and English.
- Browseable brand list with search, badges, and descriptions.
- Reset action for `brand_ids[]` and `material_ids[]`.
- No tracking, analytics, backend, telemetry, or extension-owned network calls.

## Stack

- Vite
- CRXJS
- TypeScript
- Vanilla HTML/CSS/TS
- Vitest
- ESLint
- Prettier
- just

## Installation

```bash
npm install
npm run build
```

Then load `dist/` in Chrome from `chrome://extensions` with Developer mode
enabled and "Load unpacked".

## Common Commands

This repository includes a `justfile` so contributors do not need to remember
every npm command.

Install `just` from <https://github.com/casey/just>, then run:

```bash
just
just install
just dev
just test
just lint
just build
just check
just package
```

The equivalent npm commands still work:

```bash
npm run dev
npm test
npm run lint
npm run build
```

## Pre-commit Hooks

The repository uses Husky and lint-staged for pre-commit quality checks.

On commit, the hook runs:

1. `npm run lint-staged` to format staged files with Prettier.
2. `npm run lint` for ESLint.
3. `npm run typecheck` for TypeScript.
4. `npm test` for the Vitest suite.

Husky is installed by the `prepare` script after `npm install`. If hooks are
missing locally, run:

```bash
npm run prepare
```

## Usage

1. Open any Vinted country catalog (e.g. `https://www.vinted.fr/catalog`) and
   run a search.
2. Open the EcoChineur popup.
3. Select one or more brand categories, one or more materials, or both.
4. Click "Apply filters".

EcoChineur adds its filters to the Vinted filters already present. It does not
remove search, price, sorting, condition, brand, or material filters selected
manually. The reset link removes only `brand_ids[]` and `material_ids[]` from
the current URL.

## Privacy and Transparency

- No data is collected.
- No user data is used for analytics, advertising, profiling, audience
  measurement, model training, sharing, or resale.
- The extension only runs on Vinted catalog pages across all supported country
  domains (`/catalog` path).
- Preferences stay in `chrome.storage.local`.
- No tracking, analytics, backend, telemetry, or extension-owned network calls.
- Works on all 26 Vinted country domains (vinted.fr, vinted.de, vinted.co.uk,
  vinted.com, and more).
- Bundled JSON databases contain only brands and materials with verified Vinted
  IDs.

## Local Popup Testing

Run the Vite dev server:

```bash
just dev
```

Open `http://localhost:5173/tests/manual/popup-harness.html`. This page loads
the real `src/popup/popup.ts` module and mocks `chrome.storage.local` and
`chrome.tabs` with a test Vinted URL.

If `src/popup/popup.html` markup changes, keep `tests/manual/popup-harness.html`
in sync.

The final pre-release test must still be done in Chrome with the built `dist/`
directory loaded as an unpacked extension.

## GitHub Pages

The public plugin frontpage lives in `docs/`:

- `docs/index.html`: frontpage.
- `docs/privacy.html`: public privacy policy.
- `docs/assets/icon.svg`: logo used by the page.

To enable it on GitHub:

1. Open the repository settings.
2. Go to "Pages".
3. Choose "Deploy from a branch".
4. Branch: `main`.
5. Folder: `/docs`.

Expected URL after activation: `https://thomas-chauvet.github.io/ecochineur/`.

## Release Checks

```bash
just release-check
```

Or without `just`:

```bash
npm test
npm run lint
npm run format:check
npm run build
npm audit
```

The Chrome-loadable build is `dist/`. Dev release notes are in `RELEASE.md`; dev
listing metadata is in `STORE_LISTING_DEV.md`.

Manual Chrome checks:

- Open the popup on a Vinted catalog page.
- Verify the error outside a Vinted catalog page.
- Apply at least one material filter.
- Apply at least one brand category.
- Verify existing Vinted filters are preserved.
- Reset brand/material filters.
- Switch FR/EN.

## Referenced Data

`src/data/brands.json` and `src/data/material-ids.json` must only contain
entries with a strictly positive `vinted_id`. Keep unmapped brands or materials
out of bundled JSON until their ID is verified.

Mapped brand IDs from the public `0AlphaZero0/Vinted-data` dataset
(`DATA/brand.json`):

- Armor-Lux: `1427`
- FAGUO: `12595`
- Veja: `603`

Mapped material IDs from a manual Vinted search:

- Alpaca: `122`
- Cashmere: `123`
- Cotton: `44`
- Linen: `146`
- Merino: `121`
- Mohair: `152`
- Silk: `49`
- Wool: `46`

Manual Vinted validation checklist:

- Verify Vinted accepts encoded `brand_ids%5B%5D` parameters.
- Test one URL with brands and materials together.
- Test preservation of an existing `brand_ids[]`.
- Test 30, 50, then 80 IDs to assess practical URL length limits.

## Privacy

See [PRIVACY.md](./PRIVACY.md).
