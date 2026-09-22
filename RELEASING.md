# Releasing EcoChineur

## Versioning

The git tag sets the version. At build time, `version.ts` runs
`git describe --tags` and writes the result into the manifest. The `version` in
`package.json` is a placeholder and is never used.

| Tag            | manifest `version` | manifest `version_name` | GitHub Release |
| -------------- | ------------------ | ----------------------- | -------------- |
| `v1.2.3`       | `1.2.3`            | `1.2.3`                 | Full release   |
| `v1.2.3-rc.1`  | `1.2.3`            | `1.2.3-rc.1`            | Pre-release    |
| (between tags) | `1.2.3`            | `1.2.3-5-gabc123`       | —              |

Chrome only accepts numeric versions, so the suffix is stripped from `version`
and kept in `version_name` (visible in `chrome://extensions`).

The Chrome Web Store requires each upload to have a strictly greater `version`.
`v1.2.3-rc.1` and `v1.2.3` produce the same store version, so upload release
candidates to the store only if the final release will use a higher number.

## Cut a release

From a clean, up-to-date `main`:

```bash
just release 0.1.0          # or 0.1.0-rc.1
```

The recipe checks that you are on a clean `main`, pulls, runs `npm run check`,
then creates and pushes the annotated tag `v0.1.0`.

When the tag is pushed, `.github/workflows/release.yml`:

1. checks out full history and tags, so the build can derive the version;
2. runs `npm run check` and `npm audit --audit-level=high`;
3. zips `dist/` into `ecochineur-v0.1.0.zip`;
4. generates release notes for this tag with git-cliff and creates the GitHub
   Release with the zip attached (tags containing `-` become pre-releases);
5. regenerates `CHANGELOG.md` and commits it back to `main`
   (`chore(release): update changelog … [skip ci]`).

Release notes come from Conventional Commit messages, so keep them tidy (see
[CONTRIBUTING.md](./CONTRIBUTING.md#commit-messages)). To preview the changelog
locally: `just changelog`.

To test the packaged zip without releasing: `just package` writes
`release/ecochineur-v<git-describe version>.zip`.

## Website and privacy policy

`docs/` is served by GitHub Pages from the `main` branch (`/docs` folder) at
<https://ecochineur.chaurel.ch>:

- `docs/CNAME` holds the custom domain;
- the Infomaniak DNS zone for `chaurel.ch` has a `CNAME` record `ecochineur` →
  `thomas-chauvet.github.io.`;
- English pages are at the root, French pages in `docs/fr/`.

HTTPS is live since 2026-09-15: Let's Encrypt certificate for
`ecochineur.chaurel.ch`, **Enforce HTTPS** on, and `http://` redirects to
`https://`. `chaurel.ch` is a verified domain on the GitHub profile (`TXT`
record at Infomaniak), which stops anyone else from claiming a `chaurel.ch`
subdomain on GitHub Pages.

If the certificate ever goes missing (for example after a DNS change), remove
the custom domain in **Settings → Pages** and add it back: that is what starts a
new certificate request. Re-enable enforcement there, or with:

```bash
gh api -X PUT repos/thomas-chauvet/ecochineur/pages -F https_enforced=true
```

The store privacy policy URL is `https://ecochineur.chaurel.ch/privacy.html`.

## Chrome Web Store: first submission

One-time setup:

1. Register a
   [Chrome Web Store developer account](https://chrome.google.com/webstore/devconsole)
   (one-time registration fee) and verify the contact email. A dedicated address
   such as `ecochineur@chaurel.ch` keeps store mail separate.
2. Optional: verify `chaurel.ch` in Google Search Console, so the Developer
   Console can show a verified publisher domain.

Submission:

1. Run the [manual smoke test](#manual-smoke-test) on the release build.
2. Download the zip from the GitHub Release.
3. In the Developer Console, click **New item** and upload the zip.
4. **Store listing**: use the copy below, category **Shopping**, languages
   English + French. Upload the assets from [`store/`](./store/README.md):
   screenshots (1280×800) and the small promo tile (440×280). Check the console
   for the current asset requirements.
5. **Privacy practices**: fill in the single purpose, the permission
   justifications and the data usage answers below. Privacy policy URL:
   `https://ecochineur.chaurel.ch/privacy.html`.
6. **Distribution**: public, all regions.
7. **Submit for review**.

### Later updates

Developer Console → EcoChineur → **Package → Upload new package** → upload the
zip from the new GitHub Release → **Submit for review**. If permissions change,
update the justifications and the privacy policies at the same time.

## Store listing copy

**Name**: EcoChineur

**Short description** (≤ 132 chars, same as the manifest):

> Filter Vinted searches by ethical brands and natural materials. No data
> collection, no tracking.

**Detailed description (en)**:

> EcoChineur helps you find second-hand clothes from more responsible brands and
> in natural materials on Vinted.
>
> Open a Vinted search, click the EcoChineur icon, choose categories (French
> brands, European brands, mixed brands, eco-conscious brands) and/or materials
> (linen, cotton, wool, silk, cashmere, alpaca, mohair, merino), then click
> "Apply filters". EcoChineur adds the matching Vinted filters to your current
> search. Your search text, price, sort order, condition and the brands you
> already picked stay as they are.
>
> Private by design:
>
> - no account, no backend, no tracking, no analytics;
> - preferences are stored only on your device;
> - minimal permissions: the extension can only see the active tab, and only
>   after you click its icon.
>
> Works on all Vinted country sites. Interface in English and French. Free and
> open source (GPL-3.0): <https://github.com/thomas-chauvet/ecochineur>
>
> EcoChineur is an independent project, not affiliated with or endorsed by
> Vinted.

**Description courte (fr)** :

> Filtrez vos recherches Vinted par marques éthiques et matières naturelles.
> Aucune collecte de données, aucun pistage.

**Description détaillée (fr)** :

> EcoChineur vous aide à trouver sur Vinted des vêtements de seconde main de
> marques plus responsables et en matières naturelles.
>
> Ouvrez une recherche Vinted, cliquez sur l'icône EcoChineur, choisissez des
> catégories (marques françaises, européennes, mixtes, éco-responsables) et/ou
> des matières (lin, coton, laine, soie, cachemire, alpaga, mohair, mérinos),
> puis cliquez sur « Appliquer les filtres ». EcoChineur ajoute les filtres
> Vinted correspondants à votre recherche. Le texte recherché, le prix, le tri,
> l'état et les marques déjà choisies sont conservés.
>
> Privée par conception :
>
> - pas de compte, pas de serveur, pas de pistage, pas de statistiques ;
> - les préférences restent sur votre appareil ;
> - permissions minimales : l'extension ne voit que l'onglet actif, et seulement
>   après un clic sur son icône.
>
> Fonctionne sur tous les sites Vinted. Interface en français et en anglais.
> Libre et open source (GPL-3.0) :
> <https://github.com/thomas-chauvet/ecochineur>
>
> EcoChineur est un projet indépendant, sans lien avec Vinted.

## Privacy practices answers

**Single purpose**: Add ethical brand and natural material filters to the Vinted
search the user is viewing.

**Permission justifications**:

- `storage`: Saves the user's selected brand categories, materials and interface
  language locally, so they are kept between popup openings. Nothing is synced
  or transmitted.
- `activeTab`: When the user opens the popup and clicks Apply or Reset, the
  extension reads the active tab URL to check that it is a Vinted catalog page.
  It then navigates that tab to the same URL with brand/material filter
  parameters added or removed. No other tab or site is accessed.

**Remote code**: No. All JavaScript is bundled in the package.

**Data usage**: tick none of the data types. Certify that user data is not sold,
not used for purposes unrelated to the single purpose, and not used for
creditworthiness or lending.

### Réponses en français

Paste these when the Developer Console is in French. Browser automation cannot
help here: Chrome forbids extensions from scripting `chrome.google.com`, so the
console has to be filled by hand.

**Objectif unique** :

> Ajouter des filtres de marques éthiques et de matières naturelles à la
> recherche Vinted que l'utilisateur consulte.

**Justification pour `storage`** :

> Enregistre localement les catégories de marques, les matières et la langue
> choisies par l'utilisateur, afin de les conserver d'une ouverture du popup à
> l'autre. Aucune donnée n'est synchronisée ni transmise à un serveur.

**Justification pour `activeTab`** :

> Lorsque l'utilisateur ouvre le popup et clique sur « Appliquer les filtres »
> ou « Réinitialiser », l'extension lit l'URL de l'onglet actif pour vérifier
> qu'il s'agit d'une page catalogue Vinted, puis redirige ce même onglet vers la
> même URL en ajoutant ou retirant les paramètres de filtres de marques et de
> matières. Aucun autre onglet ni site n'est consulté.

**Code distant** : choisir « Non, je n'utilise pas de code distant », puis :

> Tout le code JavaScript est inclus dans le package de l'extension. Aucun
> script n'est chargé depuis un serveur distant.

**Utilisation des données** : ne cocher aucun type de données, puis cocher les
trois cases de certification (pas de vente ni de transfert à des tiers, pas
d'usage étranger à l'objectif unique, pas d'usage pour la solvabilité ou le
crédit).

## Manual smoke test

`just e2e` automates every item below except the install prompt. It loads the
production build in headless Chromium, simulates the toolbar click and uses
stubbed Vinted pages. CI and the release workflow run it too.

For a final check by hand before submitting, load `dist/` from a fresh
`just build` (not while `just dev` is running) via
`chrome://extensions → Developer mode → Load unpacked`:

- [ ] No permission warning at install time.
- [ ] On `https://www.vinted.fr/catalog?search_text=pull&price_to=30`, the popup
      opens and **Apply** is disabled with nothing selected.
- [ ] Tick a material → Apply → the tab reloads with `material_ids[]`, and
      `search_text` and `price_to` are kept.
- [ ] Tick **French brands** → Apply → `brand_ids[]` added. A brand picked
      manually beforehand is kept.
- [ ] Works on a category path (`/catalog/…`) and on another domain
      (`vinted.de`, `vinted.co.uk`).
- [ ] **Show matching brands**, then search "Veja", shows its card.
- [ ] FR ↔ EN switch translates everything, and the choice persists after
      reopening.
- [ ] **Reset** unchecks every option (still unchecked after reopening the
      popup) and removes only `brand_ids[]` and `material_ids[]` from the URL.
- [ ] Outside a Vinted catalog (e.g. a Vinted item page), Apply shows the "Start
      a Vinted search first" message.
- [ ] **Suggest a brand** opens the GitHub issue form.
- [ ] DevTools → Network on the popup shows no requests made by the extension.

## Troubleshooting

| Symptom                                      | Cause                                                 | Fix                                                         |
| -------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| Store rejects the zip                        | Manifest `version` not greater than the published one | Tag a higher version                                        |
| Workflow fails at `npm audit`                | High-severity advisory in a dependency                | `npm audit`, update the package, tag again                  |
| `version_name` is `0.0.0` or a commit hash   | No reachable tag (shallow clone, tags not fetched)    | `git fetch --tags`; CI checks out with `fetch-depth: 0`     |
| Popup says "Start a Vinted search" on Vinted | Hostname missing from `src/lib/vinted-domains.ts`     | Add it and a test in `tests/vinted-domains.test.ts`         |
| `ecochineur.chaurel.ch` shows a GitHub 404   | `docs/CNAME` removed, or Pages source changed         | Restore `docs/CNAME`; Pages source must be `main` / `/docs` |
