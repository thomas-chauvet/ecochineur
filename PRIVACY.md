# Privacy Policy

_Last updated: 2026-09-23_

EcoChineur is private by design. This policy covers the EcoChineur browser
extension. The public copy is at <https://ecochineur.chaurel.ch/privacy.html>
(French: <https://ecochineur.chaurel.ch/fr/privacy.html>).

## No collection

The extension collects no personal data, browsing data, history, Vinted
searches, filters, identifiers or usage statistics.

## No data use or sharing

EcoChineur does not use, sell or transfer user data for any purpose: no
analytics, profiling, advertising, audience measurement, creditworthiness, model
training or sharing with third parties.

## What is stored, and where

The only information stored is what you choose in the popup:

- selected brand categories;
- selected materials;
- preferred language.

These preferences are stored with `chrome.storage.local` on your device. They
are never sent anywhere. Uninstalling the extension deletes them.

## How the extension works

When you open the popup and click **Apply filters** or **Reset**, EcoChineur
reads the URL of the active tab. It uses the URL only to:

1. check that the page is a Vinted catalog page
   (`https://www.vinted.<country>/catalog`);
2. build, on your device, a new URL that keeps your existing filters and adds
   (or removes) brand and material filters.

The tab then navigates to that URL. EcoChineur does not store the URL, send it
anywhere or keep any history.

When you click **Suggest a brand**, EcoChineur reads the active tab URL once
more. If it is a Vinted catalog page, it takes the Vinted brand IDs you filter
on that EcoChineur does not list yet (at most five), plus the Vinted domain
(e.g. `www.vinted.fr`), and adds them to the suggestion link to prefill the
form. Nothing else from the URL is passed on: not your search, prices or other
filters.

## No network

The extension makes no network requests of its own: no backend, no third-party
service, no remote code, no tracking, telemetry or analytics. All brand and
material data is bundled in the extension.

The only navigations are ones you trigger:

- applying or resetting filters reloads the current Vinted tab;
- the **Suggest a brand** link opens the suggestion page on the project site
  (`https://ecochineur.chaurel.ch/suggest.html`) in a new tab. That page embeds
  a form hosted by [Tally](https://tally.so/help/privacy-policy) (Belgium), and
  Tally's privacy policy applies there. Nothing is sent until you submit the
  form, and the extension itself never contacts Tally.

## Permissions

| Permission  | Why                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| `storage`   | Save your preferences locally on your device.                                                           |
| `activeTab` | Read the active tab URL and update it, only after you open the popup. No access to other tabs or sites. |

## Contact

Questions: open an issue at
<https://github.com/thomas-chauvet/ecochineur/issues>.
