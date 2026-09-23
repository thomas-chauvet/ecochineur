# Roadmap

State as of 2026-09-15: unreleased, working popup, 11 brands in 4 categories and
8 materials (all IDs verified on live Vinted), GPL-3.0, website live at
<https://ecochineur.chaurel.ch>.

## 1. Before publishing on the Chrome Web Store

Done:

- [x] Brand database grown from 3 to 11 brands across all four categories, with
      rationale per brand in [src/data/SOURCES.md](./src/data/SOURCES.md).
- [x] Vinted still accepts `brand_ids[]` / `material_ids[]` URL parameters, all
      bundled brand and material IDs resolve to the expected names, and a URL
      with 23 IDs works (checked on vinted.fr, 2026-09-15).
- [x] License: GPL-3.0.
- [x] Website and privacy policy (EN + FR) served at `ecochineur.chaurel.ch`.
- [x] Store listing copy (EN + FR), permission justifications and privacy
      answers in [RELEASING.md](./RELEASING.md).
- [x] Store assets: see [store/](./store/README.md).
- [x] Brand list reviewed by the maintainer (2026-09-22): Thinking MU and
      Picture Organic Clothing dropped, leaving 11 brands.
- [x] Smoke test on the production build (2026-09-15, Chromium 153 driven over
      CDP, toolbar click simulated with `Extensions.triggerAction`): no host
      permissions; the Vinted URL is readable only after the click; Apply and
      Reset work in the real action popup on vinted.fr and on a vinted.de
      category page; selections persist; FR/EN switch; no network requests. Now
      automated as `tests/e2e/smoke.e2e.ts` (`just e2e`).
- [x] HTTPS on `ecochineur.chaurel.ch` (2026-09-15): Let's Encrypt certificate,
      **Enforce HTTPS** on, `chaurel.ch` verified on the GitHub profile.
- [x] Work merged into `main` (PR #2).
- [x] Chrome Web Store developer account created (2026-09-22).

- [x] Released `v0.1.0` and submitted to the Chrome Web Store, approved and
      published on 2026-09-23:
      <https://chromewebstore.google.com/detail/ecochineur/ieaiphjkoonnobndnggkieoehpoegcab>

Published. Everything below is for later versions.

Nice to have for launch:

- [x] **Brand suggestions without a GitHub account:** the popup opens
      `ecochineur.chaurel.ch/[fr/]suggest.html`, which embeds a Tally form, and
      prefills the Vinted IDs of filtered brands EcoChineur doesn't list. The
      extension still only opens a link. Tally forms: FR `LZlWVz`, EN `lbQdgV`
      (CONTRIBUTING.md, "Suggestion form").
- [ ] More brands, especially `france` and `europe`. Candidates are listed in
      `src/data/SOURCES.md`.
- [ ] Check that material IDs match on other Vinted domains (`vinted.de`,
      `vinted.co.uk`). Only vinted.fr was verified.
- [ ] Localize the manifest name and description
      (`_locales/{en,fr}/messages.json` plus `default_locale`) so the store
      listing and `chrome://extensions` show French to French users.
- [ ] A dedicated 128px icon. The current one is a simple placeholder.
- [ ] Add store screenshots and the store link to the website once published.

## 2. Missing features

Ordered by value for effort.

| Feature                                                                                              | Why                                                                                 | Notes                                                                                                                 |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| More materials (hemp, recycled fibers, organic cotton if Vinted exposes them, leather alternatives…) | Materials work across all brands, which makes them the most useful filter right now | Needs verified `material_ids`                                                                                         |
| Individual brand selection                                                                           | Pick specific brands, not only whole categories                                     | Checkbox list inside the brand browser. Store `selectedBrandIds`                                                      |
| Link to brand website / certifications in brand cards                                                | Data is already bundled (`website`, `certifications`) but not shown                 | Small UI change                                                                                                       |
| Remember "last applied" and a one-click "re-apply"                                                   | Vinted resets filters on every new search                                           | Could become a keyboard shortcut (`commands` API, no new permission)                                                  |
| Popup error on non-catalog Vinted pages with a "go to catalog" button                                | Today it only shows a text message                                                  | Use `chrome.tabs.update` to `/catalog`, no new permission                                                             |
| Dark mode                                                                                            | Popup is light-only                                                                 | `prefers-color-scheme` in `popup.css`                                                                                 |
| Firefox / Edge builds                                                                                | Edge works with the Chrome zip. Firefox MV3 needs `browser_specific_settings`       | Separate manifest variant and AMO listing                                                                             |
| Automatic filter badge on Vinted pages (content script)                                              | Show which items match without opening the popup                                    | Needs host permissions and DOM scraping of Vinted, which conflicts with the "no scraping" promise. Discuss first      |
| More UI languages (de, es, it, nl, pl…)                                                              | Vinted is present in 26 countries                                                   | Brand/material descriptions are only fr/en today. The data model needs a map of locales instead of `_fr`/`_en` fields |

## 3. Technical follow-ups

- [ ] **One Pages deployment path:** Pages builds from `main` `/docs`, and the
      `Deploy docs` workflow (`.github/workflows/pages.yml`) also deploys. Both
      currently succeed. Keep one: delete the workflow, or switch the Pages
      source to GitHub Actions.
- [x] **End-to-end test**: `tests/e2e/smoke.e2e.ts` (`just e2e`) drives the
      production build in headless Chromium over a DevTools pipe, including the
      `activeTab` grant through a simulated toolbar click. Runs in CI and before
      each release.
- [ ] **Data freshness check**: a manual script that opens
      `catalog?brand_ids[]=…` with every bundled ID and compares the filter chip
      names with `brands.json`, to catch ID changes. Vinted's API returns 403 to
      scripts, so it must drive a real browser.
- [ ] **TypeScript 7**: blocked on `typescript-eslint` support (it accepts
      `<6.1` as of 8.70). Upgrade when available.
- [ ] **Codecov action v7** and **Dependabot / Renovate** for npm and GitHub
      Actions updates.
- [ ] **Brand data schema**: consider a JSON Schema for `brands.json` so editors
      validate while typing (tests already enforce the rules).
