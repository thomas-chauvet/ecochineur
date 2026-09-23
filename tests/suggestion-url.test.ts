import { describe, expect, it } from 'vitest';

import {
  buildSuggestionUrl,
  MAX_PREFILLED_IDS,
  SUGGEST_PAGE,
} from '../src/lib/suggestion-url';

const BASE = 'https://www.vinted.fr/catalog';
const known = new Set([2391, 35227]);

function params(url: string): Record<string, string> {
  return Object.fromEntries(new URL(url).searchParams);
}

describe('buildSuggestionUrl', () => {
  it('opens the page in the UI language', () => {
    expect(buildSuggestionUrl({ language: 'fr', knownBrandIds: known })).toBe(
      SUGGEST_PAGE.fr,
    );
    expect(buildSuggestionUrl({ language: 'en', knownBrandIds: known })).toBe(
      SUGGEST_PAGE.en,
    );
  });

  it('adds no query when the catalog filters no brand', () => {
    expect(
      buildSuggestionUrl({
        language: 'fr',
        catalogUrl: `${BASE}?search_text=pull`,
        knownBrandIds: known,
      }),
    ).toBe(SUGGEST_PAGE.fr);
  });

  it('adds no query when every filtered brand is already listed', () => {
    expect(
      buildSuggestionUrl({
        language: 'fr',
        catalogUrl: `${BASE}?brand_ids[]=2391&brand_ids[]=35227`,
        knownBrandIds: known,
      }),
    ).toBe(SUGGEST_PAGE.fr);
  });

  it('prefills unknown brand IDs and the Vinted host', () => {
    const url = buildSuggestionUrl({
      language: 'en',
      catalogUrl: `https://www.vinted.de/catalog/2050-kleidung?brand_ids[]=53&brand_ids[]=2391&brand_ids[]=777`,
      knownBrandIds: known,
    });

    expect(url.startsWith(`${SUGGEST_PAGE.en}?`)).toBe(true);
    expect(params(url)).toEqual({
      vinted_ids: '53,777',
      vinted_host: 'www.vinted.de',
    });
  });

  it('ignores duplicates, zero, negative and non-numeric values', () => {
    const url = buildSuggestionUrl({
      language: 'fr',
      catalogUrl: `${BASE}?brand_ids[]=53&brand_ids[]=53&brand_ids[]=0&brand_ids[]=-4&brand_ids[]=abc&brand_ids[]=1.5&brand_ids[]=`,
      knownBrandIds: known,
    });

    expect(params(url).vinted_ids).toBe('53');
  });

  it('accepts already-encoded filter keys', () => {
    const url = buildSuggestionUrl({
      language: 'fr',
      catalogUrl: `${BASE}?brand_ids%5B%5D=53`,
      knownBrandIds: known,
    });

    expect(params(url).vinted_ids).toBe('53');
  });

  it(`keeps at most ${MAX_PREFILLED_IDS} IDs`, () => {
    const ids = Array.from({ length: 8 }, (_, index) => 100 + index);
    const url = buildSuggestionUrl({
      language: 'fr',
      catalogUrl: `${BASE}?${ids.map((id) => `brand_ids[]=${id}`).join('&')}`,
      knownBrandIds: known,
    });

    expect(params(url).vinted_ids).toBe(
      ids.slice(0, MAX_PREFILLED_IDS).join(','),
    );
  });

  it('never forwards other filters from the catalog URL', () => {
    const url = buildSuggestionUrl({
      language: 'fr',
      catalogUrl: `${BASE}?search_text=pull&price_to=30&brand_ids[]=53`,
      knownBrandIds: known,
    });

    expect(Object.keys(params(url)).sort()).toEqual([
      'vinted_host',
      'vinted_ids',
    ]);
  });
});
