export const BRAND_CATEGORIES = ['france', 'europe', 'mixed', 'eco'] as const;

export type BrandCategory = (typeof BRAND_CATEGORIES)[number];

export type Language = 'fr' | 'en';

export interface Brand {
  id: string;
  name: string;
  vinted_id: number;
  category: BrandCategory;
  /** Cumulative tag: an eco brand also matches the `eco` filter. */
  eco: boolean;
  certifications: string[];
  description_fr: string;
  description_en: string;
  website: string;
}

export interface NaturalMaterial {
  id: string;
  name_fr: string;
  name_en: string;
  vinted_id: number;
}

export interface UserPreferences {
  selectedCategories: BrandCategory[];
  selectedMaterialIds: number[];
  language: Language | null;
}
