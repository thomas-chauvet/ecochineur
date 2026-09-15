import { describe, expect, it } from 'vitest';

import en from '../src/i18n/en.json';
import fr from '../src/i18n/fr.json';
import { createTranslator, resolveLanguage } from '../src/lib/i18n';

describe('resolveLanguage', () => {
  it.each([
    ['fr', 'fr'],
    ['fr-BE', 'fr'],
    ['en-GB', 'en'],
    ['de-DE', 'en'],
    [null, 'en'],
    [undefined, 'en'],
  ])('resolves %s to %s', (input, expected) => {
    expect(resolveLanguage(input)).toBe(expected);
  });
});

describe('dictionaries', () => {
  it('have the same keys in French and English', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(fr).sort());
  });

  it('have no empty message', () => {
    for (const message of [...Object.values(en), ...Object.values(fr)]) {
      expect(message.trim()).not.toBe('');
    }
  });

  it('translates a key', () => {
    expect(createTranslator('en')('apply_filters')).toBe('Apply filters');
    expect(createTranslator('fr')('apply_filters')).toBe(
      'Appliquer les filtres',
    );
  });
});
