export type BrandCategory = 'france' | 'europe' | 'mixed' | 'eco';

export interface Brand {
  id: string;
  name: string;
  vinted_id: number;
  category: BrandCategory;
  eco: boolean;
  certifications: string[];
  description_fr: string;
  description_en: string;
  website: string;
}

export interface BrandsDatabase {
  db_version: string;
  last_updated: string;
  brands: Brand[];
}

export interface NaturalMaterial {
  id: string;
  name_fr: string;
  name_en: string;
  vinted_id: number;
}

export interface MaterialsDatabase {
  db_version: string;
  natural_materials: NaturalMaterial[];
}

export type UISelection = BrandCategory;

export interface UserPreferences {
  selectedCategories: UISelection[];
  selectedMaterialIds: number[];
  language: 'fr' | 'en' | null;
}
