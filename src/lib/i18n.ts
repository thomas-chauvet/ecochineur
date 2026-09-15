import en from '../i18n/en.json';
import fr from '../i18n/fr.json';
import type { Language } from '../types';

export type MessageKey = keyof typeof fr;
export type Translator = (key: MessageKey) => string;

// Typing both dictionaries against the French keys makes a missing English key
// a compile error.
const dictionaries: Record<Language, Record<MessageKey, string>> = { fr, en };

/** French for French locales, English for every other Vinted market. */
export function resolveLanguage(language: string | null | undefined): Language {
  return language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export function createTranslator(language: Language): Translator {
  const dictionary = dictionaries[language];

  return (key) => dictionary[key] ?? key;
}
