import { describe, expect, it } from 'vitest';

import {
  countByCategory,
  getMatchingBrandIds,
  getMatchingBrands,
} from '../src/lib/brand-filter';
import type { Brand } from '../src/types';

const mock: Brand[] = [
  {
    id: '1083',
    name: '1083',
    vinted_id: 1,
    category: 'france',
    eco: true,
    certifications: [],
    description_fr: '',
    description_en: '',
    website: '',
  },
  {
    id: 'faguo',
    name: 'Faguo',
    vinted_id: 2,
    category: 'france',
    eco: false,
    certifications: [],
    description_fr: '',
    description_en: '',
    website: '',
  },
  {
    id: 'armed',
    name: 'Armedangels',
    vinted_id: 3,
    category: 'europe',
    eco: true,
    certifications: [],
    description_fr: '',
    description_en: '',
    website: '',
  },
  {
    id: 'pata',
    name: 'Patagonia',
    vinted_id: 4,
    category: 'mixed',
    eco: true,
    certifications: [],
    description_fr: '',
    description_en: '',
    website: '',
  },
  {
    id: 'people',
    name: 'People Tree',
    vinted_id: 5,
    category: 'eco',
    eco: true,
    certifications: [],
    description_fr: '',
    description_en: '',
    website: '',
  },
];

describe('getMatchingBrandIds', () => {
  it('filters France brands', () => {
    expect(getMatchingBrandIds(mock, ['france']).sort()).toEqual([1, 2]);
  });

  it('filters eco brands from eco:true or category:eco', () => {
    expect(getMatchingBrandIds(mock, ['eco']).sort()).toEqual([1, 3, 4, 5]);
  });

  it('combines france and eco selections as a deduped union', () => {
    expect(getMatchingBrandIds(mock, ['france', 'eco']).sort()).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  it('ignores brands with vinted_id = 0', () => {
    const withZero: Brand[] = [{ ...mock[0], vinted_id: 0 }];

    expect(getMatchingBrandIds(withZero, ['france'])).toEqual([]);
  });
});

describe('getMatchingBrands', () => {
  it('returns matching brands for display', () => {
    expect(
      getMatchingBrands(mock, ['france']).map((brand) => brand.id),
    ).toEqual(['1083', 'faguo']);
  });
});

describe('countByCategory', () => {
  it('counts categories and includes category:eco plus eco:true in eco', () => {
    const counts = countByCategory(mock);

    expect(counts.france).toBe(2);
    expect(counts.europe).toBe(1);
    expect(counts.mixed).toBe(1);
    expect(counts.eco).toBe(4);
  });
});
