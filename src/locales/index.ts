
import { en } from './en';
import { ptBR } from './pt-br';

export const translations = {
  en,
  'pt-br': ptBR,
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof en;
