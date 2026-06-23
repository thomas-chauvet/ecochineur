# Releasing EcoChineur

Version is driven entirely by the git tag. No manual edits to `package.json` or
`manifest.config.ts` are needed — push a tag and the workflow does everything.

---

## How versioning works

| Tag pushed    | manifest `version` | manifest `version_name` | GitHub Release |
| ------------- | ------------------ | ----------------------- | -------------- |
| `v1.2.3`      | `1.2.3`            | `1.2.3`                 | Full release   |
| `v1.2.3-rc.1` | `1.2.3`            | `1.2.3-rc.1`            | Pre-release    |

Chrome only accepts numeric dot-separated version strings in the `version`
field, so any pre-release suffix is stripped there. The full label is preserved
in `version_name` (visible in `chrome://extensions`).

---

## Prerequisites

- Push access to the `main` branch (tags trigger the release workflow).
- A
  [Google Chrome Web Store developer account](https://chrome.google.com/webstore/devconsole)
  (one-time $5 registration fee — required for the first release only).

---

## Release candidate

Use this to validate the build on the Chrome Web Store staging flow or share
internally before a final release.

```bash
git tag v1.2.3-rc.1
git push origin v1.2.3-rc.1
```

The workflow creates a **pre-release** GitHub Release with the extension zip
attached. The manifest `version_name` will be `1.2.3-rc.1`.

---

## Production release

```bash
git tag v1.2.3
git push origin v1.2.3
```

The workflow:

1. Sets `package.json` version to `1.2.3` (in CI only, not committed).
2. Runs the full quality gate: format check → lint → typecheck → tests → build.
3. Runs `npm audit --audit-level=high`.
4. Zips `dist/` into `release/ecochineur-v1.2.3.zip`.
5. Creates a GitHub Release with the zip and auto-generated release notes.

---

## First release to the Chrome Web Store

Before the very first public submission, do this once:

1. **Finalize production assets** — prepare Chrome Web Store listing assets:
   - At least one **screenshot** (1280×800 or 640×400 px).
   - Optional: **small promo tile** (440×280 px), **marquee tile** (1400×560
     px).
2. **Rename the extension** — change `name` in `manifest.config.ts` from
   `'EcoChineur Dev'` to `'EcoChineur'` and update the description.
3. Push the production tag to trigger the build, then download the zip from the
   GitHub Release.
4. In the
   [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole),
   click **New item**, upload the zip, and fill in:
   - Short description (≤ 132 chars).
   - Long description and permissions justification (from
     `STORE_LISTING_DEV.md`).
   - Screenshots and promo tiles.
   - Category: **Shopping**.
   - Privacy policy URL:
     `https://thomas-chauvet.github.io/ecochineur/privacy.html`
5. Click **Submit for review**. Google review typically takes 1–3 business days.

---

## Subsequent Store updates

Download the zip from the GitHub Release for the new tag, then:

1. In the Developer Console, open the **EcoChineur** listing.
2. Click **Package** → **Upload new package** → upload the zip.
3. Click **Submit for review**.

---

## Manual smoke test (before submitting to the Store)

Load `dist/` as an unpacked extension via
`chrome://extensions → Developer mode → Load unpacked` and verify:

- Popup opens on a Vinted catalog page; Apply button starts disabled.
- Selecting a material and applying preserves existing URL params.
- Brand filter search works (e.g. search for `Veja`).
- Language switch FR ↔ EN works.
- Reset removes only `brand_ids[]` and `material_ids[]`.
- Opening the popup outside Vinted shows the expected error.

---

## Local packaging (for manual testing only)

```bash
just package
```

Runs `release:check`, builds, and zips `dist/` to
`release/ecochineur-v<package.json version>.zip`. Useful for testing the
packaged artifact locally without pushing a tag.

---

## Troubleshooting

| Symptom                                           | Cause                                                  | Fix                                                                |
| ------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------ |
| Store rejects the zip                             | Manifest `version` not strictly greater than published | Increment the patch/minor/major in the new tag                     |
| Workflow fails at `npm audit`                     | High-severity vulnerability in a dependency            | Run `npm audit` locally and update the affected package            |
| `version_name` shows `0.0.0` in the extension     | Build ran outside npm (e.g. `npx vite build` directly) | Always build via `npm run build` so npm sets `npm_package_version` |
| Smoke test: popup shows error on a Vinted catalog | Missing domain in `host_permissions`                   | Add the domain to `src/lib/vinted-domains.ts`                      |
