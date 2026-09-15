import { describe, expect, it } from 'vitest';

import { mergeFilters, resetFilters } from '../src/lib/url-merge';

const BASE = 'https://www.vinted.fr/catalog';

describe('mergeFilters', () => {
  it('adds plugin IDs to a URL without filters', () => {
    const result = mergeFilters({
      currentUrl: `${BASE}?search_text=jeans`,
      brandIdsToAdd: [456, 789],
      materialIdsToAdd: [],
    });

    expect(result).toContain('search_text=jeans');
    expect(result).toContain('brand_ids%5B%5D=456');
    expect(result).toContain('brand_ids%5B%5D=789');
  });

  it('preserves existing user filters', () => {
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

  it('preserves existing brand_ids', () => {
    const url = new URL(
      mergeFilters({
        currentUrl: `${BASE}?brand_ids[]=123`,
        brandIdsToAdd: [456],
        materialIdsToAdd: [],
      }),
    );

    expect(url.searchParams.getAll('brand_ids[]')).toEqual(['123', '456']);
  });

  it('deduplicates an ID already present', () => {
    const url = new URL(
      mergeFilters({
        currentUrl: `${BASE}?brand_ids[]=456`,
        brandIdsToAdd: [456, 789],
        materialIdsToAdd: [],
      }),
    );

    expect(url.searchParams.getAll('brand_ids[]')).toEqual(['456', '789']);
  });

  it('preserves existing material_ids', () => {
    const url = new URL(
      mergeFilters({
        currentUrl: `${BASE}?material_ids[]=146`,
        brandIdsToAdd: [],
        materialIdsToAdd: [147],
      }),
    );

    expect(url.searchParams.getAll('material_ids[]')).toEqual(['146', '147']);
  });

  it('handles existing filters, new filters, dedupe, and other params', () => {
    const url = new URL(
      mergeFilters({
        currentUrl: `${BASE}?search_text=manteau&brand_ids[]=123&brand_ids[]=456&material_ids[]=146&price_to=50`,
        brandIdsToAdd: [456, 999],
        materialIdsToAdd: [146, 200],
      }),
    );

    expect(url.searchParams.getAll('brand_ids[]')).toEqual([
      '123',
      '456',
      '999',
    ]);
    expect(url.searchParams.getAll('material_ids[]')).toEqual(['146', '200']);
    expect(url.searchParams.get('search_text')).toBe('manteau');
    expect(url.searchParams.get('price_to')).toBe('50');
  });

  it('accepts already-encoded filter keys', () => {
    const url = new URL(
      mergeFilters({
        currentUrl: `${BASE}?brand_ids%5B%5D=123`,
        brandIdsToAdd: [456],
        materialIdsToAdd: [],
      }),
    );

    expect(url.searchParams.getAll('brand_ids[]')).toEqual(['123', '456']);
  });

  it('keeps the URL functionally unchanged when there is nothing to add', () => {
    const url = new URL(
      mergeFilters({
        currentUrl: `${BASE}?search_text=sac`,
        brandIdsToAdd: [],
        materialIdsToAdd: [],
      }),
    );

    expect([...url.searchParams]).toEqual([['search_text', 'sac']]);
  });

  it('preserves special characters in search_text', () => {
    const url = new URL(
      mergeFilters({
        currentUrl: `${BASE}?search_text=robe%20%C3%A9t%C3%A9`,
        brandIdsToAdd: [456],
        materialIdsToAdd: [],
      }),
    );

    expect(url.searchParams.get('search_text')).toBe('robe été');
  });

  it('preserves the category path', () => {
    const result = mergeFilters({
      currentUrl: `${BASE}/2050-clothing?search_text=robe`,
      brandIdsToAdd: [456],
      materialIdsToAdd: [],
    });

    expect(new URL(result).pathname).toBe('/catalog/2050-clothing');
  });
});

describe('resetFilters', () => {
  it('removes all brand_ids and material_ids while keeping the rest', () => {
    const url = new URL(
      resetFilters(
        `${BASE}?search_text=jean&brand_ids[]=123&brand_ids[]=456&material_ids[]=146&order=relevance`,
      ),
    );

    expect(url.searchParams.getAll('brand_ids[]')).toHaveLength(0);
    expect(url.searchParams.getAll('material_ids[]')).toHaveLength(0);
    expect(url.searchParams.get('search_text')).toBe('jean');
    expect(url.searchParams.get('order')).toBe('relevance');
  });
});
