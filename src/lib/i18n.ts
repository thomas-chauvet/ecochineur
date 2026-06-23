import en from '../i18n/en.json';
import fr from '../i18n/fr.json';

type Language = 'fr' | 'en';
type Messages = typeof fr;

const dictionaries: Record<Language, Messages> = { fr, en };

export function resolveLanguage(language: string | null | undefined): Language {
  return language?.toLowerCase().startsWith('en') ? 'en' : 'fr';
}

export function createTranslator(language: Language) {
  const dictionary = dictionaries[language];

  return function t(key: keyof Messages): string {
    return dictionary[key] ?? key;
  };
}
