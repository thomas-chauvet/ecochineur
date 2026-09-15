# Contributing to EcoChineur

By contributing, you agree that your contributions are licensed under the
[GPL-3.0](./LICENSE).

## Setup

```bash
nvm use            # Node 24 (minimum 22.22)
just install       # installs dependencies and the Husky hooks
just check         # format check, lint, tests, typecheck, build
```

If the hooks are missing, run `npm run prepare`.

## Workflow

1. Branch from `main`.
2. Make your change, adding or updating tests in `tests/` for any logic in
   `src/lib`.
3. For UI changes, check the popup harness (`just dev`, then
   `/tests/manual/popup-harness.html`) and then the unpacked build in Chrome.
4. Run `just check` and open a pull request. CI also runs coverage, `npm audit`
   and commitlint on the PR commits.

## Commit messages

Commits must follow the
[Conventional Commits](https://www.conventionalcommits.org) format, e.g.
`feat: add material filter` or `fix(popup): preserve price filter`. A Husky
`commit-msg` hook runs commitlint locally and CI lints PR commits. The release
changelog is generated from these messages by
[git-cliff](https://git-cliff.org), so well-formed commits keep `CHANGELOG.md`
accurate. Common types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`,
`build`, `ci`, `chore`. Use `feat(data): …` for brand or material additions.

## Code conventions

- Vanilla TypeScript, no UI framework. Keep the bundle small and easy to review
  (store reviewers read it).
- Keep the logic in `src/lib` pure and tested. `src/popup/popup.ts` is only DOM
  and Chrome API glue.
- Build DOM with the `h()` helper and `textContent`. Never use `innerHTML`.
- Never add network calls, remote code, analytics or new permissions without
  updating [PRIVACY.md](./PRIVACY.md), `docs/privacy.html`,
  `docs/fr/privacy.html` and the permission justifications in
  [RELEASING.md](./RELEASING.md).
- Code, comments, filenames and developer docs are in English. French is used
  only for user-facing strings (`src/i18n/fr.json`, `description_fr`, `name_fr`,
  `docs/fr/`).
- `src/i18n/fr.json` and `src/i18n/en.json` must have the same keys. TypeScript
  and `tests/i18n.test.ts` both enforce this.

## Add a brand

The brand database is curated on purpose. A brand needs a documented reason to
be listed: local production, responsible materials, recognized certifications, a
repair program, or a documented environmental approach.

Brand suggestions from users arrive through the **Suggest a brand** GitHub issue
form (`.github/ISSUE_TEMPLATE/brand-suggestion.yml`), which the popup links to.
For now this requires a GitHub account (the popup says so). A suggestion channel
that doesn't need an account is on the [roadmap](./ROADMAP.md).

1. Add an entry to `src/data/brands.json`:

   ```json
   {
     "id": "brand-slug",
     "name": "Public name",
     "vinted_id": 12345,
     "category": "france",
     "eco": true,
     "certifications": ["GOTS"],
     "description_fr": "Pourquoi la marque est référencée.",
     "description_en": "Why the brand is listed.",
     "website": "https://example.com"
   }
   ```

2. Add a row to [`src/data/SOURCES.md`](./src/data/SOURCES.md) with the reason
   for the category and links to the evidence.
3. Bump `last_updated` in `brands.json`.

| Category | Meaning                                                         |
| -------- | --------------------------------------------------------------- |
| `france` | 100% French production                                          |
| `europe` | 100% European production outside France (EU, UK, CH, NO…)       |
| `mixed`  | Serious ethical efforts, production not exclusively European    |
| `eco`    | Eco-conscious brand without a strong European production anchor |

`eco: true` is a cumulative tag: a `france` brand with `eco: true` matches both
the French and the eco-conscious filters. Only list certifications you can link
to.

### Find and verify a Vinted brand ID

1. Open a Vinted catalog, e.g. `https://www.vinted.fr/catalog`.
2. Pick the brand in Vinted's **Brand** filter.
3. Copy the number after `brand_ids[]=` in the URL (it may appear as
   `brand_ids%5B%5D=`).
4. Verify: open `https://www.vinted.fr/catalog?brand_ids[]=<id>` and check that
   the active filter chip shows the expected brand name.

Community datasets can help find candidate IDs, but they are snapshots and can
be stale, so always verify on live Vinted:

- [teddy-vltn/vinted-dataset](https://github.com/teddy-vltn/vinted-dataset)
  (`brand.json`, last updated May 2024)
- [0AlphaZero0/Vinted-data](https://github.com/0AlphaZero0/Vinted-data)
  (`DATA/brand.json`, March 2022)

The two datasets disagree on some brands (e.g. Armor Lux: `1427` vs `11346542`).
Live Vinted showed `1427` is correct.

Several IDs can be checked at once: add several `brand_ids[]` to one catalog URL
and read the list of chips.

**Never bundle a brand without a verified ID.** `tests/data.test.ts` rejects
missing, zero, negative or duplicate IDs.

## Add a material

Same process with the **Material** filter and `material_ids[]`, in
`src/data/material-ids.json`:

```json
{ "id": "hemp", "name_fr": "Chanvre", "name_en": "Hemp", "vinted_id": 12345 }
```

Currently mapped materials (verified on vinted.fr on 2026-09-15): alpaca `122`,
cashmere `123`, cotton `44`, linen `146`, merino `121`, mohair `152`, silk `49`,
wool `46`.

## Tests

| File                           | Covers                                        |
| ------------------------------ | --------------------------------------------- |
| `tests/url-merge.test.ts`      | URL merge/reset keeps existing Vinted filters |
| `tests/brand-filter.test.ts`   | Category matching and counts                  |
| `tests/vinted-domains.test.ts` | Which URLs count as a Vinted catalog page     |
| `tests/storage.test.ts`        | Validation of stored preferences              |
| `tests/i18n.test.ts`           | Language resolution and dictionary parity     |
| `tests/data.test.ts`           | Integrity of the bundled JSON databases       |
| `tests/version.test.ts`        | Version parsing from `git describe`           |
| `tests/e2e/smoke.e2e.ts`       | Built extension in Chromium (`just e2e`)      |
| `tests/manual/popup-harness`   | Manual popup check in a normal browser tab    |
