import { defineManifest } from '@crxjs/vite-plugin';

import { vintedHostPermissions } from './src/lib/vinted-domains';
import { resolveVersion } from './version';

// The version is derived from the git tag (via `git describe`) so the tag is
// the single source of truth for every build path — local and CI alike. No
// manual edits to package.json or this file are needed; just push a tag.
const { version, versionName } = resolveVersion();

export default defineManifest({
  manifest_version: 3,
  name: 'EcoChineur Dev',
  short_name: 'EcoChineur',
  version,
  version_name: versionName,
  description:
    'Private dev build: filter Vinted without data collection or data use.',
  permissions: ['storage', 'activeTab'],
  host_permissions: vintedHostPermissions(),
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
