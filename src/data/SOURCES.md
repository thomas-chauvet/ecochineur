# Brand sources and review status

Why each brand is listed, how sure we are about its category, and what still
needs checking. A maintainer reviews this list before each store release.

- **Vinted ID** column: IDs verified on live `vinted.fr` on 2026-09-23, by
  querying `/api/v2/brands?keyword=…` from inside the vinted.fr page origin and
  requiring an exact, accent-insensitive title match. Matching on the top search
  hit is not safe: `Loom` ranks _Fruit of the Loom_ first.
- **Confidence** column: how sure we are about the _category_ and claims, based
  on the brand's public communication. Medium or low means: check the brand's
  own production/transparency page before release, and add the link here.

## Categories

| Category        | Means                                                                                   |
| --------------- | --------------------------------------------------------------------------------------- |
| `france-ofg`    | Made in France **and** certified Origine France Garantie. Strictest tier                |
| `france`        | Made in France. Cumulative: selecting it also matches `france-ofg`                      |
| `europe`        | Made in Europe, outside France                                                          |
| `france-europe` | Production split across France and other European countries, **nothing outside Europe** |
| `eco`           | Environmental/social claim is the primary merit; production may be anywhere             |

`france-ofg` membership is tied to the `Origine France Garantie` certification
by a test in `tests/data.test.ts`, so the two cannot drift apart.

### The OFG label certifies ranges, not companies

Origine France Garantie covers ~2,700 _product ranges_ across ~700 companies. A
company appears on the OFG list if **any** of its ranges qualifies, so the list
alone never justifies `france-ofg`. Use it only when the brand's whole relevant
range is certified — 1083 states that 100% of its jeans are. This is why Aigle,
Eram and Eminence are on the OFG list but not in this file.

OFG also registers **legal entities**, not consumer brands, so entries need
mapping: `L'EQUIPE 1083` is 1083, `SI-CREATIVE – COMME AVANT` is Comme Avant,
`BROUSSAUD TEXTILES` is Maison Broussaud, `MFC ERAM` is Eram.

## Listed brands

| Brand                      | Vinted ID | Category      | eco | Why listed                                                                                                                                                          | Confidence | To check before release                                                                  |
| -------------------------- | --------- | ------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------- |
| 1083                       | 318321    | france-ofg    | yes | OFG-certified since 2015 (97% French value); woven and sewn at Rupt-sur-Moselle, Marseille and Romans; GOTS cotton. OFG entity: L'EQUIPE 1083                       | High       | —                                                                                        |
| Comme Avant                | 468047    | france-ofg    | yes | All clothing sewn in its own workshop at Pennes-Mirabeau (Marseille); GOTS organic cotton and linen. OFG entity: SI-CREATIVE – COMME AVANT                          | Medium     | Confirm the OFG certification covers the textile range, not only the cosmetics           |
| Monnet                     | 216638    | france-ofg    | no  | Socks knitted at Montceau-les-Mines, all production on site; OFG and Entreprise du Patrimoine Vivant. Yarn sourced in Europe, which OFG permits. OFG entity: MONNET | High       | —                                                                                        |
| Saint James                | 2391      | france        | no  | Knitwear made in its own workshops in Saint-James (Normandy)                                                                                                        | High       | Confirm all product lines are French-made; not on the OFG list                           |
| Le Minor                   | 35227     | france        | no  | Breton shirts knitted and sewn in Brittany                                                                                                                          | High       | —                                                                                        |
| Le Slip Français           | 234958    | france        | no  | Made-in-France underwear and basics                                                                                                                                 | Medium     | Some accessories may be made elsewhere in Europe — if confirmed, move to `france-europe` |
| Atelier Tuffery            | 504132    | france        | no  | Oldest French jeans maker (1892), Florac, Lozère. Listed on Vinted as "Tuffery"                                                                                     | High       | Confirm no Portuguese confection; not on the OFG list                                    |
| Kleman                     | 272814    | france        | no  | Derbies and workwear shoes made in the family workshop, La Romagne (49)                                                                                             | High       | —                                                                                        |
| La Botte Gardiane          | 53019     | france        | no  | Camargue boots stitched in its Gard (30) workshop since 1958; EPV since 2007                                                                                        | High       | —                                                                                        |
| Labonal                    | 285801    | france        | no  | Socks knitted in Dambach-la-Ville, Alsace since 1924; France Terre Textile                                                                                          | High       | —                                                                                        |
| K.Jacques                  | 92086     | france        | no  | Saint-Tropez sandals from the family atelier since 1933                                                                                                             | Medium     | Confirm the whole range is still made in Saint-Tropez                                    |
| Payote                     | 407908    | france        | yes | Espadrilles assembled in Perpignan; recycled rubber soles, organic cotton canvas                                                                                    | Medium     | Cotton and rubber are sourced in Spain — French assembly only                            |
| La Gentle Factory          | 334136    | france        | yes | Organic cotton and linen basics made in northern France                                                                                                             | Medium     | Verify current workshops and the eco claim                                               |
| Bleuforêt                  | 208578    | france        | no  | Socks and tights knitted in Vagney (Vosges); France Terre Textile                                                                                                   | Medium     | Confirm whole range is Vosges-made                                                       |
| Kiplay                     | 276572    | france        | no  | Workwear made in its Normandy workshops since 1921                                                                                                                  | Medium     | Confirm the Kiplay Vintage line is also French-made                                      |
| Montlimart                 | 681749    | france        | no  | Menswear designed and mostly made in France (Vendée)                                                                                                                | Low        | "Mostly" — if a meaningful share is non-EU, drop it as with Armor Lux                    |
| Bleu de Chauffe            | 276805    | france        | no  | Leather bags stitched and signed in its Aveyron workshop; EPV                                                                                                       | High       | —                                                                                        |
| Bosabo                     | 16449     | france        | no  | Clogs and mules assembled by hand in France                                                                                                                         | Medium     | Verify sole and upper sourcing                                                           |
| Berthe aux Grands Pieds    | 228384    | france        | no  | Leather shoes made in France                                                                                                                                        | Low        | Only source so far is the marques-de-france directory                                    |
| Les Petites Jupes de Prune | 140088    | france        | no  | Skirts and dresses sewn in small batches in French workshops                                                                                                        | Low        | Only source so far is the marques-de-france directory                                    |
| Parisienne et Alors        | 483892    | france        | no  | Women's ready-to-wear made in France                                                                                                                                | Low        | Only source so far is the marques-de-france directory                                    |
| Les Jupons de Louison      | 1767479   | france        | no  | Lingerie and petticoats sewn in France in small batches                                                                                                             | Low        | Only 268 Vinted items; verify the brand and its origin                                   |
| Retour de Plage            | 77934     | france        | no  | French beachwear; appears on the OFG certified-company list as RETOUR DE PLAGE                                                                                      | Medium     | No independent production page found — verify the workshop and the certified range       |
| John Smedley               | 200326    | europe        | no  | Knitwear made at its Lea Mills, Derbyshire (UK)                                                                                                                     | High       | —                                                                                        |
| Birkenstock                | 3203      | europe        | no  | Footwear produced in Germany and other European sites; resoleable                                                                                                   | Medium     | Confirm no non-European production for current lines                                     |
| Meindl                     | 283168    | europe        | no  | Hiking boots made in Germany and Europe; resoleable                                                                                                                 | Medium     | Confirm no Asian production for current lines                                            |
| Minuit sur Terre           | 332493    | europe        | yes | Vegan shoes made in the Porto region, materials from Italy; PETA Approved Vegan                                                                                     | High       | No French production — hence `europe`, not `france-europe`                               |
| Bobbies                    | 4813      | europe        | no  | Designed in Paris, made in southern European workshops                                                                                                              | Medium     | Confirm no production outside Europe                                                     |
| Loom                       | 286661    | france-europe | yes | Portugal (main), France (socks, Tarn), Spain, Italy. Nothing outside Europe                                                                                         | High       | —                                                                                        |
| Asphalte                   | 320931    | france-europe | yes | ~80% Portugal, ~14% Romania, one French reference (Marcoux Lafay). Pre-order model avoids unsold stock                                                              | High       | Re-check the country split each season                                                   |
| Ubac                       | 1012510   | france-europe | yes | Recycled wool spun and woven in the Tarn, assembled north of Porto                                                                                                  | High       | Only 272 Vinted items                                                                    |
| Veja                       | 603       | eco           | yes | Organic cotton and wild rubber, fair trade sourcing, made in Brazil                                                                                                 | High       | Check current B Corp status                                                              |
| Patagonia                  | 90804     | eco           | yes | B Corp, Fair Trade Certified sewing, Worn Wear repair program                                                                                                       | High       | —                                                                                        |
| Faguo                      | 12595     | eco           | yes | B Corp; recycled materials and carbon offsetting                                                                                                                    | Medium     | Moved from `mixed`: production is partly in Asia, so it fails the `france-europe` rule   |
| Nudie Jeans                | 95256     | eco           | yes | Organic cotton, free lifetime repairs, Fair Wear member                                                                                                             | Medium     | Moved from `mixed`: some Tunisian production — confirm                                   |

## Removed brands

Do not re-add these without new evidence.

| Brand     | Removed on | Why                                                                                                                                                                                                                                                                |
| --------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Armor Lux | 2026-09-23 | Production in Quimper **plus non-European countries**, so it fails the `france-europe` rule, and it has no eco claim to justify `eco`. Re-add if Armor Lux consolidates production in Europe.                                                                      |
| Eminence  | 2026-09-23 | OFG-certified, but only for its separately branded "Fait en France" collection knitted and sewn at Aimargues and Sauve; the rest of the range is made elsewhere. A per-brand filter would vouch for the imported lines too — same reasoning as Armor Lux and ERAM. |

## Rejected candidates

Checked on 2026-09-23 and deliberately not added.

### Only part of the range is French-made

The Vinted filter targets a whole brand, so listing these would vouch for
imported lines. All three appear on the OFG certified-company list.

| Candidate | OFG entity          | Why rejected                                                            |
| --------- | ------------------- | ----------------------------------------------------------------------- |
| ERAM      | MFC ERAM            | Only some models are French-made                                        |
| Aigle     | AIGLE INTERNATIONAL | Rubber boots made at Ingrandes, but much of the apparel is made in Asia |
| Bocage    | (Eram group)        | Same per-model problem as ERAM                                          |

### Not clothing

Kippit (small appliances) · La Chaise Française (furniture) · Le Jouet Simple
(toys) · Pelucho (soft toys) · Artiga (OFG-certified, but household linen and
Basque-striped home textiles) · Pierre Lannier (OFG-listed watchmaker) ·
Sigvaris, Innothera Nomexy, Activ Medical Disposables and Procomedic (medical
and compression textiles). Vinted does not meaningfully trade these.

### No Vinted brand entry (the filter cannot target them)

Laines Paysannes · Le Gaulois Jeans · Ateliers de Nîmes · Baron Papillon ·
Aatise · Le Béret Français · Lemahieu · Sessile · Tranquille Émile · Royalties ·
Maison Broussaud · Dao · Bontemps · Côté Français · Navir · Monébari · BonPied ·
Chausse Mouton · Maillot Français.

From the OFG list: Missègle (Atelier Missègle) · Alvana · Annah Cruz · Dolmen ·
Jolihuit · Kaolila · Loulenn · Alphonse Castex · Le Parapluie de Cherbourg ·
Petits Cadors · Geochanvre · Max Vincent · Mieg · Atelier TB · Les Tissages de
Charlieu · Les Tissages de Saint Jean de Luz · La Cartablière · Elia · Mijuin ·
Tergus · MyAlfred · Du Bon Côté · Linfini · Carré d'As · Fil Rouge · Cadoa ·
Coreme · Dessaint · Althoffer · Ultime Sport · Verne et Clet.

Plus ~214 of the 239 brands harvested from the marques-de-france directory.

### Ambiguous Vinted entry

| Candidate           | Problem                                                                                |
| ------------------- | -------------------------------------------------------------------------------------- |
| Le Gaulois Jeans    | The exact name returns nothing; "Le Gaulois" (399582) is very likely the poultry brand |
| SAAJ                | Two entries, SAAJ (304761) and SAAJ Paris (312617) — which one is the brand?           |
| Jules & Jenn        | Vinted ID never confirmed. Production is Portugal/Spain/Italy, so it would be `europe` |
| Not Your Girl       | Entry exists (318058) but no origin evidence found                                     |
| S. 24               | OFG entity BOSSI INDUSTRIE - S24. Vinted "S. 24" (15463584) may be a different brand   |
| Zanzibar            | OFG entity ZANZIBAR PRODUCTION. Vinted "Zanzibar" (414288) is probably unrelated       |
| Regain, La Fabrique | OFG-listed entities whose Vinted entries match a common word                           |

Ten further harvest hits were rejected because the brand name is a common French
word, so the Vinted entry is very likely a different brand: Cocorico, Flair,
Marco, Gaspard, WILO, Splice, Luxam, Azurée, Poze, Caruus.

### Other

| Candidate   | Why                                              |
| ----------- | ------------------------------------------------ |
| WeDressFair | A retailer, not a brand — used below as a source |

## Directories used

- [originefrancegarantie.fr](https://www.originefrancegarantie.fr/annuaire-des-produits-certifies/categorie/confection-textile-accessoires)
  — ~700 certified companies, ~2,700 certified ranges. The category path above
  is the usable entry point; `/annuaire` itself is a client-side app that
  returns nothing to a plain fetch. Read the caveats above before using it: it
  lists legal entities, and certification is per range.
- [marques-de-france.fr](https://www.marques-de-france.fr/listing/) — 1182
  brands. Its WordPress REST API supports the query that matters: `product_cat`
  in {Vêtements 1264, Chaussures 1270, Sous-vêtements 1279} **and**
  `listing-tag` 486 "Production exclusivement française" returns 239 brands.
  Rate-limits bulk paging; crawl at 25 per page. Its `listing-label` taxonomy
  tags only 10 brands as OFG and is **not** a usable source for the `france-ofg`
  tier.
- [lesitedumadeinfrance.fr](https://www.lesitedumadeinfrance.fr/) — ~800 brands.
- [lappartementfrancais.fr](https://www.lappartementfrancais.fr/) — curated
  retailer.
- [wedressfair.fr](https://www.wedressfair.fr/) — retailer with per-label pages.
