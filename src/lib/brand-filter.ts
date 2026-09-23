import { BRAND_CATEGORIES, type Brand, type BrandCategory } from '../types';

/**
 * Two categories are cumulative, each subsuming a stricter subset:
 * `france` also matches `france-ofg`, and `eco` also matches any brand with
 * `eco: true` whatever its origin. The rest match on `brand.category` alone.
 */
export function brandMatches(brand: Brand, category: BrandCategory): boolean {
  if (category === 'eco') {
    return brand.category === 'eco' || brand.eco;
  }

  if (category === 'france') {
    return brand.category === 'france' || brand.category === 'france-ofg';
  }

  return brand.category === category;
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
