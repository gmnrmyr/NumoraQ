
import React from 'react';
import { DataToolbar } from './DataToolbar';
import { CollapsibleSection } from './ui/collapsible-section';

export const DataManagementSection = () => {
  return (
    <CollapsibleSection 
      title="Data Management" 
      defaultOpen={false}
      className="mb-6"
    >
      <DataToolbar />
    </CollapsibleSection>
  );
};
