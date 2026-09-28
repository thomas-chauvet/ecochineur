# Brand sources and review status

Why each brand is listed, how sure we are about the claim, and what still needs
checking. A maintainer reviews this list before each store release. Brand name,
Vinted ID, category and the `eco` flag live only in `src/data/brands.json` —
cross-reference by name; this file doesn't repeat them.

Vinted IDs are verified on live `vinted.fr` by opening the Filters → Brand panel
and requiring an exact, accent-insensitive title match — matching on the top
search hit is not safe: `Loom` ranks _Fruit of the Loom_ first. The
**Confidence** column below is how sure we are about the claim, based on the
brand's public communication. Medium or low means: check the brand's own
production/transparency page before release, and add the link here.

## Categories

| Category              | Means                                                                                                                                                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `france-ofg`          | Made in France **and** certified Origine France Garantie. Strictest tier                                                                                                                                                                                                                                     |
| `france`              | Made in France. Cumulative: selecting it also matches `france-ofg`                                                                                                                                                                                                                                           |
| `europe`              | Made in Europe, outside France                                                                                                                                                                                                                                                                               |
| `france-europe`       | Production split across France and other European countries, **nothing outside Europe**                                                                                                                                                                                                                      |
| `eco`                 | Environmental/social claim is the primary merit; production may be anywhere                                                                                                                                                                                                                                  |
| `kids-natural-fibers` | Children's/baby clothing whose primary merit is natural-fibre material (organic cotton, wool, silk) with a credible certification claim; production may be anywhere. Reserved for brands whose core audience is kids/babies — a general/family brand with the same natural-fibre merit goes in `eco` instead |

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

### france-ofg

| Brand       | Why listed                                                                                                                                                          | Confidence | To check before release                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------ |
| 1083        | OFG-certified since 2015 (97% French value); woven and sewn at Rupt-sur-Moselle, Marseille and Romans; GOTS cotton. OFG entity: L'EQUIPE 1083                       | High       | —                                                                              |
| Comme Avant | All clothing sewn in its own workshop at Pennes-Mirabeau (Marseille); GOTS organic cotton and linen. OFG entity: SI-CREATIVE – COMME AVANT                          | Medium     | Confirm the OFG certification covers the textile range, not only the cosmetics |
| Monnet      | Socks knitted at Montceau-les-Mines, all production on site; OFG and Entreprise du Patrimoine Vivant. Yarn sourced in Europe, which OFG permits. OFG entity: MONNET | High       | —                                                                              |

### france

| Brand                      | Why listed                                                                       | Confidence | To check before release                                                                  |
| -------------------------- | -------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------- |
| Saint James                | Knitwear made in its own workshops in Saint-James (Normandy)                     | High       | Confirm all product lines are French-made; not on the OFG list                           |
| Le Minor                   | Breton shirts knitted and sewn in Brittany                                       | High       | —                                                                                        |
| Le Slip Français           | Made-in-France underwear and basics                                              | Medium     | Some accessories may be made elsewhere in Europe — if confirmed, move to `france-europe` |
| Atelier Tuffery            | Oldest French jeans maker (1892), Florac, Lozère. Listed on Vinted as "Tuffery"  | High       | Confirm no Portuguese confection; not on the OFG list                                    |
| Kleman                     | Derbies and workwear shoes made in the family workshop, La Romagne (49)          | High       | —                                                                                        |
| La Botte Gardiane          | Camargue boots stitched in its Gard (30) workshop since 1958; EPV since 2007     | High       | —                                                                                        |
| Labonal                    | Socks knitted in Dambach-la-Ville, Alsace since 1924; France Terre Textile       | High       | —                                                                                        |
| K.Jacques                  | Saint-Tropez sandals from the family atelier since 1933                          | Medium     | Confirm the whole range is still made in Saint-Tropez                                    |
| Payote                     | Espadrilles assembled in Perpignan; recycled rubber soles, organic cotton canvas | Medium     | Cotton and rubber are sourced in Spain — French assembly only                            |
| La Gentle Factory          | Organic cotton and linen basics made in northern France                          | Medium     | Verify current workshops and the eco claim                                               |
| Bleuforêt                  | Socks and tights knitted in Vagney (Vosges); France Terre Textile                | Medium     | Confirm whole range is Vosges-made                                                       |
| Kiplay                     | Workwear made in its Normandy workshops since 1921                               | Medium     | Confirm the Kiplay Vintage line is also French-made                                      |
| Montlimart                 | Menswear designed and mostly made in France (Vendée)                             | Low        | "Mostly" — if a meaningful share is non-EU, drop it as with Armor Lux                    |
| Bleu de Chauffe            | Leather bags stitched and signed in its Aveyron workshop; EPV                    | High       | —                                                                                        |
| Bosabo                     | Clogs and mules assembled by hand in France                                      | Medium     | Verify sole and upper sourcing                                                           |
| Berthe aux Grands Pieds    | Leather shoes made in France                                                     | Low        | Only source so far is the marques-de-france directory                                    |
| Les Petites Jupes de Prune | Skirts and dresses sewn in small batches in French workshops                     | Low        | Only source so far is the marques-de-france directory                                    |
| Parisienne et Alors        | Women's ready-to-wear made in France                                             | Low        | Only source so far is the marques-de-france directory                                    |
| Les Jupons de Louison      | Lingerie and petticoats sewn in France in small batches                          | Low        | Only 268 Vinted items; verify the brand and its origin                                   |
| Retour de Plage            | French beachwear; appears on the OFG certified-company list as RETOUR DE PLAGE   | Medium     | No independent production page found — verify the workshop and the certified range       |

### europe

| Brand            | Why listed                                                                                   | Confidence | To check before release                                               |
| ---------------- | -------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------- |
| John Smedley     | Knitwear made at its Lea Mills, Derbyshire (UK)                                              | High       | —                                                                     |
| Birkenstock      | Footwear produced in Germany and other European sites; resoleable                            | Medium     | Confirm no non-European production for current lines                  |
| Meindl           | Hiking boots made in Germany and Europe; resoleable                                          | Medium     | Confirm no Asian production for current lines                         |
| Minuit sur Terre | Vegan shoes made in the Porto region, materials from Italy; PETA Approved Vegan              | High       | No French production — hence `europe`, not `france-europe`            |
| Bobbies          | Designed in Paris, made in southern European workshops                                       | Medium     | Confirm no production outside Europe                                  |
| Grodo            | Organic cotton and wool hosiery (>80% GOTS) made in Germany, Slovenia and Croatia since 1982 | Medium     | Confirm the remaining ~20% of the range isn't produced outside Europe |

### france-europe

| Brand    | Why listed                                                                                             | Confidence | To check before release                |
| -------- | ------------------------------------------------------------------------------------------------------ | ---------- | -------------------------------------- |
| Loom     | Portugal (main), France (socks, Tarn), Spain, Italy. Nothing outside Europe                            | High       | —                                      |
| Asphalte | ~80% Portugal, ~14% Romania, one French reference (Marcoux Lafay). Pre-order model avoids unsold stock | High       | Re-check the country split each season |
| Ubac     | Recycled wool spun and woven in the Tarn, assembled north of Porto                                     | High       | Only 272 Vinted items                  |

### eco

| Brand         | Why listed                                                                                                                                               | Confidence | To check before release                                                                 |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------- |
| Veja          | Organic cotton and wild rubber, fair trade sourcing, made in Brazil                                                                                      | High       | Check current B Corp status                                                             |
| Patagonia     | B Corp, Fair Trade Certified sewing, Worn Wear repair program                                                                                            | High       | —                                                                                       |
| Faguo         | B Corp; recycled materials and carbon offsetting                                                                                                         | Medium     | Moved from `mixed`: production is partly in Asia, so it fails the `france-europe` rule  |
| Nudie Jeans   | Organic cotton, free lifetime repairs, Fair Wear member                                                                                                  | Medium     | Moved from `mixed`: some Tunisian production — confirm                                  |
| Living Crafts | GOTS-certified organic cotton for the whole family, designed in Bavaria; production spans Germany, Lithuania, Turkey and India, and raw cotton from Mali | High       | General/family brand, not kids-specific — hence `eco`, not `kids-natural-fibers`        |
| Hessnatur     | German natural-textile pioneer since 1976, B Corp certified; production spans Germany, Portugal, India and Bangladesh                                    | High       | General/family brand, not kids-specific — hence `eco`, not `kids-natural-fibers`        |
| Émoi Émoi     | GOTS-certified organic cotton for the whole family (maternity, women, men, kids); 96% made in Europe (37% France, 32% Portugal), some auditing in India  | Medium     | Confirm whether the non-France/Portugal share includes actual production outside Europe |

### kids-natural-fibers

| Brand          | Why listed                                                                                                                                                    | Confidence | To check before release                                                                                                                                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Alana          | dm house brand since 1986; organic cotton and wool childrenswear, ~90% GOTS-certified today (GOTS itself dates from 2006)                                     | Medium     | This is dm-drogerie markt's private house brand, not an independent company — included because ~90% of the range is independently GOTS-certified (unlike Bout'chou, below, which carries no certification claim); confirm the uncertified ~10% doesn't dilute this |
| Alkena         | GOTS-certified 100% organic silk baselayers since 1978                                                                                                        | Medium     | Sources disagree on HQ country (Switzerland vs. Germany) — confirm                                                                                                                                                                                                 |
| Cosilana       | GOTS-certified wool-silk-cotton underwear knitted in Baden-Württemberg                                                                                        | High       | —                                                                                                                                                                                                                                                                  |
| Disana         | GOTS-certified organic merino wool knitwear, knitted and sewn in-house in Germany                                                                             | High       | Founding year unclear (sources say 1969 or 1982), so the description omits it                                                                                                                                                                                      |
| Engel          | GOTS-certified organic wool and silk garments made in Swabia since 1982                                                                                       | High       | —                                                                                                                                                                                                                                                                  |
| iobio          | GOTS- and OEKO-TEX-certified organic cotton/wool/silk babywear, made in Hungary; a product line of Popolini (below)                                           | High       | Same manufacturer as Popolini — consider whether both entries should stay separate                                                                                                                                                                                 |
| popolini       | GOTS- and OEKO-TEX-certified organic cotton/wool cloth nappies and babywear, made in its own Hungarian factory since 1991; iobio (above) is its clothing line | High       | Same company as iobio — see above                                                                                                                                                                                                                                  |
| Lilano         | Organic wool/silk/cotton babywear made in the Swabian Alb since 2012, kbT-certified wool (not in the app's certification vocabulary)                          | Medium     | GOTS status not independently confirmed — check the IVN/GOTS database directly                                                                                                                                                                                     |
| Loud + Proud   | GOTS-certified organic cotton childrenswear manufactured exclusively in Europe since 2008                                                                     | High       | —                                                                                                                                                                                                                                                                  |
| Matona         | Organic cotton/linen kidswear designed in Austria, made in small GOTS-certified workshops in Portugal since 2016                                              | High       | —                                                                                                                                                                                                                                                                  |
| Nostebarn      | Untreated organic wool and silk childrenswear, Norwegian ecological brand since 1983                                                                          | Low        | No certification independently confirmed — verify before release                                                                                                                                                                                                   |
| Kite           | GOTS-certified organic cotton baby/kids clothing designed in Poole (Dorset) since 2007                                                                        | Medium     | Manufacturing country not confirmed; common English word — Vinted results checked and consistent with the real brand                                                                                                                                               |
| Frugi          | The UK's leading GOTS-certified organic cotton childrenswear brand, designed in Cornwall since 2004                                                           | High       | Manufacturing country not confirmed                                                                                                                                                                                                                                |
| Poudre Organic | GOTS- and OEKO-TEX-certified organic cotton kidswear made in a Portuguese workshop since 2015                                                                 | High       | —                                                                                                                                                                                                                                                                  |
| Silly Silas    | GOTS- and OEKO-TEX-certified organic cotton/merino wool tights, designed in Sweden and made in Czech workshops                                                | High       | Product range limited to tights/hosiery                                                                                                                                                                                                                            |
| PickaPooh      | GOTS-certified natural-fibre hats and accessories designed and made in Hamburg since 1991                                                                     | High       | Product range limited to accessories, not full clothing                                                                                                                                                                                                            |
| Play Up        | Organic cotton and recycled-fibre childrenswear designed and made in Portugal                                                                                 | Low        | Legal HQ disputed across sources (French-founded vs. Portugal-based); no closed-list certification independently confirmed; common phrase — Vinted results checked and consistent with the real brand                                                              |
| manymonths     | Grow-with-me merino wool babywear, Finnish brand made in a GOTS-certified, Scandinavian-owned factory in China                                                | Low        | No certification confirmed for the finished garments (only the wool itself); production entirely outside Europe — kept because the category doesn't require European manufacturing, only a credible material/certification claim                                   |
| Apolina        | Hand-embroidered organic cotton/merino wool childrenswear designed in London, made in a family-run, Sedex-approved factory in India                           | Low        | No closed-list certification independently confirmed; production outside Europe                                                                                                                                                                                    |

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

### Checked on 2026-09-28: natural-fibre/GOTS children's brands batch

| Candidate                      | Vinted entry          | Why rejected                                                                                                                                                                                                                                                                                                  |
| ------------------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bout'chou (Monoprix Bout'chou) | Bout'chou (174332)    | Monoprix's private house label for babywear (being phased into "Monoprix Bébé"); no organic/natural-fibre or certification claim found at all — unlike Alana (above), there's no independent evidence to vouch for the range                                                                                  |
| Minimalisma                    | Minimalisma (461210)  | Only the organic cotton line is GOTS-certified; the bulk of the range (cashmere, silk, alpaca, wool) carries no confirmed certification, and production spans Bangladesh and China — same "only part of the range" problem as ERAM/Aigle. HQ country is also disputed across sources (Switzerland vs. Nordic) |
| Misha & Puff                   | Misha & Puff (446811) | US company (Los Angeles/New England), hand-knit in Peru and Bolivia — not a European brand, and no GOTS/OEKO-TEX/Fair Wear/B Corp/PETA certification found                                                                                                                                                    |

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

From the 2026-09-28 natural-fibre/GOTS children's brands batch (checked via the
Vinted.fr brand filter UI, plain names and 1-2 Instagram-handle variants each,
no exact match found): abitibee · ardelaine.scop ("Ardelaine") · aufildelaine12
("Au fil de laine") · bambinocircus ("Bambino Circus") · chou.a.la.laine ("Chou
a la laine") · creationsdouceur ("Créations Douceur") · graine.d.amour ("Graine
d'Amour") · hirsch_natur_gmbh ("Hirsch Natur") · jmtoutdoux ("Tout Doux") ·
kokonzwo ("Kokon Zwo") · La Ferme du Beau · langedebebe ("Ange de Bébé") ·
lapetitealiceshop ("La Petite Alice") · Little Woude · macouchedurable ("Ma
Couche Durable") · Manitober · needleandpineuk ("Needle and Pine") · or.basics
("Or Basics") · pitigaia.fr ("Piti Gaia") · q.for.quinn ("Q for Quinn") ·
reiffstrick · risurisuparis ("Risu Risu") · serendipityorganics ("Serendipity
Organics" — a bare "Serendipity" brand exists on Vinted but wasn't treated as a
match; see Ambiguous Vinted entry below).

### Ambiguous Vinted entry

| Candidate           | Problem                                                                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Le Gaulois Jeans    | The exact name returns nothing; "Le Gaulois" (399582) is very likely the poultry brand                                                                                                     |
| SAAJ                | Two entries, SAAJ (304761) and SAAJ Paris (312617) — which one is the brand?                                                                                                               |
| Jules & Jenn        | Vinted ID never confirmed. Production is Portugal/Spain/Italy, so it would be `europe`                                                                                                     |
| Not Your Girl       | Entry exists (318058) but no origin evidence found                                                                                                                                         |
| S. 24               | OFG entity BOSSI INDUSTRIE - S24. Vinted "S. 24" (15463584) may be a different brand                                                                                                       |
| Zanzibar            | OFG entity ZANZIBAR PRODUCTION. Vinted "Zanzibar" (414288) is probably unrelated                                                                                                           |
| Regain, La Fabrique | OFG-listed entities whose Vinted entries match a common word                                                                                                                               |
| Dungaree            | "Dungaree" (324369) matches on Vinted, but every result is a plain pair of denim dungarees/overalls — very likely users tagging the garment type as a brand, not a real company. Not added |
| Serendipity         | A bare "Serendipity" brand exists on Vinted; unclear whether it's the same organic-kidswear brand as "serendipityorganics" or an unrelated one. Not added                                  |

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
