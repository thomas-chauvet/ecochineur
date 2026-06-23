// Resolves the extension version from the git tag so the tag is the single
// source of truth for both local and CI builds. This file runs in Node (during
// the Vite build / manifest generation), never in the browser bundle.

import { execSync } from 'node:child_process';

declare const process: { env: Record<string, string | undefined> };

export interface ResolvedVersion {
  /** Numeric dot-separated version Chrome accepts, e.g. `1.2.3`. */
  version: string;
  /** Full human-readable label, e.g. `1.2.3-rc.1`, shown in chrome://extensions. */
  versionName: string;
}

// Pure: parse a `git describe` string (or any version-ish string) into the
// Chrome `version` (numeric core) and the full `version_name` label.
//   v1.2.3          -> { version: '1.2.3', versionName: '1.2.3' }
//   v1.2.3-rc.1     -> { version: '1.2.3', versionName: '1.2.3-rc.1' }
//   v1.2.3-5-gabc12 -> { version: '1.2.3', versionName: '1.2.3-5-gabc12' }
export function parseDescribe(describe: string): ResolvedVersion {
  const versionName = describe.trim().replace(/^v/, '');
  // Chrome only accepts numeric dot-separated version strings; strip any
  // pre-release / git-describe suffix to get the numeric core.
  const version = versionName.replace(/-.*$/, '');
  return { version, versionName };
}

// Impure: derive the version from git, with safe fallbacks. Precedence:
// git tag (via `git describe`) -> npm_package_version -> '0.0.0'. The fallbacks
// keep dev builds working when there are no tags or no .git directory.
export function resolveVersion(): ResolvedVersion {
  try {
    const describe = execSync('git describe --tags --always', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    if (describe.trim()) {
      return parseDescribe(describe);
    }
  } catch {
    // git unavailable, no tags, or not a repo — fall through to env / default.
  }
  return parseDescribe(process.env.npm_package_version ?? '0.0.0');
}
