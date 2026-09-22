# Chrome Web Store assets

Screenshots and tiles are generated from the real popup (through the manual
harness) so they stay in sync with the UI. They contain no Vinted logo or
branding.

| File                        | Size     | Store slot                      |
| --------------------------- | -------- | ------------------------------- |
| `store-icon-128.png`        | 128×128  | Store icon ("Icône du magasin") |
| `screenshot-en-filters.png` | 1280×800 | Screenshot 1 (English)          |
| `screenshot-en-brands.png`  | 1280×800 | Screenshot 2 (English)          |
| `screenshot-fr-filters.png` | 1280×800 | Screenshot 1 (French)           |
| `screenshot-fr-brands.png`  | 1280×800 | Screenshot 2 (French)           |
| `promo-tile-en.png`         | 440×280  | Small promo tile (English)      |
| `promo-tile-fr.png`         | 440×280  | Small promo tile (French)       |
| `marquee-en.png`            | 1400×560 | Marquee tile (English)          |
| `marquee-fr.png`            | 1400×560 | Marquee tile (French)           |

The marquee tile ("Image promotionnelle en haut de la page") is optional: the
Developer Console asks for it mainly to make the listing eligible for featuring.

The store icon is the extension logo at 96×96 centred on a transparent 128×128
canvas, which is the padding the Developer Console expects. The icons shipped
inside the extension (`public/icons/`) fill their whole square, so they are not
interchangeable with this one.

## Regenerate

Store icon (transparent background, no dev server needed):

```bash
node --input-type=module -e "
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 128, height: 128 } });
await page.goto('file://' + process.cwd() + '/store/store-icon.html');
await page.screenshot({ path: 'store/store-icon-128.png', omitBackground: true });
await browser.close();
"
```

Screenshots and promo tiles:

1. `just dev`
2. Open these pages in a browser window whose viewport is exactly the asset
   size, and take a viewport screenshot:
   - `http://localhost:5173/store/screenshot.html?lang=en&scene=filters`
   - `http://localhost:5173/store/screenshot.html?lang=en&scene=brands`
   - `http://localhost:5173/store/screenshot.html?lang=fr&scene=filters`
   - `http://localhost:5173/store/screenshot.html?lang=fr&scene=brands`
   - `http://localhost:5173/store/promo-tile.html?lang=en`
   - `http://localhost:5173/store/promo-tile.html?lang=fr`
   - `http://localhost:5173/store/marquee.html?lang=en` (1400×560)
   - `http://localhost:5173/store/marquee.html?lang=fr` (1400×560)

Run `just build` afterwards: the dev server rewrites `dist/` into a dev loader.

In Chrome DevTools: toggle the device toolbar, set a responsive size of 1280×800
(or 440×280), then **⋮ → Capture screenshot**.

The popup state in the screenshots comes from harness URL parameters, see
`tests/manual/popup-harness.html`: `lang`, `categories`, `materials`, `browse`.
