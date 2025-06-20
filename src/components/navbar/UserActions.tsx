
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { UserSettingsPanel } from './UserSettingsPanel';
import { LanguageSelector } from '@/components/LanguageSelector';

export const UserActions: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <LanguageSelector variant="outline" size="sm" />
      <UserSettingsPanel />
    </div>
  );
};
