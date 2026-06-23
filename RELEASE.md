# EcoChineur Dev Release

## Version

- Extension version: `0.1.0`
- Release label: `0.1.0-dev.1`
- Manifest name: `EcoChineur Dev`
- Target browser: Chrome / Chromium with Manifest V3 support
- Target sites: all 26 Vinted country domains (`/catalog` path)
- Privacy posture: no collection, no user-data use, no backend, no analytics, no
  extension-owned network calls

## Dev Release Scope

This development release is intended for local installation and validation with
Chrome's "Load unpacked" flow. It is private by design: it does not collect user
data and does not use user data for any purpose.

Included:

- Conservative URL merge for `brand_ids[]` and `material_ids[]`.
- Local preference persistence with `chrome.storage.local`.
- FR/EN popup.
- Brand filters for mapped brands only.
- Material filters for mapped materials only.
- Reset action for brand/material filters.
- Privacy policy and contributor documentation.
- No suggestion form or other outbound third-party flow.

Not included in this dev release:

- Chrome Web Store listing assets such as screenshots and promotional tiles.
- Final production review on a real Vinted session.

## Current Data

Mapped brands:

- Armor Lux: `1427`
- Faguo: `12595`
- Veja: `603`

Mapped materials:

- Alpaca: `122`
- Cashmere: `123`
- Cotton: `44`
- Linen: `146`
- Merino: `121`
- Mohair: `152`
- Silk: `49`
- Wool: `46`

## Release Checks

Run before packaging:

```bash
npm run format:check
npm run lint
npm test
npm run build
npm audit
```

Expected build output:

- `dist/manifest.json`
- `dist/src/popup/popup.html`
- `dist/icons/icon-16.png`
- `dist/icons/icon-48.png`
- `dist/icons/icon-128.png`

## Install Locally

1. Run `npm run build`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Click "Load unpacked".
5. Select the `dist/` directory.
6. Visit any Vinted country catalog (e.g. `https://www.vinted.fr/catalog`).
7. Open EcoChineur Dev and apply filters.

## Manual Smoke Test

- Open popup on a Vinted catalog page.
- Verify the Apply button starts disabled.
- Select one material and apply.
- Confirm existing search, price, brand, and material filters are preserved.
- Select a brand category and apply.
- Open the brand list and search for `Veja`.
- Switch FR/EN.
- Use Reset and confirm only `brand_ids[]` and `material_ids[]` are removed.
- Open popup outside Vinted catalog and verify the user-facing error.

## Known Dev Caveats

- The current brand database is intentionally small because unmapped brands were
  removed.
- GitHub Pages must be enabled manually from repository settings using the
  `/docs` folder on `main`.
