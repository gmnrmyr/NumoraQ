
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

export const DashboardHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center space-y-4 py-8">
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-foreground flex items-center justify-center gap-3 brutalist-heading">
        <BarChart3 className="text-accent" size={32} />
        <span className="hidden sm:inline">OPEN FINDASH</span>
        <span className="sm:hidden">OPEN FINDASH</span>
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base font-mono uppercase tracking-wide px-4">
        {t.appDescription}
      </p>
      <div className="w-24 h-1 bg-accent mx-auto"></div>
    </div>
  );
};
