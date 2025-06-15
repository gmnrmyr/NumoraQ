
import React, { createContext, useContext, ReactNode } from 'react';
import { useFinancialData } from './FinancialDataContext';
import { translations, Language, TranslationKey } from '@/locales';

interface TranslationContextType {
  t: (key: TranslationKey) => string;
  language: Language;
  setLanguage: (language: Language) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const { data, updateUserProfile } = useFinancialData();
  const language = (data.userProfile.language as Language) || 'en';

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const setLanguage = (newLanguage: Language) => {
    updateUserProfile({ language: newLanguage });
  };

  return (
    <TranslationContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
