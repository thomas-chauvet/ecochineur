import type { Language } from '../types';

/**
 * The suggestion page on the project site. It embeds the actual form, so the
 * form service can change without a new extension release.
 */
export const SUGGEST_PAGE: Readonly<Record<Language, string>> = {
  fr: 'https://ecochineur.chaurel.ch/fr/suggest.html',
  en: 'https://ecochineur.chaurel.ch/suggest.html',
};

/** Keeps the link short; nobody filters more than a handful of brands. */
export const MAX_PREFILLED_IDS = 5;

export interface SuggestionInput {
  language: Language;
  /** The active tab URL, only when it is a Vinted catalog page. */
  catalogUrl?: string;
  knownBrandIds: ReadonlySet<number>;
}

/**
 * Builds the suggestion page URL. Brand IDs the user already filters on in
 * Vinted, and that EcoChineur does not list, are prefilled: finding the ID is
 * the hardest step for someone suggesting a brand.
 */
export function buildSuggestionUrl({
  language,
  catalogUrl,
  knownBrandIds,
}: SuggestionInput): string {
  const url = new URL(SUGGEST_PAGE[language]);
  if (!catalogUrl) {
    return url.toString();
  }

  const catalog = new URL(catalogUrl);
  const unknownIds = [
    ...new Set(
      catalog.searchParams
        .getAll('brand_ids[]')
        .filter((value) => /^\d+$/.test(value))
        .map(Number)
        .filter((id) => id > 0 && !knownBrandIds.has(id)),
    ),
  ].slice(0, MAX_PREFILLED_IDS);

  if (unknownIds.length > 0) {
    url.searchParams.set('vinted_ids', unknownIds.join(','));
    // IDs are only verified on vinted.fr: tell the reviewer where this one came from.
    url.searchParams.set('vinted_host', catalog.hostname);
  }

  return url.toString();
}
