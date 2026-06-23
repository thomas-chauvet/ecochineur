export interface MergeInput {
  currentUrl: string;
  brandIdsToAdd: number[];
  materialIdsToAdd: number[];
}

const FILTER_PARAM_KEYS = new Set(['brand_ids[]', 'material_ids[]']);

export function mergeFilters(input: MergeInput): string {
  const url = new URL(input.currentUrl);
  const finalBrandIds = dedupe([
    ...url.searchParams.getAll('brand_ids[]'),
    ...input.brandIdsToAdd.map(String),
  ]);
  const finalMaterialIds = dedupe([
    ...url.searchParams.getAll('material_ids[]'),
    ...input.materialIdsToAdd.map(String),
  ]);

  return buildUrlWithFilters(url, finalBrandIds, finalMaterialIds);
}

export function resetFilters(currentUrl: string): string {
  const url = new URL(currentUrl);

  return buildUrlWithFilters(url, [], []);
}

function buildUrlWithFilters(
  sourceUrl: URL,
  brandIds: string[],
  materialIds: string[],
): string {
  const newUrl = new URL(sourceUrl.origin + sourceUrl.pathname);

  for (const [key, value] of sourceUrl.searchParams.entries()) {
    if (!FILTER_PARAM_KEYS.has(key)) {
      newUrl.searchParams.append(key, value);
    }
  }

  for (const id of brandIds) {
    newUrl.searchParams.append('brand_ids[]', id);
  }

  for (const id of materialIds) {
    newUrl.searchParams.append('material_ids[]', id);
  }

  return newUrl.toString();
}

function dedupe(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
