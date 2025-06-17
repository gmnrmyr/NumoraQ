
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, getTranslation } from '@/i18n/translations';

interface TranslationContextType {
  language: Language;
  t: Translations;
  setLanguage: (language: Language) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [t, setT] = useState<Translations>(getTranslation('en'));

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    setT(getTranslation(newLanguage));
    localStorage.setItem('findash-language', newLanguage);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('findash-language') as Language;
    if (savedLanguage && ['en', 'pt', 'es', 'fr', 'de'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.split('-')[0] as Language;
      if (['en', 'pt', 'es', 'fr', 'de'].includes(browserLang)) {
        setLanguage(browserLang);
      }
    }
  }, []);

  return (
    <TranslationContext.Provider value={{ language, t, setLanguage }}>
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
