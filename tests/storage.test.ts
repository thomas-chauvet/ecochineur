import { describe, expect, it } from 'vitest';

import { normalizePreferences } from '../src/lib/storage';

describe('normalizePreferences', () => {
  it('returns defaults when nothing is stored', () => {
    expect(normalizePreferences(undefined)).toEqual({
      selectedCategories: [],
      selectedMaterialIds: [],
      language: null,
    });
  });

  it('keeps valid values', () => {
    const preferences = {
      selectedCategories: ['france', 'eco'],
      selectedMaterialIds: [44, 146],
      language: 'en',
    };

    expect(normalizePreferences(preferences)).toEqual(preferences);
  });

  it('drops invalid, duplicate, and malformed values', () => {
    expect(
      normalizePreferences({
        selectedCategories: ['france', 'france', 'mixte', 42],
        selectedMaterialIds: [44, 44, 0, -1, 1.5, '46'],
        language: 'de',
      }),
    ).toEqual({
      selectedCategories: ['france'],
      selectedMaterialIds: [44],
      language: null,
    });
  });

  it('ignores non-array fields', () => {
    expect(
      normalizePreferences({ selectedCategories: 'france' }).selectedCategories,
    ).toEqual([]);
  });
});
