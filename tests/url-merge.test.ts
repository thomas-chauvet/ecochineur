import { describe, expect, it } from 'vitest';

import { mergeFilters, resetFilters } from '../src/lib/url-merge';

const BASE = 'https://www.vinted.fr/catalog';

describe('mergeFilters', () => {
  it('case 1 - empty URL: adds plugin IDs', () => {
    const result = mergeFilters({
      currentUrl: `${BASE}?search_text=jeans`,
      brandIdsToAdd: [456, 789],
      materialIdsToAdd: [],
    });

    expect(result).toContain('search_text=jeans');
    expect(result).toContain('brand_ids%5B%5D=456');
    expect(result).toContain('brand_ids%5B%5D=789');
  });

  it('case 2 - preserves existing user filters', () => {
    const result = mergeFilters({
      currentUrl: `${BASE}?search_text=pull&price_to=30&status_ids[]=6&order=newest_first`,
      brandIdsToAdd: [456],
      materialIdsToAdd: [],
    });

    expect(result).toContain('price_to=30');
    expect(result).toContain('status_ids%5B%5D=6');
    expect(result).toContain('order=newest_first');
    expect(result).toContain('search_text=pull');
    expect(result).toContain('brand_ids%5B%5D=456');
  });

  it('case 3 - preserves existing brand_ids', () => {
    const result = mergeFilters({
      currentUrl: `${BASE}?brand_ids[]=123`,
      brandIdsToAdd: [456],
      materialIdsToAdd: [],
    });
    const url = new URL(result);
    const brandIds = url.searchParams.getAll('brand_ids[]');

    expect(brandIds).toContain('123');
    expect(brandIds).toContain('456');
    expect(brandIds).toHaveLength(2);
  });

  it('case 4 - deduplicates an ID already present', () => {
    const result = mergeFilters({
      currentUrl: `${BASE}?brand_ids[]=456`,
      brandIdsToAdd: [456, 789],
      materialIdsToAdd: [],
    });
    const url = new URL(result);

    expect(url.searchParams.getAll('brand_ids[]')).toEqual(['456', '789']);
  });

  it('case 5 - preserves existing material_ids', () => {
    const result = mergeFilters({
      currentUrl: `${BASE}?material_ids[]=146`,
      brandIdsToAdd: [],
      materialIdsToAdd: [147],
    });
    const url = new URL(result);
    const materialIds = url.searchParams.getAll('material_ids[]');

    expect(materialIds).toContain('146');
    expect(materialIds).toContain('147');
    expect(materialIds).toHaveLength(2);
  });

  it('case 6 - handles brands and materials together', () => {
    const result = mergeFilters({
      currentUrl: `${BASE}?search_text=robe`,
      brandIdsToAdd: [456],
      materialIdsToAdd: [146],
    });

    expect(result).toContain('brand_ids%5B%5D=456');
    expect(result).toContain('material_ids%5B%5D=146');
    expect(result).toContain('search_text=robe');
  });

  it('case 7 - handles existing filters, new filters, dedupe, and other params', () => {
    const result = mergeFilters({
      currentUrl: `${BASE}?search_text=manteau&brand_ids[]=123&brand_ids[]=456&material_ids[]=146&price_to=50`,
      brandIdsToAdd: [456, 999],
      materialIdsToAdd: [146, 200],
    });
    const url = new URL(result);

    expect(url.searchParams.getAll('brand_ids[]')).toEqual([
      '123',
      '456',
      '999',
    ]);
    expect(url.searchParams.getAll('material_ids[]')).toEqual(['146', '200']);
    expect(url.searchParams.get('search_text')).toBe('manteau');
    expect(url.searchParams.get('price_to')).toBe('50');
  });

  it('case 8 - no IDs to add keeps the URL functionally unchanged', () => {
    const result = mergeFilters({
      currentUrl: `${BASE}?search_text=sac`,
      brandIdsToAdd: [],
      materialIdsToAdd: [],
    });

    expect(result).toContain('search_text=sac');
  });

  it('case 9 - preserves special characters in search_text', () => {
    const result = mergeFilters({
      currentUrl: `${BASE}?search_text=robe%20%C3%A9t%C3%A9`,
      brandIdsToAdd: [456],
      materialIdsToAdd: [],
    });
    const url = new URL(result);

    expect(url.searchParams.get('search_text')).toBe('robe \u00e9t\u00e9');
  });
});

describe('resetFilters', () => {
  it('case 10 - removes all brand_ids and material_ids while keeping the rest', () => {
    const result = resetFilters(
      `${BASE}?search_text=jean&brand_ids[]=123&brand_ids[]=456&material_ids[]=146&order=relevance`,
    );
    const url = new URL(result);

    expect(url.searchParams.getAll('brand_ids[]')).toHaveLength(0);
    expect(url.searchParams.getAll('material_ids[]')).toHaveLength(0);
    expect(url.searchParams.get('search_text')).toBe('jean');
    expect(url.searchParams.get('order')).toBe('relevance');
  });
});
