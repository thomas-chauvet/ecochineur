set dotenv-load := false

default:
    @just --list

install:
    npm install

dev:
    npm run dev

dev-host:
    npm run dev -- --host 127.0.0.1

test:
    npm test

lint:
    npm run lint

typecheck:
    npm run typecheck

format:
    npm run format

format-check:
    npm run format:check

build:
    npm run build

audit:
    npm audit

check:
    npm run format:check
    npm run lint
    npm run typecheck
    npm test
    npm run build

pre-commit:
    npm run lint-staged
    npm run lint
    npm run typecheck
    npm test

release-check:
    npm run release:check
    npm audit

package:
    #!/usr/bin/env bash
    set -euo pipefail
    npm run release:check
    version=$(git describe --tags --always | sed 's/^v//')
    mkdir -p release
    cd dist && zip -r "../release/ecochineur-v${version}.zip" .

changelog:
    npx git-cliff -o CHANGELOG.md

serve-docs:
    python3 -m http.server 4174 --bind 127.0.0.1 --directory docs
