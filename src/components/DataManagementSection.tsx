
import React from 'react';
import { DataToolbar } from './DataToolbar';
import { CollapsibleSection } from './ui/collapsible-section';
import { useTranslation } from '@/contexts/TranslationContext';

export const DataManagementSection = () => {
  const { t } = useTranslation();
  
  return (
    <CollapsibleSection 
      title={t.dataManagement}
      defaultOpen={false}
      className="mb-4 sm:mb-6"
    >
      <DataToolbar />
    </CollapsibleSection>
  );
};
