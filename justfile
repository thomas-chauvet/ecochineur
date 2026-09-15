set dotenv-load := false

default:
    @just --list

install:
    npm install

# Vite dev server (popup harness at /tests/manual/popup-harness.html)
dev:
    npm run dev

test:
    npm test

coverage:
    npm run test:coverage

# End-to-end smoke test of the built extension in Chromium (tests/e2e/)
e2e:
    npx playwright install chromium
    npm run test:e2e

lint:
    npm run lint

typecheck:
    npm run typecheck

format:
    npm run format

build:
    npm run build

# format check + lint + tests + typecheck + build
check:
    npm run check

audit:
    npm audit

# Zip dist/ into release/ for local testing of the packaged artifact
package: check
    #!/usr/bin/env bash
    set -euo pipefail
    version=$(git describe --tags --always | sed 's/^v//')
    mkdir -p release
    rm -f "release/ecochineur-v${version}.zip"
    cd dist && zip -qr "../release/ecochineur-v${version}.zip" .

# Tag and push a release from a clean main: `just release 0.1.0` or `just release 0.1.0-rc.1`
release version:
    #!/usr/bin/env bash
    set -euo pipefail
    [ "$(git branch --show-current)" = "main" ] || { echo "Release from main."; exit 1; }
    [ -z "$(git status --porcelain)" ] || { echo "Working tree is not clean."; exit 1; }
    git pull --ff-only
    npm run check
    git tag -a "v{{ version }}" -m "v{{ version }}"
    git push origin "v{{ version }}"

# Preview CHANGELOG.md locally (the release workflow regenerates it on every tag)
changelog:
    npx git-cliff -o CHANGELOG.md

serve-docs:
    python3 -m http.server 4174 --bind 127.0.0.1 --directory docs
