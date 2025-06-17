
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

export const DashboardHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center space-y-2">
      <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-slate-800 flex items-center justify-center gap-2 sm:gap-3">
        <BarChart3 className="text-blue-600" size={20} />
        <span className="hidden sm:inline">{t.appTagline}</span>
        <span className="sm:hidden">{t.appName}</span>
      </h1>
      <p className="text-slate-600 text-xs sm:text-sm md:text-base px-4">{t.appDescription}</p>
    </div>
  );
};
