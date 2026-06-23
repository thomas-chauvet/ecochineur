import type { UISelection, UserPreferences } from '../types';

const STORAGE_KEY = 'ecochineur.preferences';

export const DEFAULT_PREFERENCES: UserPreferences = {
  selectedCategories: [],
  selectedMaterialIds: [],
  language: null,
};

export async function loadPreferences(): Promise<UserPreferences> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const stored = result[STORAGE_KEY] as Partial<UserPreferences> | undefined;

  return {
    ...DEFAULT_PREFERENCES,
    ...stored,
    selectedCategories: normalizeCategories(stored?.selectedCategories),
    selectedMaterialIds: normalizeMaterialIds(stored?.selectedMaterialIds),
    language: normalizeLanguage(stored?.language),
  };
}

export async function savePreferences(
  preferences: UserPreferences,
): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: preferences });
}

function normalizeCategories(categories: unknown[] | undefined): UISelection[] {
  const valid = new Set<UISelection>(['france', 'europe', 'mixed', 'eco']);
  const migrated = (categories ?? []).map((category) =>
    category === 'mixte' ? 'mixed' : category,
  );

  return [...new Set(migrated.filter(isValidCategory))];

  function isValidCategory(category: unknown): category is UISelection {
    return typeof category === 'string' && valid.has(category as UISelection);
  }
}

function normalizeMaterialIds(materialIds: unknown[] | undefined): number[] {
  return [
    ...new Set(
      (materialIds ?? []).filter(
        (materialId): materialId is number =>
          typeof materialId === 'number' && materialId > 0,
      ),
    ),
  ];
}

function normalizeLanguage(
  language: UserPreferences['language'] | undefined,
): UserPreferences['language'] {
  return language === 'fr' || language === 'en' ? language : null;
}
