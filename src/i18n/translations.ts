
import { en } from './locales/en';
import { pt } from './locales/pt';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { Language, Translations } from './types';

const translations: Record<Language, Translations> = {
  en,
  pt,
  es,
  fr,
  de,
};

export const getTranslation = (language: Language): Translations => {
  return translations[language] || translations.en;
};

export * from './types';
