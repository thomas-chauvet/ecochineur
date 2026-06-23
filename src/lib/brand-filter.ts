import type { Brand, UISelection } from '../types';

export function getMatchingBrandIds(
  brands: Brand[],
  selected: UISelection[],
): number[] {
  const ids = brands
    .filter((brand) => matchesSelection(brand, selected))
    .map((brand) => brand.vinted_id)
    .filter((id) => id > 0);

  return [...new Set(ids)];
}

export function countByCategory(brands: Brand[]): Record<UISelection, number> {
  return {
    france: brands.filter((brand) => brand.category === 'france').length,
    europe: brands.filter((brand) => brand.category === 'europe').length,
    mixed: brands.filter((brand) => brand.category === 'mixed').length,
    eco: brands.filter((brand) => brand.category === 'eco' || brand.eco).length,
  };
}

export function getMatchingBrands(
  brands: Brand[],
  selected: UISelection[],
): Brand[] {
  return brands.filter((brand) => matchesSelection(brand, selected));
}

function matchesSelection(brand: Brand, selected: UISelection[]): boolean {
  const originCategories = selected.filter(
    (category): category is Exclude<UISelection, 'eco'> => category !== 'eco',
  );
  const ecoSelected = selected.includes('eco');
  const originMatch =
    brand.category !== 'eco' && originCategories.includes(brand.category);
  const ecoMatch =
    ecoSelected && (brand.category === 'eco' || brand.eco === true);

  return originMatch || ecoMatch;
}
