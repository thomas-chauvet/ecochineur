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

### Where suggestions come from

- **Users (no account):** the popup's **Suggest a brand** link opens
  `docs/suggest.html` (or `docs/fr/suggest.html`), which embeds a
  [Tally](https://tally.so) form. If the user's Vinted search already filters a
  brand EcoChineur doesn't list, the popup prefills its Vinted ID
  (`src/lib/suggestion-url.ts`). Tally emails each response to the maintainer.
- **Contributors:** the GitHub issue form
  (`.github/ISSUE_TEMPLATE/brand-suggestion.yml`), or a pull request following
  the steps below.

Triage a Tally response the same way as an issue: check the Vinted ID first
(below), then either add the brand or record it under "Rejected candidates" in
[`SOURCES.md`](./src/data/SOURCES.md). The prefilled ID comes from the user's
own filter, so still confirm it matches the brand name they typed.

#### Suggestion form

Two Tally forms collect suggestions: FR [`LZlWVz`](https://tally.so/r/LZlWVz)
and EN [`lbQdgV`](https://tally.so/r/lbQdgV). They were built with the Tally MCP
server; to recreate one:

| Field                    | Type                 | Notes                                                               |
| ------------------------ | -------------------- | ------------------------------------------------------------------- |
| `vinted_ids`             | Hidden field         | Filled from the page URL; comma-separated, up to 5 IDs              |
| `vinted_host`            | Hidden field         | e.g. `www.vinted.fr`. IDs are only verified on vinted.fr            |
| Brand name               | Short text, required |                                                                     |
| Vinted brand ID          | Short text           | Default value `@vinted_ids`, so the prefill is visible and editable |
| Category                 | Multiple choice      | The five categories from the table below                            |
| Brand website            | URL                  |                                                                     |
| Why should it be listed? | Long text, required  | Links to production sites, certifications, reports                  |
| Email                    | Email, optional      | Only to follow up; say so in the field description                  |

Then turn on email notifications, and put each form's ID (from its share link,
`tally.so/r/<ID>`) in the `TALLY_FORM_ID` constant of `docs/suggest.html` and
`docs/fr/suggest.html`. Without a valid ID, the page falls back to the GitHub
issue form. Tally's `embed.js` forwards the page's own query string to the form,
which is why the page strips unvalidated parameters from the address bar first.
Publish the pages before releasing an extension version that links to them.

#### First: does Vinted know the brand?

A brand can only be filtered if Vinted already has it in its own brand list. The
extension works by appending Vinted's `brand_ids[]` parameter to the search URL,
so a brand with no Vinted identifier cannot be targeted at all — there is
nothing to put in the URL.

Vinted creates a brand entry only once members actually list items from that
brand. A small, young or purely direct-to-consumer label therefore often has no
entry, however well it fits our criteria. **This is the single biggest limit on
the list**, and it is not something we can work around: of 239 clothing makers
with exclusively French production checked in September 2026, only 25 had a
Vinted brand entry.

So check the ID first, before spending time researching a brand's origin. If
there is no entry, record the brand under "Rejected candidates" in
[`SOURCES.md`](./src/data/SOURCES.md) so nobody researches it twice, and move
on. It is worth re-checking later: an entry can appear once the brand starts
being resold.

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

| Category        | Meaning                                                                             |
| --------------- | ----------------------------------------------------------------------------------- |
| `france-ofg`    | French production certified Origine France Garantie. Strictest tier                 |
| `france`        | French production. Cumulative: selecting it also matches `france-ofg`               |
| `europe`        | 100% European production outside France (EU, UK, CH, NO…)                           |
| `france-europe` | Production split across France and other European countries, nothing outside Europe |
| `eco`           | Eco-conscious brand without a strong European production anchor                     |

A brand is `france-ofg` exactly when its `certifications` include
`Origine France Garantie`; a test enforces this. `certifications` entries must
come from the `CERTIFICATIONS` list in `src/types/index.ts`.

#### Origine France Garantie

[Origine France Garantie](https://www.originefrancegarantie.fr/) is France's
only official manufacturing-origin label, and the directory there is the place
to look for candidates. A product is certified when it takes on its essential
characteristics in France **and** at least 50% of its unit cost price is French.
An independent body re-audits the company every year, which is what makes the
label worth a filter of its own: unlike a self-declared "fabriqué en France", a
third party has checked it.

Search the certified companies here:
<https://www.originefrancegarantie.fr/annuaire-des-produits-certifies/categorie/confection-textile-accessoires>
(the plain `/annuaire` page is a client-side app and returns nothing to a
script).

Two traps make the directory harder to use than it looks:

- **It certifies product ranges, not companies.** Around 700 companies hold the
  label across roughly 2,700 ranges, and a company is listed if any one range
  qualifies. Aigle and Eram appear on it while making much of their output
  abroad. Use `france-ofg` only when a brand's whole relevant range is certified
  — 1083 states that 100% of its jeans are.
- **It lists legal entities, not consumer brands.** You have to map them:
  `L'EQUIPE 1083` is 1083, `SI-CREATIVE – COMME AVANT` is Comme Avant,
  `BROUSSAUD TEXTILES` is Maison Broussaud, `MFC ERAM` is Eram.

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

To check many brands at once, open `https://www.vinted.fr/catalog`, then run
this from the browser console **on that page** — the endpoint refuses requests
from outside the vinted.fr origin, but answers normally from within it:

```js
const u = new URL('/api/v2/brands', location.origin);
u.searchParams.set('keyword', 'Saint James'); // the parameter is `keyword`
const { brands } = await (await fetch(u)).json();
brands.map((b) => `${b.id} ${b.title} ${b.pretty_item_count}`);
```

Results are ranked by popularity, not by relevance, so **match the title
exactly** rather than taking the first hit: searching `Loom` returns _Fruit of
the Loom_ first. Compare after stripping accents, case and punctuation.
`item_count` also tells you whether anyone actually sells the brand. Any ID
found this way still deserves the chip check in step 4.

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
| `tests/suggestion-url.test.ts` | Suggest-page link and its brand ID prefill    |
| `tests/storage.test.ts`        | Validation of stored preferences              |
| `tests/i18n.test.ts`           | Language resolution and dictionary parity     |
| `tests/data.test.ts`           | Integrity of the bundled JSON databases       |
| `tests/version.test.ts`        | Version parsing from `git describe`           |
| `tests/e2e/smoke.e2e.ts`       | Built extension in Chromium (`just e2e`)      |
| `tests/manual/popup-harness`   | Manual popup check in a normal browser tab    |
