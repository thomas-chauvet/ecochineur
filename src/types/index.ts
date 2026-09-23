export const BRAND_CATEGORIES = [
  'france',
  'france-ofg',
  'europe',
  'france-europe',
  'eco',
] as const;

export type BrandCategory = (typeof BRAND_CATEGORIES)[number];

/**
 * Closed vocabulary for `Brand.certifications`. Free-form strings would let
 * typos accumulate unnoticed in data that TypeScript cannot check.
 */
export const CERTIFICATIONS = [
  'Origine France Garantie',
  'France Terre Textile',
  'Entreprise du Patrimoine Vivant',
  'B Corp',
  'GOTS',
  'Fair Wear Foundation',
  'OEKO-TEX',
  'PETA Approved Vegan',
] as const;

export type Certification = (typeof CERTIFICATIONS)[number];

/** Holding this label is what makes a brand `france-ofg` rather than `france`. */
export const OFG_CERTIFICATION = 'Origine France Garantie';

export type Language = 'fr' | 'en';

export interface Brand {
  id: string;
  name: string;
  vinted_id: number;
  category: BrandCategory;
  /** Cumulative tag: an eco brand also matches the `eco` filter. */
  eco: boolean;
  certifications: Certification[];
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
