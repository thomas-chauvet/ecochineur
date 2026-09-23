import { describe, expect, it } from 'vitest';

import {
  countByCategory,
  getMatchingBrandIds,
  getMatchingBrands,
} from '../src/lib/brand-filter';
import type { Brand } from '../src/types';

function brand(
  id: string,
  vinted_id: number,
  category: Brand['category'],
  eco: boolean,
): Brand {
  return {
    id,
    name: id,
    vinted_id,
    category,
    eco,
    certifications: [],
    description_fr: '',
    description_en: '',
    website: '',
  };
}

const mock: Brand[] = [
  brand('1083', 1, 'france-ofg', true),
  brand('saint-james', 2, 'france', false),
  brand('armedangels', 3, 'europe', true),
  brand('loom', 4, 'france-europe', true),
  brand('people-tree', 5, 'eco', true),
  brand('ateliers-de-nimes', 6, 'france-europe', false),
];

describe('getMatchingBrandIds', () => {
  it('filters France brands and includes the stricter OFG subset', () => {
    expect(getMatchingBrandIds(mock, ['france'])).toEqual([1, 2]);
  });

  it('filters OFG brands without pulling in plain French brands', () => {
    expect(getMatchingBrandIds(mock, ['france-ofg'])).toEqual([1]);
  });

  it('filters eco brands from eco:true or category:eco', () => {
    expect(getMatchingBrandIds(mock, ['eco'])).toEqual([1, 3, 4, 5]);
  });

  it('combines france and eco selections as a deduped union', () => {
    expect(getMatchingBrandIds(mock, ['france', 'eco'])).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  it('does not match origin categories against category:eco brands', () => {
    expect(getMatchingBrandIds(mock, ['france-europe'])).toEqual([4, 6]);
  });

  it('returns nothing without a selection', () => {
    expect(getMatchingBrandIds(mock, [])).toEqual([]);
  });

  it('deduplicates brands sharing a Vinted ID', () => {
    const duplicated = [
      ...mock,
      brand('saint-james-alias', 2, 'france', false),
    ];

    expect(getMatchingBrandIds(duplicated, ['france'])).toEqual([1, 2]);
  });
});

describe('getMatchingBrands', () => {
  it('returns matching brands for display', () => {
    expect(getMatchingBrands(mock, ['france']).map((item) => item.id)).toEqual([
      '1083',
      'saint-james',
    ]);
  });
});

describe('countByCategory', () => {
  it('counts categories and includes category:eco plus eco:true in eco', () => {
    expect(countByCategory(mock)).toEqual({
      france: 2,
      'france-ofg': 1,
      europe: 1,
      'france-europe': 2,
      eco: 4,
    });
  });
});
