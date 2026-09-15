import { describe, expect, it } from 'vitest';

import { isVintedCatalogUrl } from '../src/lib/vinted-domains';

describe('isVintedCatalogUrl', () => {
  it.each([
    'https://www.vinted.fr/catalog',
    'https://www.vinted.fr/catalog?search_text=jeans',
    'https://www.vinted.de/catalog/2050-kleidung',
    'https://www.vinted.co.uk/catalog?brand_ids[]=603',
  ])('accepts %s', (url) => {
    expect(isVintedCatalogUrl(url)).toBe(true);
  });

  it.each([
    undefined,
    '',
    'not a url',
    'chrome://extensions',
    'https://www.vinted.fr/',
    'https://www.vinted.fr/items/123-veja',
    'https://www.vinted.fr/catalogue',
    'http://www.vinted.fr/catalog',
    'https://vinted.fr.evil.example/catalog',
    'https://www.vinted.example/catalog',
  ])('rejects %s', (url) => {
    expect(isVintedCatalogUrl(url)).toBe(false);
  });
});
