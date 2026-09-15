import type { Brand, NaturalMaterial } from '../types';
import brandsJson from './brands.json';
import materialsJson from './material-ids.json';

// JSON imports widen string unions (e.g. `category`) to `string`, so the casts
// are only safe because tests/data.test.ts validates every entry.
export const brands = brandsJson.brands as Brand[];
export const materials = materialsJson.natural_materials as NaturalMaterial[];
