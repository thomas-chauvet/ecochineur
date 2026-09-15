import { defineManifest } from '@crxjs/vite-plugin';

import { resolveVersion } from './version.ts';

// The version is derived from the git tag (via `git describe`) so the tag is
// the single source of truth for every build path — local and CI alike. No
// manual edits to package.json or this file are needed; just push a tag.
const { version, versionName } = resolveVersion();

export default defineManifest({
  manifest_version: 3,
  name: 'EcoChineur',
  version,
  version_name: versionName,
  description:
    'Filter Vinted searches by ethical brands and natural materials. No data collection, no tracking.',
  // activeTab exposes the current tab URL only after the user opens the popup,
  // so no host permissions (and no install-time warning) are required.
  permissions: ['storage', 'activeTab'],
  action: {
    default_popup: 'src/popup/popup.html',
    default_icon: {
      16: 'icons/icon-16.png',
      48: 'icons/icon-48.png',
      128: 'icons/icon-128.png',
    },
  },
  icons: {
    16: 'icons/icon-16.png',
    48: 'icons/icon-48.png',
    128: 'icons/icon-128.png',
  },
});
