# Contributing to EcoChineur

The brand database is intentionally curated. A brand must have a clear reason to
be listed: local production, responsible materials, recognized certifications, a
repair program, or a documented environmental approach.

## Add a Brand

Edit `src/data/brands.json` with a complete entry:

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

Valid categories:

- `france`: 100% French production.
- `europe`: 100% European production outside France.
- `mixed`: serious ethical efforts, but production is not exclusively European.
- `eco`: eco-conscious brand without a strong European production anchor.

The `eco` field is a cumulative tag. A `france` brand with `eco: true` appears
in both the French brand filter and the eco-conscious filter.

## Find a Vinted Brand ID

1. Open any Vinted country catalog (e.g. `https://www.vinted.fr/catalog`).
2. Search for the brand in Vinted's brand filter.
3. Select the brand.
4. Copy the `brand_ids[]=XXXXX` value from the URL.
5. Store that value in `vinted_id`.

Do not add unmapped brands to `src/data/brands.json`. They must stay out of the
bundled database until their `vinted_id` is verified.

## Add a Material

Edit `src/data/material-ids.json` only after verifying the Vinted ID. Unmapped
materials must not be bundled.

## Commit Messages

Commits must follow the
[Conventional Commits](https://www.conventionalcommits.org) format, e.g.
`feat: add material filter` or `fix(popup): preserve price filter`. A Husky
`commit-msg` hook runs commitlint locally and CI lints PR commits. The release
changelog is generated from these messages by
[git-cliff](https://git-cliff.org), so well-formed commits keep `CHANGELOG.md`
accurate. Common types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`,
`build`, `ci`, `chore`.

## Language Rules

- Developer documentation must be written in English.
- Code, comments, filenames, and developer-facing metadata must be written in
  English.
- French is used only for the Chrome extension's French user interface and
  user-visible French brand/material descriptions.
- Keep `src/i18n/fr.json` and `src/i18n/en.json` complete and equivalent.

## Verification

```bash
just check
```

Or:

```bash
npm test
npm run lint
npm run build
```
