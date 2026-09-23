import { describe, expect, it } from 'vitest';

import { brands, materials } from '../src/data';
import {
  BRAND_CATEGORIES,
  CERTIFICATIONS,
  OFG_CERTIFICATION,
} from '../src/types';

function duplicates(values: Array<string | number>): Array<string | number> {
  return values.filter((value, index) => values.indexOf(value) !== index);
}

describe('brands.json', () => {
  it.each(brands.map((brand) => [brand.id, brand] as const))(
    '%s is a complete, valid entry',
    (_, brand) => {
      expect(brand.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(brand.name.trim()).not.toBe('');
      expect(Number.isInteger(brand.vinted_id)).toBe(true);
      expect(brand.vinted_id).toBeGreaterThan(0);
      expect(BRAND_CATEGORIES).toContain(brand.category);
      expect(typeof brand.eco).toBe('boolean');
      expect(Array.isArray(brand.certifications)).toBe(true);
      brand.certifications.forEach((certification) => {
        expect(CERTIFICATIONS).toContain(certification);
      });
      expect(brand.description_fr.trim()).not.toBe('');
      expect(brand.description_en.trim()).not.toBe('');
      expect(brand.website).toMatch(/^https:\/\//);
    },
  );

  it('has unique ids and Vinted IDs', () => {
    expect(duplicates(brands.map((brand) => brand.id))).toEqual([]);
    expect(duplicates(brands.map((brand) => brand.vinted_id))).toEqual([]);
  });

  // The category and the label are two records of the same fact, so they can
  // drift apart. Tie them together rather than trusting the maintainer.
  it('marks a brand france-ofg exactly when it holds the OFG label', () => {
    const byCategory = brands
      .filter((brand) => brand.category === 'france-ofg')
      .map((brand) => brand.id);
    const byCertification = brands
      .filter((brand) => brand.certifications.includes(OFG_CERTIFICATION))
      .map((brand) => brand.id);

    expect(byCategory).toEqual(byCertification);
  });
});

describe('material-ids.json', () => {
  it.each(materials.map((material) => [material.id, material] as const))(
    '%s is a complete, valid entry',
    (_, material) => {
      expect(material.name_fr.trim()).not.toBe('');
      expect(material.name_en.trim()).not.toBe('');
      expect(Number.isInteger(material.vinted_id)).toBe(true);
      expect(material.vinted_id).toBeGreaterThan(0);
    },
  );

  it('has unique ids and Vinted IDs', () => {
    expect(duplicates(materials.map((material) => material.id))).toEqual([]);
    expect(duplicates(materials.map((material) => material.vinted_id))).toEqual(
      [],
    );
  });
});
