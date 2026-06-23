import { defineManifest } from '@crxjs/vite-plugin';

import { vintedHostPermissions } from './src/lib/vinted-domains';

// manifest.config.ts runs in Node, not in the browser bundle. We declare
// process locally so this file stays type-safe without adding @types/node to
// the project-wide types (which would expose Node globals to browser code).
declare const process: { env: Record<string, string | undefined> };

// npm_package_version is set automatically by npm when running any npm script.
// In CI it is overridden via `npm version <tag> --no-git-tag-version` before
// the build, so no manual version editing is needed.
const versionName = process.env.npm_package_version ?? '0.0.0';
// Chrome only accepts numeric dot-separated version strings; strip pre-release.
const version = versionName.replace(/-.*$/, '');

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
