// End-to-end smoke test of the production build (dist/) in Playwright's
// Chromium. Run with `just e2e` (or `npm run test:e2e`, which builds first).
//
// It drives Chromium over a raw DevTools pipe instead of the Playwright API:
// the toolbar click is simulated with Extensions.triggerAction, a browser-level
// command that only exists with --remote-debugging-pipe and
// --enable-unsafe-extension-debugging. That click is what grants `activeTab`,
// so this test exercises the real permission model, not a mock.
//
// Vinted responses are stubbed: the extension only reads and rewrites the tab
// URL, so the test never contacts Vinted.

import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import type { Readable, Writable } from 'node:stream';
import { chromium } from 'playwright';

const ROOT = resolve(import.meta.dirname, '../..');
const START_URL =
  'https://www.vinted.fr/catalog?search_text=pull&price_to=30&brand_ids[]=53';
const DE_URL = 'https://www.vinted.de/catalog/2050-kleidung?search_text=wolle';
const ITEM_URL = 'https://www.vinted.fr/items/123-pull';

interface BrandEntry {
  vinted_id: number;
  category: string;
  eco: boolean;
}
interface MaterialEntry {
  id: string;
  vinted_id: number;
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(join(ROOT, path), 'utf8')) as T;
}

const brands = readJson<{ brands: BrandEntry[] }>(
  'src/data/brands.json',
).brands;
const materials = readJson<{ natural_materials: MaterialEntry[] }>(
  'src/data/material-ids.json',
).natural_materials;
const en = readJson<Record<string, string>>('src/i18n/en.json');
const fr = readJson<Record<string, string>>('src/i18n/fr.json');
const manifest = readJson<{
  permissions?: string[];
  host_permissions?: string[];
}>('dist/manifest.json');

// This file runs under plain `node`, so it reads the JSON rather than importing
// src/. That means the matching rules below mirror `src/lib/brand-filter.ts`
// and the order mirrors `BRAND_CATEGORIES`: keep all three in step.
const CATEGORIES = [
  'france',
  'france-ofg',
  'europe',
  'france-europe',
  'eco',
] as const;

function matches(brand: BrandEntry, category: string): boolean {
  if (category === 'eco') return brand.category === 'eco' || brand.eco;
  if (category === 'france')
    return brand.category === 'france' || brand.category === 'france-ofg';
  return brand.category === category;
}

const frenchBrandIds = brands
  .filter((brand) => matches(brand, 'france'))
  .map((brand) => String(brand.vinted_id));
const expectedCounts = CATEGORIES.map(
  (category) =>
    `(${brands.filter((brand) => matches(brand, category)).length})`,
);
const materialIndex = (id: string) =>
  materials.findIndex((material) => material.id === id);

// Reporting

const results: boolean[] = [];

function check(name: string, ok: boolean, detail = ''): void {
  results.push(ok);
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`,
  );
}

const sleep = (ms: number) =>
  new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

async function waitFor(
  condition: () => Promise<boolean>,
  timeout = 10_000,
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await condition().catch(() => false)) {
      return true;
    }
    await sleep(150);
  }
  return false;
}

const decoded = (url: string) => decodeURIComponent(url);

// Minimal DevTools protocol client over the pipe (null-terminated JSON).

type Params = Record<string, unknown>;

interface Message {
  id?: number;
  method?: string;
  params?: Params;
  result?: unknown;
  error?: { message: string };
  sessionId?: string;
}

interface TargetInfo {
  targetId: string;
  type: string;
  url: string;
}

interface Page {
  targetId: string;
  sessionId: string;
}

function connect(writer: Writable, reader: Readable) {
  let nextId = 1;
  let buffer = Buffer.alloc(0);
  const pending = new Map<
    number,
    { resolve: (value: unknown) => void; reject: (error: Error) => void }
  >();
  const listeners = new Set<(message: Message) => void>();

  reader.on('data', (chunk: Buffer) => {
    buffer = Buffer.concat([buffer, chunk]);
    for (let end = buffer.indexOf(0); end !== -1; end = buffer.indexOf(0)) {
      const message = JSON.parse(
        buffer.subarray(0, end).toString('utf8'),
      ) as Message;
      buffer = buffer.subarray(end + 1);
      const request =
        message.id === undefined ? undefined : pending.get(message.id);
      if (request && message.id !== undefined) {
        pending.delete(message.id);
        if (message.error) {
          request.reject(new Error(message.error.message));
        } else {
          request.resolve(message.result);
        }
      } else if (message.method) {
        listeners.forEach((listener) => listener(message));
      }
    }
  });

  return {
    send<T = Params>(
      method: string,
      params: Params = {},
      sessionId?: string,
    ): Promise<T> {
      const id = nextId++;
      return new Promise<T>((resolveSend, reject) => {
        pending.set(id, {
          resolve: (value) => resolveSend(value as T),
          reject,
        });
        writer.write(`${JSON.stringify({ id, method, params, sessionId })}\0`);
      });
    },
    on(listener: (message: Message) => void): void {
      listeners.add(listener);
    },
  };
}

type Cdp = ReturnType<typeof connect>;

async function run(cdp: Cdp): Promise<void> {
  const attach = async (targetId: string): Promise<Page> => {
    const { sessionId } = await cdp.send<{ sessionId: string }>(
      'Target.attachToTarget',
      { targetId, flatten: true },
    );
    await cdp.send('Runtime.enable', {}, sessionId);
    return { targetId, sessionId };
  };

  const evaluate = async <T>(page: Page, expression: string): Promise<T> => {
    const { result, exceptionDetails } = await cdp.send<{
      result: { value: T };
      exceptionDetails?: { text: string; exception?: { description?: string } };
    }>(
      'Runtime.evaluate',
      { expression, awaitPromise: true, returnByValue: true },
      page.sessionId,
    );
    if (exceptionDetails) {
      throw new Error(
        exceptionDetails.exception?.description ?? exceptionDetails.text,
      );
    }
    return result.value;
  };

  const targets = async (filter?: Params[]): Promise<TargetInfo[]> =>
    (
      await cdp.send<{ targetInfos: TargetInfo[] }>(
        'Target.getTargets',
        filter ? { filter } : {},
      )
    ).targetInfos;

  // Stub every Vinted response with an empty page.
  const stubBody = Buffer.from(
    '<!doctype html><title>Vinted stub</title>',
  ).toString('base64');
  cdp.on((message) => {
    if (message.method === 'Fetch.requestPaused' && message.sessionId) {
      const { requestId } = message.params as { requestId: string };
      void cdp.send(
        'Fetch.fulfillRequest',
        {
          requestId,
          responseCode: 200,
          responseHeaders: [{ name: 'Content-Type', value: 'text/html' }],
          body: stubBody,
        },
        message.sessionId,
      );
    }
  });

  // 1. Manifest and extension loading.
  check(
    'manifest requests only storage + activeTab, no host permissions',
    JSON.stringify(manifest.permissions) ===
      JSON.stringify(['storage', 'activeTab']) &&
      manifest.host_permissions === undefined,
    JSON.stringify(manifest.permissions),
  );

  await cdp.send('Browser.getVersion');
  const { id: extensionId } = await cdp.send<{ id: string }>(
    'Extensions.loadUnpacked',
    { path: join(ROOT, 'dist') },
  );
  check('extension loads', /^[a-p]{32}$/.test(extensionId), extensionId);
  const popupUrl = `chrome-extension://${extensionId}/src/popup/popup.html`;

  // 2. Vinted tab (stubbed).
  const { targetId: vintedTargetId } = await cdp.send<{ targetId: string }>(
    'Target.createTarget',
    { url: 'about:blank' },
  );
  const vinted = await attach(vintedTargetId);

  const vintedUrl = async (): Promise<string> =>
    (
      await cdp.send<{ targetInfo: TargetInfo }>('Target.getTargetInfo', {
        targetId: vinted.targetId,
      })
    ).targetInfo.url;

  const navigate = async (url: string): Promise<void> => {
    await cdp.send(
      'Fetch.enable',
      { patterns: [{ urlPattern: 'https://www.vinted.*' }] },
      vinted.sessionId,
    );
    await cdp.send('Page.navigate', { url }, vinted.sessionId);
    if (
      !(await waitFor(async () => decoded(await vintedUrl()) === decoded(url)))
    ) {
      throw new Error(`Navigation to ${url} did not complete`);
    }
  };

  // 3. Simulated toolbar click → the real action popup.
  let popup: Page | null = null;

  const openPopup = async (): Promise<Page> => {
    if (popup) {
      await cdp
        .send('Target.closeTarget', { targetId: popup.targetId })
        .catch(() => undefined);
      popup = null;
    }
    const existing = new Set(
      (await targets()).map((target) => target.targetId),
    );
    await cdp.send('Target.activateTarget', { targetId: vinted.targetId });
    const url = decoded(await vintedUrl());
    const tab = (await targets([{ type: 'tab' }])).find(
      (target) => decoded(target.url) === url,
    );
    if (!tab) {
      throw new Error('Vinted tab target not found');
    }
    await cdp.send('Extensions.triggerAction', {
      id: extensionId,
      targetId: tab.targetId,
    });

    let opened: TargetInfo | undefined;
    await waitFor(async () => {
      opened = (await targets()).find(
        (target) => target.url === popupUrl && !existing.has(target.targetId),
      );
      return opened !== undefined;
    });
    if (!opened) {
      throw new Error('The action popup did not open');
    }
    const page = await attach(opened.targetId);
    await waitFor(() =>
      evaluate<boolean>(
        page,
        `document.querySelectorAll('#category-options input').length === 4`,
      ),
    );
    popup = page;
    return page;
  };

  const checkedCount = (page: Page) =>
    evaluate<number>(
      page,
      `[...document.querySelectorAll('#category-options input, #material-options input')].filter((input) => input.checked).length`,
    );
  const tick = (page: Page, selector: string, index: number) =>
    evaluate(
      page,
      `document.querySelectorAll('${selector}')[${index}].click()`,
    );
  const tickMaterial = (page: Page, id: string) =>
    tick(page, '#material-options input', materialIndex(id));
  const click = (page: Page, elementId: string) =>
    evaluate(page, `document.getElementById('${elementId}').click()`);

  await navigate(START_URL);

  // 4. Without a click, the extension cannot read the Vinted URL.
  const { targetId: extensionTabId } = await cdp.send<{ targetId: string }>(
    'Target.createTarget',
    { url: popupUrl },
  );
  const extensionTab = await attach(extensionTabId);
  await waitFor(() =>
    evaluate<boolean>(extensionTab, `document.readyState === 'complete'`),
  );
  await cdp.send('Target.activateTarget', { targetId: vinted.targetId });
  const hiddenUrl = await evaluate<string | null>(
    extensionTab,
    `chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => tab.url ?? null)`,
  );
  check(
    'before the toolbar click, the Vinted URL is hidden from the extension',
    hiddenUrl === null,
    String(hiddenUrl),
  );
  await cdp.send('Target.closeTarget', { targetId: extensionTabId });

  // 5. After the click, activeTab exposes it to the popup.
  let page = await openPopup();
  const visibleUrl = await evaluate<string | null>(
    page,
    `chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => tab.url ?? null)`,
  );
  check(
    'after the toolbar click, activeTab exposes the Vinted URL',
    visibleUrl !== null && decoded(visibleUrl) === decoded(START_URL),
    String(visibleUrl),
  );
  check(
    'Apply is disabled with nothing selected',
    await evaluate<boolean>(
      page,
      `document.getElementById('apply-button').disabled`,
    ),
  );
  const counts = await evaluate<string[]>(
    page,
    `[...document.querySelectorAll('#category-options .counter')].map((counter) => counter.textContent)`,
  );
  check(
    'category counts match brands.json',
    JSON.stringify(counts) === JSON.stringify(expectedCounts),
    counts.join(' '),
  );

  // 6. Apply French brands + linen.
  await tick(page, '#category-options input', 0);
  await tickMaterial(page, 'linen');
  await click(page, 'apply-button');
  await waitFor(async () => (await vintedUrl()).includes('material_ids'));
  const applied = new URL(await vintedUrl());
  check(
    'Apply adds the French brand IDs and linen',
    frenchBrandIds.every((id) =>
      applied.searchParams.getAll('brand_ids[]').includes(id),
    ) && applied.searchParams.getAll('material_ids[]').includes('146'),
    applied.search,
  );
  check(
    'Apply keeps search_text, price_to and the brand picked manually',
    applied.searchParams.get('search_text') === 'pull' &&
      applied.searchParams.get('price_to') === '30' &&
      applied.searchParams.getAll('brand_ids[]').includes('53'),
  );
  const closedPopupId = page.targetId;
  check(
    'popup closes after Apply',
    await waitFor(async () =>
      (await targets()).every((target) => target.targetId !== closedPopupId),
    ),
  );
  popup = null;

  // 7. Reopen: selections persist. Reset.
  page = await openPopup();
  check(
    'selections persist when the popup reopens',
    (await checkedCount(page)) === 2,
  );
  await evaluate(page, `window.confirm = () => true`);
  await click(page, 'reset-button');
  await waitFor(async () => !(await vintedUrl()).includes('material_ids'));
  const reset = new URL(await vintedUrl());
  check(
    'Reset removes only brand_ids[] and material_ids[]',
    !reset.searchParams.has('brand_ids[]') &&
      !reset.searchParams.has('material_ids[]') &&
      reset.searchParams.get('search_text') === 'pull' &&
      reset.searchParams.get('price_to') === '30',
    reset.search,
  );
  check('Reset unchecks every option', (await checkedCount(page)) === 0);

  // 8. Another domain, with a category path.
  await navigate(DE_URL);
  page = await openPopup();
  await tickMaterial(page, 'wool');
  await click(page, 'apply-button');
  await waitFor(async () => (await vintedUrl()).includes('material_ids'));
  const german = new URL(await vintedUrl());
  check(
    'works on vinted.de with a category path',
    german.pathname === '/catalog/2050-kleidung' &&
      german.searchParams.get('search_text') === 'wolle' &&
      german.searchParams.getAll('material_ids[]').includes('46'),
    german.pathname + german.search,
  );
  popup = null;

  // 9. Outside a catalog page.
  await navigate(ITEM_URL);
  page = await openPopup();
  await tickMaterial(page, 'cotton');
  await click(page, 'apply-button');
  await sleep(500);
  const status = await evaluate<string>(
    page,
    `document.getElementById('status-message').textContent`,
  );
  check(
    'outside a catalog page, Apply shows an error and leaves the URL alone',
    [en.error_not_on_catalog, fr.error_not_on_catalog].includes(status) &&
      decoded(await vintedUrl()) === decoded(ITEM_URL),
    status,
  );

  // 10. Language switch.
  const switchLanguage = (language: string) =>
    evaluate<string>(
      page,
      `(() => {
        const select = document.getElementById('language-select');
        select.value = '${language}';
        select.dispatchEvent(new Event('change'));
        return document.getElementById('brand-section-title').textContent;
      })()`,
    );
  const frenchTitle = await switchLanguage('fr');
  const englishTitle = await switchLanguage('en');
  check(
    'language switch translates the popup',
    frenchTitle === fr.brand_section && englishTitle === en.brand_section,
    `${frenchTitle} / ${englishTitle}`,
  );

  // 11. Brand search.
  const searchResults = await evaluate<string[]>(
    page,
    `(() => {
      document.getElementById('toggle-brands').click();
      const search = document.getElementById('brand-search');
      search.value = 'veja';
      search.dispatchEvent(new Event('input'));
      return [...document.querySelectorAll('#brand-list .brand-name')].map((name) => name.textContent);
    })()`,
  );
  check(
    'brand search finds Veja',
    JSON.stringify(searchResults) === JSON.stringify(['Veja']),
    searchResults.join(', '),
  );

  // 12. Suggest link and network.
  const link = await evaluate<{ href: string; target: string }>(
    page,
    `(({ href, target }) => ({ href, target }))(document.querySelector('footer a'))`,
  );
  check(
    '"Suggest a brand" opens the GitHub issue form in a new tab',
    link.href.startsWith(
      'https://github.com/thomas-chauvet/ecochineur/issues/new?template=brand-suggestion.yml',
    ) && link.target === '_blank',
    link.href,
  );
  const remoteResources = await evaluate<string[]>(
    page,
    `performance.getEntriesByType('resource').map((entry) => entry.name).filter((name) => !name.startsWith('chrome-extension://'))`,
  );
  check(
    'popup loads nothing from the network',
    remoteResources.length === 0,
    remoteResources.join(', '),
  );
}

async function main(): Promise<void> {
  const userDataDir = mkdtempSync(join(tmpdir(), 'ecochineur-e2e-'));
  const browser = spawn(
    chromium.executablePath(),
    [
      '--headless=new',
      '--remote-debugging-pipe',
      '--enable-unsafe-extension-debugging',
      '--no-first-run',
      '--no-default-browser-check',
      ...(process.platform === 'linux' ? ['--no-sandbox'] : []),
      `--user-data-dir=${userDataDir}`,
      'about:blank',
    ],
    // Chromium's stderr is ignored: on CI it is flooded with harmless D-Bus
    // errors. Results are reported through `check`.
    { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] },
  );
  const exited = new Promise((resolveExit) =>
    browser.once('exit', resolveExit),
  );
  const cdp = connect(
    browser.stdio[3] as Writable,
    browser.stdio[4] as Readable,
  );

  try {
    await run(cdp);
  } catch (error) {
    check(
      'unexpected error',
      false,
      error instanceof Error ? error.stack : String(error),
    );
  } finally {
    // Chromium keeps writing to its profile while shutting down: wait for the
    // process to exit before deleting it, and never fail the run on cleanup.
    browser.kill();
    await Promise.race([exited, sleep(5_000)]);
    try {
      rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5 });
    } catch (error) {
      console.warn(`Could not remove ${userDataDir}: ${String(error)}`);
    }
  }

  const passed = results.filter(Boolean).length;
  console.log(`\n${passed}/${results.length} checks passed`);
  process.exit(passed === results.length ? 0 : 1);
}

await main();
