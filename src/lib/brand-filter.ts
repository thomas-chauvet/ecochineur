import { BRAND_CATEGORIES, type Brand, type BrandCategory } from '../types';

/**
 * Origin categories (`france`, `europe`, `mixed`) match on `brand.category`.
 * `eco` is cumulative: it matches `category: 'eco'` and any brand with
 * `eco: true`, whatever its origin.
 */
export function brandMatches(brand: Brand, category: BrandCategory): boolean {
  return category === 'eco'
    ? brand.category === 'eco' || brand.eco
    : brand.category === category;
}

export function getMatchingBrands(
  brands: Brand[],
  selected: BrandCategory[],
): Brand[] {
  return brands.filter((brand) =>
    selected.some((category) => brandMatches(brand, category)),
  );
}

export function getMatchingBrandIds(
  brands: Brand[],
  selected: BrandCategory[],
): number[] {
  return [
    ...new Set(
      getMatchingBrands(brands, selected).map((brand) => brand.vinted_id),
    ),
  ];
}

export function countByCategory(
  brands: Brand[],
): Record<BrandCategory, number> {
  return Object.fromEntries(
    BRAND_CATEGORIES.map((category) => [
      category,
      brands.filter((brand) => brandMatches(brand, category)).length,
    ]),
  ) as Record<BrandCategory, number>;
}
