export interface MergeInput {
  currentUrl: string;
  brandIdsToAdd: number[];
  materialIdsToAdd: number[];
}

type FilterKey = 'brand_ids[]' | 'material_ids[]';

/** Adds IDs to the Vinted URL, keeping every filter already present. */
export function mergeFilters({
  currentUrl,
  brandIdsToAdd,
  materialIdsToAdd,
}: MergeInput): string {
  const url = new URL(currentUrl);

  return withFilters(url, {
    'brand_ids[]': [
      ...url.searchParams.getAll('brand_ids[]'),
      ...brandIdsToAdd.map(String),
    ],
    'material_ids[]': [
      ...url.searchParams.getAll('material_ids[]'),
      ...materialIdsToAdd.map(String),
    ],
  });
}

/** Removes brand and material filters only; other params are untouched. */
export function resetFilters(currentUrl: string): string {
  return withFilters(new URL(currentUrl), {
    'brand_ids[]': [],
    'material_ids[]': [],
  });
}

function withFilters(url: URL, filters: Record<FilterKey, string[]>): string {
  for (const [key, values] of Object.entries(filters)) {
    url.searchParams.delete(key);
    for (const value of new Set(values.filter(Boolean))) {
      url.searchParams.append(key, value);
    }
  }

  return url.toString();
}
