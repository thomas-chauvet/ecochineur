import {
  BRAND_CATEGORIES,
  type BrandCategory,
  type UserPreferences,
} from '../types';

const STORAGE_KEY = 'ecochineur.preferences';

export async function loadPreferences(): Promise<UserPreferences> {
  const result = await chrome.storage.local.get(STORAGE_KEY);

  return normalizePreferences(result[STORAGE_KEY]);
}

export async function savePreferences(
  preferences: UserPreferences,
): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: preferences });
}

/** Stored values may come from an older extension version: validate all. */
export function normalizePreferences(stored: unknown): UserPreferences {
  const value = (stored ?? {}) as Record<keyof UserPreferences, unknown>;

  return {
    selectedCategories: unique(value.selectedCategories).filter(isCategory),
    selectedMaterialIds: unique(value.selectedMaterialIds).filter(isPositiveId),
    language:
      value.language === 'fr' || value.language === 'en'
        ? value.language
        : null,
  };
}

function unique(value: unknown): unknown[] {
  return Array.isArray(value) ? [...new Set(value)] : [];
}

function isCategory(value: unknown): value is BrandCategory {
  return BRAND_CATEGORIES.includes(value as BrandCategory);
}

function isPositiveId(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) > 0;
}
