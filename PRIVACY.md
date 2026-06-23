# Privacy Policy

EcoChineur is private by design.

## No Collection

The extension collects no personal data, no browsing data, no history, no Vinted
searches, no filters, no identifiers, and no usage statistics.

## No Data Use

EcoChineur does not use user data for analytics, profiling, advertising,
audience measurement, model training, resale, sharing, or any external
processing.

The only information stored is the set of preferences explicitly chosen in the
popup:

- selected brand categories;
- selected materials;
- preferred language.

These preferences are stored locally in `chrome.storage.local` on the user's
device. They do not leave the device.

## Local Operation

When the user clicks "Apply filters", EcoChineur reads the active tab URL only
to verify that the page is `www.vinted.fr/catalog` and to locally build a new
URL that preserves existing filters and adds the selected filters.

The extension does not store this URL, send it anywhere, or keep any history.

## No External Network

EcoChineur makes no extension-owned network calls, has no backend, uses no
third-party service, and includes no tracking, telemetry, or analytics.

The only network navigation is the one triggered by Chrome when the user applies
filters and the active tab navigates to the modified Vinted URL.

## Permissions

- `storage`: store preferences locally on the device.
- `tabs`: read the active tab URL and navigate to the modified Vinted URL after
  user action.
- `https://www.vinted.fr/*`: limit extension behavior to Vinted France pages.
