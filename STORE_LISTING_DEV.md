# EcoChineur Dev Listing Metadata

This file is release metadata for development distribution. It is not a final
Chrome Web Store submission.

## Extension Identity

- Name: `EcoChineur Dev`
- Short name: `EcoChineur`
- Version: `0.1.0`
- Version name: `0.1.0-dev.1`
- Category: Shopping
- Language: French primary UI, English secondary UI

## Short Description

Private dev build: filter Vinted without data collection or data use.

## Long Description

EcoChineur Dev adds a Chrome popup that enriches Vinted searches with more
responsible brand and material filters, without collecting data and without
using user data.

The extension reads the active Vinted search URL, preserves filters already
selected by the user, then adds the `brand_ids[]` and `material_ids[]`
corresponding to the checked options. It does not replace existing filters.

Features in this dev release:

- Brands are bundled only when their Vinted ID is verified.
- Natural materials are bundled only when their Vinted ID is verified.
- Conservative Vinted URL merging.
- Local-only preferences.
- Fully translated French and English popup.
- Browseable referenced brand list.
- Brand/material filter reset.

This version collects no personal data, uses no user data, has no backend, and
includes no tracking, analytics, or telemetry.

## Permissions Justification

- `storage`: store selected categories, materials, and language locally.
- `activeTab`: read the active tab URL and navigate to the enriched Vinted URL
  after user action. Granted automatically when the popup is opened; no access
  to other tabs.
- 26 `host_permissions` entries covering all Vinted country domains
  (`vinted.fr`, `vinted.de`, `vinted.co.uk`, `vinted.com`, and 22 more): limit
  extension behavior to Vinted catalog pages only.

## Assets

Included icons:

- `public/icons/icon-16.png`
- `public/icons/icon-48.png`
- `public/icons/icon-128.png`
- `public/icons/icon.svg`

Generated build icons:

- `dist/icons/icon-16.png`
- `dist/icons/icon-48.png`
- `dist/icons/icon-128.png`

Missing production listing assets:

- Chrome Web Store screenshots.
- Promo tile.
- Marquee tile.
- Final non-dev logo if commissioned separately.

## Privacy Summary

EcoChineur Dev collects no data and uses no user data. Preferences are stored
locally through `chrome.storage.local`; browsing history, search terms, filters,
and personal data are never sent to any server. The extension has no backend, no
analytics, no telemetry, and no extension-owned network calls. See `PRIVACY.md`.

Public privacy page for GitHub Pages:
`https://thomas-chauvet.github.io/ecochineur/privacy.html`

Plugin frontpage for GitHub Pages:
`https://thomas-chauvet.github.io/ecochineur/`

## Dev Release Blockers Before Production

- Complete a real Vinted manual QA session.
- Prepare Chrome Web Store screenshots and final promotional assets.
- Decide whether the extension name should remain `EcoChineur` without the `Dev`
  suffix.
